from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://workwatch:workwatch_secret@localhost:5432/workwatch"
    google_drive_folder_id: str = ""  # Можно через запятую: "id1,id2"
    google_credentials_path: str = "./credentials.json"
    google_token_path: str = "./token.json"
    
    # Google Sheets ID
    sheet_id_ble_journal: str = ""
    sheet_id_people_mapping: str = ""
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True

    # Auth
    secret_key: str = "CHANGE_ME_IN_PROD_SECRET_KEY_12345"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
