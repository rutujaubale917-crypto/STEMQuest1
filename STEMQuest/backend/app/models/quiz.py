from typing import List, Optional
from datetime import datetime
# pyrefly: ignore [missing-import]
from beanie import Document
from pydantic import Field, BaseModel

class Question(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: int  # index of correct option (0-based)
    explanation: Optional[str] = None
    points: int = Field(default=1)

class Quiz(Document):
    title: str
    description: Optional[str] = None
    course_id: str
    chapter_id: Optional[str] = None
    questions: List[Question]
    time_limit: Optional[int] = None  # in minutes
    passing_score: int = Field(default=70)  # percentage
    is_published: bool = Field(default=False)
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "quizzes"

class Attempt(Document):
    user_id: str
    quiz_id: str
    answers: List[int]  # indices of selected answers
    score: int
    total_possible: int
    percentage: float
    passed: bool
    time_taken: Optional[int] = None  # in seconds
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Settings:
        name = "attempts"