from typing import Optional, List
from datetime import datetime
# pyrefly: ignore [missing-import]
from beanie import Document, Indexed
from pydantic import Field, BaseModel

class Chapter(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    order: int
    quiz_ids: List[str] = Field(default_factory=list)

class Course(Document):
    title: str = Field(..., min_length=3, max_length=100)
    description: str
    instructor_id: str
    thumbnail: Optional[str] = None
    level: str = Field(default="beginner")  # beginner, intermediate, advanced
    category: str
    tags: List[str] = Field(default_factory=list)
    chapters: List[Chapter] = Field(default_factory=list)
    duration: Optional[str] = None
    rating: float = Field(default=0.0)
    enrolled_count: int = Field(default=0)
    is_published: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "courses"
        
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Introduction to Python",
                "description": "Learn Python programming from scratch",
                "level": "beginner",
                "category": "Programming"
            }
        }