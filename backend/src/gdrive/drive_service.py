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
            settings = get_settings()
            creds = None
            
            # Пробуем загрузить токен (OAuth2 User flow)
            import os
            if os.path.exists(settings.google_token_path):
                from google.oauth2.credentials import Credentials
                creds = Credentials.from_authorized_user_file(settings.google_token_path, self.SCOPES)
            
            # Если токена нет, пробуем Service Account
            if (not creds or not creds.valid) and os.path.exists(settings.google_credentials_path):
                creds = service_account.Credentials.from_service_account_file(
                    settings.google_credentials_path,
                    scopes=self.SCOPES,
                )
            
            if not creds:
                raise ValueError("Не найдены ни token.json, ни credentials.json")
                
            self._service = build("drive", "v3", credentials=creds)
        return self._service

    def get_folder_ids(self) -> list[str]:
        """Парсит список папок из конфига"""
        if not self.folder_id:
            return []
        return [fid.strip() for fid in self.folder_id.split(",") if fid.strip()]

    def list_excel_files(self, folder_ids: Optional[list[str]] = None) -> list:
        """Список Excel-файлов в указанных папках"""
        service = self._get_service()
        target_folders = folder_ids or self.get_folder_ids()
        
        all_files = []
        for fid in target_folders:
            query = (
                f"'{fid}' in parents and "
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
            all_files.extend(results.get("files", []))

        return all_files

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
