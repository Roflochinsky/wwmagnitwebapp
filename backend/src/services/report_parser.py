import io
import re
import logging
from datetime import datetime
from typing import Optional
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert
from src.models import Employee, Shift, Downtime, BleLog, BleTag, Zone, ProcessedFile
from src.gdrive import DriveService
from src.config import get_settings

logger = logging.getLogger(__name__)


class ReportParser:
    """Парсер Excel-отчётов Report 8/10/11 с автоматической синхронизацией справочников"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.drive_service = DriveService()
        self.settings = get_settings()
        self._employee_cache = {}  # tn_number -> EmployeeId

    async def seed_zones(self):
        """Начальная загрузка справочника зон из документации"""
        zones_data = {
            0: "Вне зоны BLE-маячков",
            1: "Зоны проведения работ",
            2: "Столовые",
            3: "Опасные зоны",
            4: "Курилки",
            5: "Зоны отдыха",
            6: "ВЖГ",
            7: "Туалеты",
            8: "Остановки автобусов",
            9: "Административные помещения",
            10: "Зона выдачи WW",
            11: "Склад",
            12: "Мастерские",
            13: "КПП",
        }
        
        for zid, name in zones_data.items():
            stmt = select(Zone).where(Zone.zone_id == zid)
            res = await self.db.execute(stmt)
            zone = res.scalar_one_or_none()
            if zone:
                zone.name = name
            else:
                self.db.add(Zone(zone_id=zid, name=name))
        
        await self.db.commit()

    async def sync_reference_data(self):
        """Синхронизация справочников из Google Sheets"""
        await self.seed_zones()
        
        # 1. Синхронизация сотрудников (People Mapping)
        if self.settings.sheet_id_people_mapping:
            df_people = self.drive_service.download_sheet_as_df(self.settings.sheet_id_people_mapping)
            if not df_people.empty:
                # Маппинг колонок (эвристика)
                headers = [str(c).strip().lower() for c in df_people.columns]
                idx_tn = next((i for i, h in enumerate(headers) if any(k in h for k in ['тн', 'табель', 'tab'])), None)
                idx_name = next((i for i, h in enumerate(headers) if any(k in h for k in ['фио', 'сотрудник', 'name'])), None)
                idx_dept = next((i for i, h in enumerate(headers) if any(k in h for k in ['участок', 'отдел', 'dept'])), None)
                
                if idx_tn is not None:
                    for _, row in df_people.iterrows():
                        try:
                            tn = self._to_int(row.iloc[idx_tn])
                            if not tn: continue
                            name = str(row.iloc[idx_name]) if idx_name is not None else "Unknown"
                            dept = str(row.iloc[idx_dept]) if idx_dept is not None else None
                            
                            await self._upsert_employee(tn, name, dept)
                        except Exception: continue

        # 2. Синхронизация BLE меток (Journal)
        if self.settings.sheet_id_ble_journal:
            df_ble = self.drive_service.download_sheet_as_df(self.settings.sheet_id_ble_journal)
            if not df_ble.empty:
                # Обычно: A - Номер, D - Описание
                for _, row in df_ble.iterrows():
                    try:
                        tag_num = self._to_int(row.iloc[0])
                        if not tag_num: continue
                        desc = str(row.iloc[3]) if len(row) > 3 else str(row.iloc[1])
                        
                        await self._upsert_ble_tag(tag_num, desc)
                    except Exception: continue
        
        await self.db.commit()

    async def _upsert_employee(self, tn: int, name: str, dept: Optional[str]):
        stmt = select(Employee).where(Employee.tn_number == tn)
        res = await self.db.execute(stmt)
        employee = res.scalar_one_or_none()
        
        if employee:
            employee.name = name
            employee.department = dept
        else:
            self.db.add(Employee(tn_number=tn, name=name, department=dept))

    async def _upsert_ble_tag(self, tag_num: int, desc: str):
        stmt = select(BleTag).where(BleTag.tag_number == tag_num)
        res = await self.db.execute(stmt)
        tag = res.scalar_one_or_none()
        
        if tag:
            tag.description = desc
        else:
            self.db.add(BleTag(tag_number=tag_num, description=desc))

    async def parse_and_save(
        self,
        content: bytes,
        filename: str,
        drive_file_id: Optional[str] = None,
        report_type: str = "auto",
        sync_refs: bool = True,
    ) -> dict:
        import hashlib
        content_hash = hashlib.md5(content).hexdigest()

        # 1. Ищем существующий файл по ИМЕНИ (так как при перезаливке ID может не меняться или меняться)
        # Нам нужно перезаписывать данные, если имя совпадает, а контент разный.
        stmt = select(ProcessedFile).where(ProcessedFile.filename == filename)
        res = await self.db.execute(stmt)
        existing_file = res.scalar_one_or_none()

        if existing_file:
            # Если хеш совпадает — это полный дубль, пропускаем
            if existing_file.content_hash == content_hash:
                logger.info(f"SKIP: {filename} - дубликат (хеш совпадает)")
                return {"report_type": "skipped", "records_count": 0, "status": "duplicate"}
            
            # Если хеш отличается — удаляем старую запись (Cascade удалит и данные)
            logger.info(f"OVERWRITE: {filename} - хеш изменился, перезаписываем")
            await self.db.delete(existing_file)
            await self.db.flush()
        else:
            logger.info(f"NEW FILE: {filename}")

        if sync_refs:
            await self.sync_reference_data()
            
        report_type = self._detect_report_type(filename, report_type)
        logger.info(f"Report type detected: {report_type} for {filename}")

        # Инициализируем ExcelFile перед работой с листами
        xls = pd.ExcelFile(io.BytesIO(content))
        
        # Все отчеты (8, 10, 11) содержат данные на ВТОРОМ листе (index 1).
        # Если второго листа нет, берем первый.
        sheet_index = 1 
        sheet_name = xls.sheet_names[sheet_index] if len(xls.sheet_names) > sheet_index else xls.sheet_names[0]
        logger.info(f"Reading sheet '{sheet_name}' (index {sheet_index}) from {filename}")
        df = xls.parse(sheet_name)
        logger.info(f"DataFrame shape: {df.shape}, columns: {list(df.columns)[:10]}...")
        if not df.empty:
            logger.info(f"First row sample: {dict(df.iloc[0])}")

        # Используем content_hash как уникальный ID для идемпотентности, 
        # или drive_file_id если он есть, но для внутреннего учета.
        final_file_id = drive_file_id if drive_file_id else f"{filename}_{datetime.now().timestamp()}"

        processed = ProcessedFile(
            file_id=final_file_id,
            filename=filename,
            content_hash=content_hash,
            report_type=report_type,
            processed_at=datetime.now(),
            records_count=0, # Будет обновлено ниже
        )
        self.db.add(processed)
        await self.db.flush()  # Чтобы получить processed.id

        if report_type == "report8":
            records_count = await self._parse_report8(df, processed.id)
        elif report_type == "report10":
            records_count = await self._parse_report10(df, processed.id)
        elif report_type == "report11":
            records_count = await self._parse_report11(df, processed.id)
        else:
            raise ValueError(f"Неизвестный тип отчёта: {report_type}")

        processed.records_count = records_count
        await self.db.commit()

        return {"report_type": report_type, "records_count": records_count, "status": "processed"}

    def _detect_report_type(self, filename: str, hint: str) -> str:
        if hint != "auto":
            return hint

        lower = filename.lower()
        
        # Report 11 (BLE Logs) headers
        # Check for "11_", "ble", "aa_ble" (latin/cyrillic safe)
        if any(m in lower for m in ["report_11", "report11", "aa_ble", "ble", "11_otchet", "11_отчет", "11_"]):
            return "report11"

        # Report 8 (Shifts)
        if any(m in lower for m in ["report_8", "report8", "8_otchet", "8_отчет", "8_"]):
            return "report8"

        # Report 10 (Downtime) is the default, but check explicitly too
        if any(m in lower for m in ["report_10", "report10", "10_otchet", "10_отчет", "10_"]):
            return "report10"

        return "report10"

    async def _load_employee_cache(self):
        """Предзагрузка всех сотрудников в кеш"""
        stmt = select(Employee.id, Employee.tn_number)
        result = await self.db.execute(stmt)
        for row in result:
            self._employee_cache[row.tn_number] = row.id

    async def _get_or_create_employee_id(self, tn_number: int, name: str) -> int:
        """Получает ID сотрудника из кеша или создает нового"""
        if tn_number in self._employee_cache:
            return self._employee_cache[tn_number]

        # Если нет в кеше, ищем в БД (на случай если добавили в процессе)
        stmt = select(Employee.id).where(Employee.tn_number == tn_number)
        result = await self.db.execute(stmt)
        emp_id = result.scalar_one_or_none()

        if not emp_id:
            employee = Employee(tn_number=tn_number, name=name)
            self.db.add(employee)
            await self.db.flush()
            emp_id = employee.id

        self._employee_cache[tn_number] = emp_id
        return emp_id

    async def _parse_report8(self, df: pd.DataFrame, processed_file_id: int) -> int:
        """Парсинг Report 8 (смены) с использованием Bulk Insert"""
        await self._load_employee_cache()
        df = self._normalize_columns(df)
        records = df.to_dict('records')
        
        objs = []
        for row in records:
            try:
                tn = self._extract_tn(row)
                if not tn: continue

                date_val = self._parse_date(row.get("date"))
                date_begin = self._parse_datetime(row.get("date_begin"))
                date_end = self._parse_datetime(row.get("date_end"))

                if not date_val or not date_begin or not date_end:
                    continue

                emp_id = await self._get_or_create_employee_id(tn, str(row.get("ФИО", "Unknown")))

                objs.append(Shift(
                    employee_id=emp_id,
                    processed_file_id=processed_file_id,
                    date=date_val,
                    date_begin=date_begin,
                    date_end=date_end,
                    full_go_percent=self._to_float(row.get("full_go")),
                    full_idle_percent=self._to_float(row.get("full_idle")),
                    full_work_percent=self._to_float(row.get("full_work")),
                    full_go_seconds=self._to_int(row.get("full_go_seconds")),
                    full_idle_seconds=self._to_int(row.get("full_idle_seconds")),
                    full_work_seconds=self._to_int(row.get("full_work_seconds")),
                ))
            except Exception:
                continue

        if objs:
            self.db.add_all(objs)
            await self.db.commit()
        return len(objs)

    async def _parse_report10(self, df: pd.DataFrame, processed_file_id: int) -> int:
        """Парсинг Report 10 (простои) с использованием Bulk Insert"""
        await self._load_employee_cache()
        df = self._normalize_columns(df)
        records = df.to_dict('records')
        
        objs = []
        for row in records:
            try:
                tn = self._extract_tn(row)
                if not tn: continue

                dt_start = self._parse_datetime(row.get("dt_start"))
                dt_end = self._parse_datetime(row.get("dt_end"))

                if not dt_start or not dt_end:
                    continue

                emp_id = await self._get_or_create_employee_id(tn, str(row.get("ФИО", "Unknown")))

                objs.append(Downtime(
                    employee_id=emp_id,
                    processed_file_id=processed_file_id,
                    dt_start=dt_start,
                    dt_end=dt_end,
                    duration_minutes=self._to_int(row.get("duration", 0)),
                    ble_tag_id=self._to_int(row.get("chosen_ble_tag_number")),
                ))
            except Exception:
                continue

        if objs:
            self.db.add_all(objs)
            await self.db.commit()
        return len(objs)

    async def _parse_report11(self, df: pd.DataFrame, processed_file_id: int) -> int:
        """Парсинг Report 11 (BLE логи) с использованием Bulk Insert"""
        await self._load_employee_cache()
        df = self._normalize_columns(df)
        records = df.to_dict('records')
        
        objs = []
        for row in records:
            try:
                tn = self._extract_tn(row)
                if not tn: continue
                
                shift_day = self._parse_date(row.get("shift_day"))
                time_only_raw = row.get("time_only")
                time_only = self._parse_datetime(time_only_raw)

                if not shift_day or not time_only:
                    continue

                ble_tag_val = self._to_int(row.get("ble_tag"))
                if ble_tag_val is None:
                    continue

                emp_id = await self._get_or_create_employee_id(tn, "Unknown")
                full_time = datetime.combine(shift_day, time_only.time())

                objs.append(BleLog(
                    employee_id=emp_id,
                    processed_file_id=processed_file_id,
                    shift_day=shift_day,
                    time_only=full_time,
                    ble_tag=ble_tag_val,
                    zone_id=self._to_int(row.get("zone_id")) or 1,
                ))
            except Exception:
                continue

        if objs:
            self.db.add_all(objs)
            await self.db.commit()
        return len(objs)

    def _normalize_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        rename_map = {}
        lower_map = {str(c).strip().lower(): c for c in df.columns}

        mappings = {
            "тн": "tn",
            "табельный номер": "tn",
            "фио": "ФИО",
            "dt_start": "dt_start",
            "начало простоя": "dt_start",
            "dt_end": "dt_end",
            "конец простоя": "dt_end",
            "duration": "duration",
            "длительность": "duration",
            "chosen_ble_tag_number": "chosen_ble_tag_number",
            # Report 11 mappings - исправленные на реальные названия из Excel
            "день смены": "shift_day",
            "shift_day": "shift_day",
            "время на объекте": "time_only",  # ИСПРАВЛЕНО: было "время"
            "время": "time_only",
            "time_only": "time_only",
            "metka": "ble_tag",               # ДОБАВЛЕНО: реальное название
            "метка": "ble_tag",
            "ble_tag": "ble_tag",
            "zona": "zone_id",                # ДОБАВЛЕНО: реальное название
            "зона": "zone_id",
            "zone_id": "zone_id",
        }

        for key, target in mappings.items():
            if key in lower_map:
                rename_map[lower_map[key]] = target

        return df.rename(columns=rename_map)

    def _extract_tn(self, row) -> Optional[int]:
        for key in ["tn", "тн", "ТН", "табельный номер"]:
            val = row.get(key)
            if pd.notna(val):
                return self._to_int(val)
        return None

    def _parse_date(self, val):
        if pd.isna(val):
            return None
        if isinstance(val, datetime):
            return val.date()
        try:
            return pd.to_datetime(val, dayfirst=True).date()
        except Exception:
            return None

    def _parse_datetime(self, val):
        if pd.isna(val):
            return None
        if isinstance(val, datetime):
            return val
        try:
            str_val = str(val).strip()
            # Обработка формата HH:MM (только время без даты)
            if re.match(r'^\d{1,2}:\d{2}$', str_val):
                # Парсим как время, добавляем фиктивную дату (будет заменена позже)
                return datetime.strptime(str_val, '%H:%M')
            return pd.to_datetime(val, dayfirst=True)
        except Exception:
            return None

    def _to_float(self, val) -> Optional[float]:
        if pd.isna(val):
            return None
        try:
            return float(str(val).replace(",", "."))
        except Exception:
            return None

    def _to_int(self, val) -> Optional[int]:
        if pd.isna(val):
            return None
        try:
            return int(float(val))
        except Exception:
            return None
