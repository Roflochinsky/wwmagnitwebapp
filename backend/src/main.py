import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.config import get_settings
from src.database import engine, Base
from src.api import health, reports, employees, stats, sync, auth
from src.scheduler import start_scheduler, stop_scheduler

# Настройка логирования для отладки
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
# Включаем DEBUG для парсера
logging.getLogger("src.services.report_parser").setLevel(logging.DEBUG)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    start_scheduler()
    yield
    # Shutdown
    stop_scheduler()


app = FastAPI(
    title="WorkWatch API",
    description="Backend API для системы мониторинга WorkWatch",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(stats.router, prefix="/api/stats", tags=["Statistics"])
app.include_router(sync.router, prefix="/api", tags=["Sync"])
