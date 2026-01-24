# Деплой WorkWatch API на Cloud Run

## Предварительные требования

1. Установлен `gcloud` CLI
2. Настроен проект: `gcloud config set project YOUR_PROJECT_ID`
3. Включены API:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com sqladmin.googleapis.com
   ```

---

## Быстрый деплой (без Cloud SQL)

Если хотите использовать внешнюю БД (например, уже запущенный PostgreSQL на VM):

```bash
# 1. Соберите и запушьте образ
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/workwatch-api

# 2. Задеплойте на Cloud Run
gcloud run deploy workwatch-api \
  --image gcr.io/YOUR_PROJECT_ID/workwatch-api \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql+asyncpg://workwatch:workwatch_secret@EXTERNAL_IP:5432/workwatch"
```

Замените `EXTERNAL_IP` на внешний IP вашей VM с PostgreSQL.

---

## Полный деплой с Cloud SQL

### Шаг 1: Создайте Cloud SQL инстанс

```bash
gcloud sql instances create workwatch-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=europe-west1

gcloud sql users set-password postgres \
  --instance=workwatch-db \
  --password=YOUR_SECURE_PASSWORD

gcloud sql databases create workwatch \
  --instance=workwatch-db
```

### Шаг 2: Соберите образ

```bash
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/workwatch-api
```

### Шаг 3: Деплой на Cloud Run

```bash
gcloud run deploy workwatch-api \
  --image gcr.io/YOUR_PROJECT_ID/workwatch-api \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT_ID:europe-west1:workwatch-db \
  --set-env-vars "DATABASE_URL=postgresql+asyncpg://postgres:YOUR_SECURE_PASSWORD@/workwatch?host=/cloudsql/YOUR_PROJECT_ID:europe-west1:workwatch-db"
```

---

## После деплоя

Cloud Run выдаст URL вида:
```
https://workwatch-api-xxxxx-ew.a.run.app
```

Проверьте:
- `https://YOUR_URL/` — Health check
- `https://YOUR_URL/docs` — Swagger UI
