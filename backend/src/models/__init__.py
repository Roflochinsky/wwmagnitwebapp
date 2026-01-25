from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.database import Base


class Employee(Base):
    """Сотрудники"""
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    tn_number = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=True)

    shifts = relationship("Shift", back_populates="employee")
    downtimes = relationship("Downtime", back_populates="employee")
    ble_logs = relationship("BleLog", back_populates="employee")


class Shift(Base):
    """Смены (Report 8)"""
    __tablename__ = "shifts"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    processed_file_id = Column(Integer, ForeignKey("processed_files.id", ondelete="CASCADE"), nullable=True)
    date = Column(Date, nullable=False, index=True)
    date_begin = Column(DateTime, nullable=False)
    date_end = Column(DateTime, nullable=False)
    total_hours = Column(Float, nullable=True)
    full_go_percent = Column(Float, nullable=True)
    full_idle_percent = Column(Float, nullable=True)
    full_work_percent = Column(Float, nullable=True)
    full_go_seconds = Column(Integer, nullable=True)
    full_idle_seconds = Column(Integer, nullable=True)
    full_work_seconds = Column(Integer, nullable=True)

    employee = relationship("Employee", back_populates="shifts")
    processed_file = relationship("ProcessedFile", back_populates="shifts")


class Downtime(Base):
    """Простои (Report 10)"""
    __tablename__ = "downtimes"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    processed_file_id = Column(Integer, ForeignKey("processed_files.id", ondelete="CASCADE"), nullable=True)
    dt_start = Column(DateTime, nullable=False, index=True)
    dt_end = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    ble_tag_id = Column(Integer, nullable=True)

    employee = relationship("Employee", back_populates="downtimes")
    processed_file = relationship("ProcessedFile", back_populates="downtimes")


class BleLog(Base):
    """Логи BLE (Report 11)"""
    __tablename__ = "ble_logs"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    processed_file_id = Column(Integer, ForeignKey("processed_files.id", ondelete="CASCADE"), nullable=True)
    shift_day = Column(Date, nullable=False, index=True)
    time_only = Column(DateTime, nullable=False)
    ble_tag = Column(Integer, nullable=False)
    zone_id = Column(Integer, nullable=True)

    employee = relationship("Employee", back_populates="ble_logs")
    processed_file = relationship("ProcessedFile", back_populates="ble_logs")


class BleTag(Base):
    """Справочник BLE-меток"""
    __tablename__ = "ble_tags"

    id = Column(Integer, primary_key=True, index=True)
    tag_number = Column(Integer, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)


class Zone(Base):
    """Справочник зон"""
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, unique=True, nullable=False)
    name = Column(String(255), nullable=False)


class ProcessedFile(Base):
    """Обработанные файлы (для отслеживания)"""
    __tablename__ = "processed_files"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(String(255), unique=True, nullable=False)
    filename = Column(String(255), nullable=False)
    content_hash = Column(String(32), nullable=True)
    report_type = Column(String(50), nullable=False)
    processed_at = Column(DateTime, nullable=False)
    records_count = Column(Integer, nullable=True)

    shifts = relationship("Shift", back_populates="processed_file", cascade="all, delete")
    downtimes = relationship("Downtime", back_populates="processed_file", cascade="all, delete")
    ble_logs = relationship("BleLog", back_populates="processed_file", cascade="all, delete")
