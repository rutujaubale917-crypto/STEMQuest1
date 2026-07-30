from motor.motor_asyncio import AsyncIOMotorClient
# pyrefly: ignore [missing-import]
from beanie import init_beanie
from app.config import settings
from app.models.user import User
from app.models.course import Course
from app.models.quiz import Quiz
from app.models.progress import Progress

client = None
db = None

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DB_NAME]
    
    # Initialize Beanie ODM
    await init_beanie(
        database=db,
        document_models=[User, Course, Quiz, Progress]
    )
    
    print("Connected to MongoDB!")

    # Auto seed initial data if empty
    try:
        from app.database.seed import seed_data
        await seed_data()
    except Exception as e:
        print(f"Seed warning: {e}")

    return db

async def close_mongo_connection():
    if client:
        client.close()
        print("Closed MongoDB connection")

def get_database():
    return db

def get_collection(name: str):
    return db[name]