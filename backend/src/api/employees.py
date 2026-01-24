from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from src.database import get_db
from src.models import Employee, Shift, Downtime

router = APIRouter()


@router.get("/")
async def list_employees(
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    """Список сотрудников"""
    stmt = select(Employee).offset(offset).limit(limit)
    result = await db.execute(stmt)
    employees = result.scalars().all()

    return [
        {
            "id": e.id,
            "tn_number": e.tn_number,
            "name": e.name,
            "department": e.department,
        }
        for e in employees
    ]


@router.get("/{tn_number}")
async def get_employee(
    tn_number: int,
    db: AsyncSession = Depends(get_db),
):
    """Информация о сотруднике"""
    stmt = select(Employee).where(Employee.tn_number == tn_number)
    result = await db.execute(stmt)
    employee = result.scalar_one_or_none()

    if not employee:
        return {"error": "Сотрудник не найден"}

    return {
        "id": employee.id,
        "tn_number": employee.tn_number,
        "name": employee.name,
        "department": employee.department,
    }


@router.get("/{tn_number}/shifts")
async def get_employee_shifts(
    tn_number: int,
    limit: int = 30,
    db: AsyncSession = Depends(get_db),
):
    """Смены сотрудника"""
    stmt = (
        select(Shift)
        .join(Employee)
        .where(Employee.tn_number == tn_number)
        .order_by(Shift.date.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    shifts = result.scalars().all()

    return [
        {
            "date": s.date.isoformat(),
            "date_begin": s.date_begin.isoformat(),
            "date_end": s.date_end.isoformat(),
            "full_go_percent": s.full_go_percent,
            "full_idle_percent": s.full_idle_percent,
            "full_work_percent": s.full_work_percent,
        }
        for s in shifts
    ]


@router.get("/{tn_number}/downtimes")
async def get_employee_downtimes(
    tn_number: int,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Простои сотрудника"""
    stmt = (
        select(Downtime)
        .join(Employee)
        .where(Employee.tn_number == tn_number)
        .order_by(Downtime.dt_start.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    downtimes = result.scalars().all()

    return [
        {
            "dt_start": d.dt_start.isoformat(),
            "dt_end": d.dt_end.isoformat(),
            "duration_minutes": d.duration_minutes,
            "ble_tag_id": d.ble_tag_id,
        }
        for d in downtimes
    ]
