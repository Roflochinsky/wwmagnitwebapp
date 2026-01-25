import asyncio
from src.database import engine, Base
from src.models import *  # Import all models to ensure they are registered

async def reset_database():
    print("Dropping all tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    print("Creating all tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database reset complete.")

if __name__ == "__main__":
    asyncio.run(reset_database())
