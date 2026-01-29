from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, distinct
from src.database import get_db
from src.models import ProcessedFile

router = APIRouter()

@router.get("/", response_model=List[str])
async def get_objects(db: AsyncSession = Depends(get_db)):
    """Получить список всех доступных объектов (из обработанных файлов)"""
    stmt = select(distinct(ProcessedFile.object_name)).where(ProcessedFile.object_name.is_not(None))
    result = await db.execute(stmt)
    objects = [row[0] for row in result.all()]
    return sorted(objects)
