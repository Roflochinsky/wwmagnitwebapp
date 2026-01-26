import asyncio
import sys
from src.database import async_session
from src.models import User
from src.core.security import get_password_hash

async def create_user(username, password):
    async with async_session() as session:
        hashed_password = get_password_hash(password)
        new_user = User(username=username, hashed_password=hashed_password, is_superuser=True)
        session.add(new_user)
        try:
            await session.commit()
            print(f"User {username} created successfully.")
        except Exception as e:
            await session.rollback()
            print(f"Error creating user: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <username> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    asyncio.run(create_user(username, password))
