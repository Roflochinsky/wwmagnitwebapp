import io
import re
from datetime import datetime
from typing import Optional
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert
from src.models import Employee, Shift, Downtime, BleLog, BleTag, Zone, ProcessedFile
from src.gdrive import DriveService
from src.config import get_settings


class ReportParser:
    """Парсер Excel-отчётов Report 8/10/11 с автоматической синхронизацией справочников"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.drive_service = DriveService()
        self.settings = get_settings()

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
        report_type: str = "auto",
        sync_refs: bool = True,
    ) -> dict:
        if sync_refs:
            await self.sync_reference_data()
            
        report_type = self._detect_report_type(filename, report_type)

        xls = pd.ExcelFile(io.BytesIO(content))
        sheet_index = 0 if report_type == "report11" else 1
        sheet_name = xls.sheet_names[sheet_index] if len(xls.sheet_names) > sheet_index else xls.sheet_names[0]
        df = xls.parse(sheet_name)

        if report_type == "report8":
            records_count = await self._parse_report8(df)
        elif report_type == "report10":
            records_count = await self._parse_report10(df)
        elif report_type == "report11":
            records_count = await self._parse_report11(df)
        else:
            raise ValueError(f"Неизвестный тип отчёта: {report_type}")

        processed = ProcessedFile(
            file_id=f"{filename}_{datetime.now().timestamp()}",
            filename=filename,
            report_type=report_type,
            processed_at=datetime.now(),
            records_count=records_count,
        )
        self.db.add(processed)
        await self.db.commit()

        return {"report_type": report_type, "records_count": records_count}

    def _detect_report_type(self, filename: str, hint: str) -> str:
        if hint != "auto":
            return hint

        lower = filename.lower()
        if "report_8" in lower or "report8" in lower:
            return "report8"
        if "report_10" in lower or "report10" in lower:
            return "report10"
        if "report_11" in lower or "report11" in lower or "aa_ble" in lower:
            return "report11"

        return "report10"

    async def _get_or_create_employee(self, tn_number: int, name: str) -> Employee:
        stmt = select(Employee).where(Employee.tn_number == tn_number)
        result = await self.db.execute(stmt)
        employee = result.scalar_one_or_none()

        if not employee:
            employee = Employee(tn_number=tn_number, name=name)
            self.db.add(employee)
            await self.db.flush()

        return employee

    async def _parse_report8(self, df: pd.DataFrame) -> int:
        """Парсинг Report 8 (смены)"""
        df = self._normalize_columns(df)
        count = 0

        for _, row in df.iterrows():
            try:
                tn = self._extract_tn(row)
                name = str(row.get("ФИО", row.get("fio", "Unknown")))
                if not tn:
                    continue

                employee = await self._get_or_create_employee(tn, name)

                shift = Shift(
                    employee_id=employee.id,
                    date=self._parse_date(row.get("date")),
                    date_begin=self._parse_datetime(row.get("date_begin")),
                    date_end=self._parse_datetime(row.get("date_end")),
                    full_go_percent=self._to_float(row.get("full_go")),
                    full_idle_percent=self._to_float(row.get("full_idle")),
                    full_work_percent=self._to_float(row.get("full_work")),
                    full_go_seconds=self._to_int(row.get("full_go_seconds")),
                    full_idle_seconds=self._to_int(row.get("full_idle_seconds")),
                    full_work_seconds=self._to_int(row.get("full_work_seconds")),
                )
                self.db.add(shift)
                count += 1
            except Exception:
                continue

        await self.db.commit()
        return count

    async def _parse_report10(self, df: pd.DataFrame) -> int:
        """Парсинг Report 10 (простои)"""
        df = self._normalize_columns(df)
        count = 0

        for _, row in df.iterrows():
            try:
                tn = self._extract_tn(row)
                name = str(row.get("ФИО", row.get("fio", "Unknown")))
                if not tn:
                    continue

                employee = await self._get_or_create_employee(tn, name)

                downtime = Downtime(
                    employee_id=employee.id,
                    dt_start=self._parse_datetime(row.get("dt_start")),
                    dt_end=self._parse_datetime(row.get("dt_end")),
                    duration_minutes=self._to_int(row.get("duration", 0)),
                    ble_tag_id=self._to_int(row.get("chosen_ble_tag_number")),
                )
                self.db.add(downtime)
                count += 1
            except Exception:
                continue

        await self.db.commit()
        return count

    async def _parse_report11(self, df: pd.DataFrame) -> int:
        """Парсинг Report 11 (BLE логи)"""
        df = self._normalize_columns(df)
        count = 0

        for _, row in df.iterrows():
            try:
                tn = self._extract_tn(row)
                if not tn:
                    continue

                employee = await self._get_or_create_employee(tn, "Unknown")

                ble_log = BleLog(
                    employee_id=employee.id,
                    shift_day=self._parse_date(row.get("shift_day", row.get("день смены"))),
                    time_only=self._parse_datetime(row.get("time_only", row.get("время"))),
                    ble_tag=self._to_int(row.get("ble_tag", row.get("метка", 0))),
                    zone_id=self._to_int(row.get("zone_id", row.get("зона"))),
                )
                self.db.add(ble_log)
                count += 1
            except Exception:
                continue

        await self.db.commit()
        return count

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
