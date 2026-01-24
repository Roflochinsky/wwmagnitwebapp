from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://workwatch:workwatch_secret@localhost:5432/workwatch"
    google_drive_folder_id: str = ""
    google_credentials_path: str = "./credentials.json"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
