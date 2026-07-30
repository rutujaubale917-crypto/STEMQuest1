import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URI = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # Database name
    DB_NAME = "stemquest"
    
    # Collections
    USERS_COLLECTION = "users"
    COURSES_COLLECTION = "courses"
    QUIZZES_COLLECTION = "quizzes"
    PROGRESS_COLLECTION = "progress"
    ATTEMPTS_COLLECTION = "attempts"

settings = Settings()