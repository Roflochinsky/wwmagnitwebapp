from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.gdrive import DriveService
from src.services.report_parser import ReportParser

router = APIRouter(prefix="/sync", tags=["sync"])


@router.post("/drive")
async def sync_from_drive(db: AsyncSession = Depends(get_db)):
    """
    Синхронизация файлов с Google Drive.
    Скачивает все Excel-файлы из указанных папок и загружает в БД.
    """
    drive = DriveService()
    parser = ReportParser(db)
    
    results = []
    errors = []
    
    try:
        files = drive.list_excel_files()
    except Exception as e:
        return {"success": False, "error": f"Ошибка доступа к Google Drive: {str(e)}"}
    
    for file_info in files:
        file_id = file_info["id"]
        filename = file_info["name"]
        
        try:
            content = drive.download_file(file_id)
            result = await parser.parse_and_save(content, filename, sync_refs=False)
            results.append({
                "filename": filename,
                "report_type": result["report_type"],
                "records": result["records_count"]
            })
        except Exception as e:
            errors.append({"filename": filename, "error": str(e)})
    
    # Синхронизация справочников один раз в конце
    try:
        await parser.sync_reference_data()
    except Exception as e:
        errors.append({"action": "sync_reference_data", "error": str(e)})
    
    return {
        "success": True,
        "processed": len(results),
        "files": results,
        "errors": errors
    }


@router.post("/references")
async def sync_references_only(db: AsyncSession = Depends(get_db)):
    """
    Синхронизация только справочников из Google Sheets (сотрудники, метки, зоны).
    """
    parser = ReportParser(db)
    
    try:
        await parser.sync_reference_data()
        return {"success": True, "message": "Справочники синхронизированы"}
    except Exception as e:
        return {"success": False, "error": str(e)}
