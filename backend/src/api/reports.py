from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.services.report_parser import ReportParser

router = APIRouter()


@router.post("/upload")
async def upload_report(
    file: UploadFile = File(...),
    report_type: str = "auto",
    db: AsyncSession = Depends(get_db),
):
    """
    Загрузка отчёта вручную.
    report_type: auto, report8, report10, report11
    """
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Только Excel файлы (.xlsx, .xls)")

    content = await file.read()
    parser = ReportParser(db)

    try:
        result = await parser.parse_and_save(content, file.filename, report_type)
        return {
            "success": True,
            "filename": file.filename,
            "report_type": result["report_type"],
            "records_inserted": result["records_count"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/processed")
async def list_processed_files(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Список обработанных файлов"""
    from sqlalchemy import select
    from src.models import ProcessedFile

    stmt = select(ProcessedFile).order_by(ProcessedFile.processed_at.desc()).limit(limit)
    result = await db.execute(stmt)
    files = result.scalars().all()

    return [
        {
            "id": f.id,
            "filename": f.filename,
            "report_type": f.report_type,
            "processed_at": f.processed_at.isoformat(),
            "records_count": f.records_count,
        }
        for f in files
    ]
