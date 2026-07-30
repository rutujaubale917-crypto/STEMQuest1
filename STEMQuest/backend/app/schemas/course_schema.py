from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class ChapterBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    order: int
    quiz_ids: List[str] = Field(default_factory=list)

class ChapterCreate(ChapterBase):
    pass

class ChapterResponse(ChapterBase):
    id: Optional[str] = None

class CourseBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str
    level: str = "beginner"
    category: str
    tags: List[str] = Field(default_factory=list)
    duration: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None

class CourseResponse(CourseBase):
    id: str
    instructor_id: str
    thumbnail: Optional[str]
    chapters: List[ChapterResponse]
    rating: float
    enrolled_count: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

class CourseEnrollResponse(BaseModel):
    message: str
    course_id: str
    user_id: str

class CourseProgressResponse(BaseModel):
    course_id: str
    completed_chapters: List[str] = Field(default_factory=list)
    quiz_scores: dict = Field(default_factory=dict)
    overall_progress: int = 0
    started_at: Optional[datetime] = None
    last_accessed: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True