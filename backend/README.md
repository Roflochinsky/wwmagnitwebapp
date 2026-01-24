# WorkWatch Backend

Backend-сервис для системы мониторинга WorkWatch.

## Стек технологий

- **Python 3.11+**
- **FastAPI** — REST API
- **SQLAlchemy** — ORM
- **PostgreSQL** — база данных
- **Google Drive API** — загрузка отчётов

## Локальный запуск

```bash
# Запуск PostgreSQL
docker-compose up -d

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
uvicorn src.main:app --reload
```

## Структура

```
backend/
├── src/
│   ├── main.py          # Точка входа FastAPI
│   ├── config.py        # Конфигурация
│   ├── models/          # SQLAlchemy модели
│   ├── services/        # Бизнес-логика
│   ├── api/             # API эндпоинты
│   └── gdrive/          # Google Drive интеграция
├── alembic/             # Миграции БД
├── docker-compose.yml
└── requirements.txt
```
