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
        func.sum(Shift.full_work_seconds).label("sum_work_sec"),
        func.sum(Shift.full_idle_seconds).label("sum_idle_sec"),
        func.sum(Shift.full_go_seconds).label("sum_go_sec"),
    ).where(Shift.date.between(date_from, date_to))

    result = await db.execute(stmt)
    row = result.one()
    
    # Расчет в минутах для "Мин/%"
    # Активность = Work + Go
    avg_work = row.avg_work or 0
    avg_go = row.avg_go or 0
    avg_idle = row.avg_idle or 0
    
    activity_percent = avg_work + avg_go
    
    # Приводим к 100% если сумма больше (из-за округлений) или считаем activity как 100 - idle?
    # User Request: Активность=Work_sec (+ Go_sec в дашборде)
    # Но для KPI карточек "Мин/%" нам нужны абсолютные значения
    
    total_work_sec = row.sum_work_sec or 0
    total_go_sec = row.sum_go_sec or 0
    total_idle_sec = row.sum_idle_sec or 0
    
    total_activity_sec = total_work_sec + total_go_sec
    
    def to_min(seconds):
        return round(seconds / 60)

    return {
        "period": {
            "from": date_from.isoformat(),
            "to": date_to.isoformat(),
        },
        # KPI: Activity
        "activity": {
            "percent": round(activity_percent, 1),
            "minutes": to_min(total_activity_sec)
        },
        # KPI: Idle
        "idle": {
            "percent": round(avg_idle, 1),
            "minutes": to_min(total_idle_sec)
        },
        # KPI: Work Zone
        "work_zone": {
            "percent": round(avg_work, 1),
            "minutes": to_min(total_work_sec)
        },
        # KPI: Go/Rest Zone (если Go считать как отдых/перемещение? Нет, Go это перемещение)
        # В запросе KPI "Нахождение в зоне отдыха" -> это Idle или отдельная зона?
        # Пока мапим Go на "Перемещение" или Rest Zone если есть такая логика
        # Для "Нахождение в зоне отдыха" у нас нет явного поля, используем Idle как базу
        "start_zone": { # Placeholder name, logic needs clarification if "Rest Zone" != Idle
             "percent": round(avg_go, 1), # Using Go as 4th card for now
             "minutes": to_min(total_go_sec)
        }
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
