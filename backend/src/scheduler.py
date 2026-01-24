import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from src.database import async_session
from src.gdrive import DriveService
from src.services.report_parser import ReportParser

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def sync_drive_files():
    """Фоновая задача: синхронизация файлов с Google Drive"""
    logger.info("🔄 Начало автоматической синхронизации с Google Drive...")
    
    async with async_session() as db:
        drive = DriveService()
        parser = ReportParser(db)
        
        processed = 0
        errors = 0
        
        try:
            files = drive.list_excel_files()
            logger.info(f"📁 Найдено {len(files)} файлов в Google Drive")
            
            for file_info in files:
                try:
                    content = drive.download_file(file_info["id"])
                    await parser.parse_and_save(content, file_info["name"], sync_refs=False)
                    processed += 1
                except Exception as e:
                    logger.error(f"❌ Ошибка обработки {file_info['name']}: {e}")
                    errors += 1
            
            # Синхронизация справочников
            await parser.sync_reference_data()
            
        except Exception as e:
            logger.error(f"❌ Ошибка доступа к Google Drive: {e}")
    
    logger.info(f"✅ Синхронизация завершена: {processed} файлов, {errors} ошибок")


def start_scheduler():
    """Запуск планировщика"""
    scheduler.add_job(
        sync_drive_files,
        trigger=IntervalTrigger(hours=4),
        id="sync_drive_files",
        name="Sync files from Google Drive",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("⏰ Планировщик запущен: синхронизация каждые 4 часа")


def stop_scheduler():
    """Остановка планировщика"""
    scheduler.shutdown()
    logger.info("⏰ Планировщик остановлен")
