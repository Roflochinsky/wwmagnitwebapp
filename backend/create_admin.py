import asyncio
import sys
from src.database import async_session
from src.models import User
from src.core.security import get_password_hash
from sqlalchemy import select

async def create_admin(username, password):
    async with async_session() as db:
        # Check if exists
        result = await db.execute(select(User).where(User.username == username))
        existing_user = result.scalars().first()
        
        if existing_user:
            print(f"User {username} already exists.")
            return

        hashed_pw = get_password_hash(password)
        new_user = User(
            username=username,
            hashed_password=hashed_pw,
            is_active=True,
            is_superuser=True
        )
        db.add(new_user)
        await db.commit()
        print(f"User {username} created successfully.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <username> <password>")
        sys.exit(1)
        
    user = sys.argv[1]
    pwd = sys.argv[2]
    
    asyncio.run(create_admin(user, pwd))
