import io
from typing import Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from src.config import get_settings


class DriveService:
    """Сервис для работы с Google Drive API"""

    SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

    def __init__(self):
        settings = get_settings()
        self.folder_id = settings.google_drive_folder_id
        self.credentials_path = settings.google_credentials_path
        self._service = None

    def _get_service(self):
        if self._service is None:
            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=self.SCOPES,
            )
            self._service = build("drive", "v3", credentials=credentials)
        return self._service

    def list_excel_files(self, folder_id: Optional[str] = None) -> list:
        """Список Excel-файлов в папке"""
        service = self._get_service()
        target_folder = folder_id or self.folder_id

        query = (
            f"'{target_folder}' in parents and "
            "(mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' "
            "or mimeType='application/vnd.ms-excel') "
            "and trashed=false"
        )

        results = (
            service.files()
            .list(
                q=query,
                fields="files(id, name, createdTime, modifiedTime)",
                orderBy="modifiedTime desc",
            )
            .execute()
        )

        return results.get("files", [])

    def download_file(self, file_id: str) -> bytes:
        """Скачать файл по ID"""
        service = self._get_service()
        request = service.files().get_media(fileId=file_id)

        buffer = io.BytesIO()
        downloader = MediaIoBaseDownload(buffer, request)

        done = False
        while not done:
            _, done = downloader.next_chunk()

        buffer.seek(0)
        return buffer.read()

    def get_file_metadata(self, file_id: str) -> dict:
        """Получить метаданные файла"""
        service = self._get_service()
        return (
            service.files()
            .get(fileId=file_id, fields="id, name, createdTime, modifiedTime, size")
            .execute()
        )
