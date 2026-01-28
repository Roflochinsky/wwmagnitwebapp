from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, timedelta
from src.database import get_db
from src.models import Employee, Shift, Downtime, BleLog

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

    # Base Shift Aggregates
    stmt_shifts = select(
        func.count(Shift.id).label("total_shifts"),
        func.avg(Shift.full_work_percent).label("avg_work_pct"),
        func.avg(Shift.full_idle_percent).label("avg_idle_pct"),
        func.avg(Shift.full_go_percent).label("avg_go_pct"),
        func.sum(Shift.full_work_seconds).label("sum_work_sec"),
        func.sum(Shift.full_idle_seconds).label("sum_idle_sec"),
        func.sum(Shift.full_go_seconds).label("sum_go_sec"),
    ).where(Shift.date.between(date_from, date_to))

    result_shifts = await db.execute(stmt_shifts)
    row_shifts = result_shifts.one()
    
    total_shifts = row_shifts.total_shifts or 1
    if total_shifts == 0:
        total_shifts = 1

    # Raw Log Counts (1 row = 1 minute)
    # Work Zone (id=1)
    stmt_work_logs = select(func.count(BleLog.id)).where(
        BleLog.shift_day.between(date_from, date_to),
        BleLog.zone_id == 1
    )
    work_logs_count = (await db.execute(stmt_work_logs)).scalar() or 0

    # Rest Zone (id=5)
    stmt_rest_logs = select(func.count(BleLog.id)).where(
        BleLog.shift_day.between(date_from, date_to),
        BleLog.zone_id == 5
    )
    rest_logs_count = (await db.execute(stmt_rest_logs)).scalar() or 0

    # Calculate Averages (Minutes per Shift)
    avg_work_min_logs = round(work_logs_count / total_shifts)
    avg_rest_min_logs = round(rest_logs_count / total_shifts)

    # Legacy Shift-based calculations (for Activity/Idle which might not have zone_id)
    # Keeping them for consistency with previous "Activity" definition unless requested to change
    def calc_avg_min_from_sec(sum_seconds):
        if not sum_seconds:
            return 0
        return round((sum_seconds / 60) / total_shifts)

    # Combined Activity (Work + Go)
    avg_work_pct = row_shifts.avg_work_pct or 0
    avg_go_pct = row_shifts.avg_go_pct or 0
    activity_pct = avg_work_pct + avg_go_pct
    
    total_activity_min = calc_avg_min_from_sec((row_shifts.sum_work_sec or 0) + (row_shifts.sum_go_sec or 0))
    
    return {
        "period": {
            "from": date_from.isoformat(),
            "to": date_to.isoformat(),
        },
        # KPI: Activity (Shift-based)
        "activity": {
            "percent": round(activity_pct, 1),
            "minutes": total_activity_min
        },
        # KPI: Idle (Shift-based)
        "idle": {
            "percent": round(row_shifts.avg_idle_pct or 0, 1),
            "minutes": calc_avg_min_from_sec(row_shifts.sum_idle_sec)
        },
        # KPI: Work Zone (Log-based, zone_id=1)
        "work_zone": {
            "percent": round(avg_work_pct, 1), # Keep pct from Shift for now OR calculate from time? Shift pct is more accurate for "share of shift"
            "minutes": avg_work_min_logs
        },
        # KPI: Rest Zone (Log-based, zone_id=5)
        # Replacing 'start_zone' logic with Rest Zone data
        "start_zone": {
             "percent": round(avg_go_pct, 1), # Placeholder pct (maybe should be avg_rest_pct if we had it)
             "minutes": avg_rest_min_logs
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


@router.get("/top-performers")
async def get_top_performers(
    date_from: date = Query(default=None),
    date_to: date = Query(default=None),
    order: str = Query(default="desc", regex="^(asc|desc)$"),
    metric: str = Query(default="work", regex="^(work|idle|rest)$"),
    limit: int = Query(default=5),
    db: AsyncSession = Depends(get_db),
):
    """Топ сотрудников по эффективности, простою или отдыху"""
    if not date_from:
        date_from = date.today() - timedelta(days=7)
    if not date_to:
        date_to = date.today()

    # Select column based on metric
    if metric == "idle":
        target_col = func.avg(Shift.full_idle_percent).label("value_pct")
    elif metric == "rest":
        target_col = func.avg(Shift.full_go_percent).label("value_pct")
    else:
        target_col = func.avg(Shift.full_work_percent).label("value_pct")

    # Calculate average percent per employee
    stmt = (
        select(
            Employee.id,
            Employee.name,
            Employee.department,
            target_col
        )
        .join(Shift, Shift.employee_id == Employee.id)
        .where(Shift.date.between(date_from, date_to))
        .group_by(Employee.id, Employee.name, Employee.department)
    )

    # Sort
    if order == "asc":
        stmt = stmt.order_by(target_col.asc())
    else:
        stmt = stmt.order_by(target_col.desc())

    stmt = stmt.limit(limit)

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "id": row.id,
            "name": row.name,
            "department": row.department,
            "value": round(row.value_pct or 0), # Percent
            "avatar_url": None, 
            "trend": "up" # Placeholder
        }
        for row in rows
    ]
