from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, timedelta
from src.database import get_db
from src.models import Employee, Shift, Downtime

router = APIRouter()


@router.get("/overview")
async def get_overview_stats(
    date_from: date = Query(default=None),
    date_to: date = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """Общая статистика"""
    if not date_from:
        date_from = date.today() - timedelta(days=7)
    if not date_to:
        date_to = date.today()

    employees_count = await db.execute(select(func.count(Employee.id)))
    total_employees = employees_count.scalar()

    shifts_stmt = select(func.count(Shift.id)).where(
        Shift.date.between(date_from, date_to)
    )
    shifts_count = await db.execute(shifts_stmt)
    total_shifts = shifts_count.scalar()

    downtimes_stmt = select(
        func.count(Downtime.id),
        func.sum(Downtime.duration_minutes),
    ).where(
        func.date(Downtime.dt_start).between(date_from, date_to)
    )
    downtime_result = await db.execute(downtimes_stmt)
    downtime_row = downtime_result.one()

    return {
        "period": {
            "from": date_from.isoformat(),
            "to": date_to.isoformat(),
        },
        "total_employees": total_employees,
        "total_shifts": total_shifts,
        "total_downtimes": downtime_row[0] or 0,
        "total_downtime_minutes": downtime_row[1] or 0,
    }


@router.get("/activity")
async def get_activity_stats(
    date_from: date = Query(default=None),
    date_to: date = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """Статистика активности"""
    if not date_from:
        date_from = date.today() - timedelta(days=7)
    if not date_to:
        date_to = date.today()

    stmt = select(
        func.avg(Shift.full_work_percent).label("avg_work"),
        func.avg(Shift.full_idle_percent).label("avg_idle"),
        func.avg(Shift.full_go_percent).label("avg_go"),
    ).where(Shift.date.between(date_from, date_to))

    result = await db.execute(stmt)
    row = result.one()

    return {
        "period": {
            "from": date_from.isoformat(),
            "to": date_to.isoformat(),
        },
        "avg_work_percent": round(row.avg_work or 0, 2),
        "avg_idle_percent": round(row.avg_idle or 0, 2),
        "avg_go_percent": round(row.avg_go or 0, 2),
    }


@router.get("/daily")
async def get_daily_stats(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
):
    """Статистика по дням"""
    date_from = date.today() - timedelta(days=days)

    stmt = (
        select(
            Shift.date,
            func.count(Shift.id).label("shifts_count"),
            func.avg(Shift.full_work_percent).label("avg_work"),
            func.avg(Shift.full_idle_percent).label("avg_idle"),
        )
        .where(Shift.date >= date_from)
        .group_by(Shift.date)
        .order_by(Shift.date)
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "date": row.date.isoformat(),
            "shifts_count": row.shifts_count,
            "avg_work_percent": round(row.avg_work or 0, 2),
            "avg_idle_percent": round(row.avg_idle or 0, 2),
        }
        for row in rows
    ]
