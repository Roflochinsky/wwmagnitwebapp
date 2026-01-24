# Интеграция с Supabase

## Шаг 1: Создание проекта

1. Перейдите на [supabase.com](https://supabase.com) и войдите (через GitHub)
2. Нажмите **New Project**
3. Заполните:
   - **Name:** `workwatch`
   - **Database Password:** (сохраните этот пароль!)
   - **Region:** `eu-central-1` (Frankfurt) — ближе к России
4. Нажмите **Create new project** и подождите 2-3 минуты

---

## Шаг 2: Получение Connection String

1. В панели Supabase перейдите: **Settings → Database**
2. Прокрутите до **Connection string** → **URI**
3. Выберите **Mode: Transaction** (важно для serverless!)
4. Скопируйте строку, она выглядит так:
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

---

## Шаг 3: Обновите .env

Создайте файл `.env` из `.env.example` и вставьте вашу строку подключения:

```bash
cd ~/wwmagnitwebapp/backend
cp .env.example .env
nano .env
```

**Важно:** Замените `postgresql://` на `postgresql+asyncpg://`:

```
DATABASE_URL=postgresql+asyncpg://postgres.abcdefgh:MySecretPassword123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

---

## Шаг 4: Запустите миграции

```bash
# Активируйте venv если нужно
source venv/bin/activate

# Запустите сервер — таблицы создадутся автоматически
uvicorn src.main:app --reload
```

В логах вы увидите `CREATE TABLE employees ...` и т.д.

---

## Шаг 5: Проверьте в Supabase

1. В панели Supabase перейдите: **Table Editor**
2. Вы увидите созданные таблицы: `employees`, `shifts`, `downtimes`, `ble_logs`, `zones`, `ble_tags`, `processed_files`

---

## Шаг 6: Деплой на Cloud Run

Теперь можно задеплоить на Cloud Run:

```bash
cd ~/wwmagnitwebapp/backend

# Сборка образа
gcloud builds submit --tag gcr.io/gen-lang-client-0243300086/workwatch-api

# Деплой с Supabase
gcloud run deploy workwatch-api \
  --image gcr.io/gen-lang-client-0243300086/workwatch-api \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql+asyncpg://postgres.YOUR_REF:YOUR_PASS@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

---

## Лимиты Free Tier

| Ресурс | Лимит |
|--------|-------|
| Размер БД | 500 MB |
| API запросов | 50,000/мес |
| Пауза при неактивности | 7 дней |

> **Совет:** Чтобы база не засыпала, настройте cron-job на пингование API раз в 5 дней.
