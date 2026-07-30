from typing import Optional, List
from datetime import datetime

# pyrefly: ignore [missing-import]
from beanie import Document
from pydantic import Field


class User(Document):
    username: Optional[str] = ""
    email: Optional[str] = ""
    password: Optional[str] = ""

    full_name: Optional[str] = ""
    language: Optional[str] = "English"
    
    role: str = "student"

    avatar: Optional[str] = ""
    bio: Optional[str] = ""

    enrolled_courses: List[str] = Field(default_factory=list)
    completed_courses: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)

    points: int = 0
    level: int = 1

    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"