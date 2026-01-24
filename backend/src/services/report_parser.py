import io
import re
from datetime import datetime
from typing import Optional
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.models import Employee, Shift, Downtime, BleLog, ProcessedFile


class ReportParser:
    """Парсер Excel-отчётов Report 8/10/11"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def parse_and_save(
        self,
        content: bytes,
        filename: str,
        report_type: str = "auto",
    ) -> dict:
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
