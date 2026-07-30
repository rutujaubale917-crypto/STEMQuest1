from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class QuestionBase(BaseModel):
    question_text: str
    options: List[str] = Field(..., min_items=2)
    correct_answer: int
    explanation: Optional[str] = None
    points: int = Field(default=1)

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: str

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: str
    chapter_id: Optional[str] = None
    time_limit: Optional[int] = None
    passing_score: int = 70

class QuizCreate(QuizBase):
    questions: List[QuestionCreate]

class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    time_limit: Optional[int] = None
    passing_score: Optional[int] = None
    is_published: Optional[bool] = None

class QuizResponse(QuizBase):
    id: str
    questions: List[QuestionResponse]
    is_published: bool
    created_by: str
    created_at: datetime
    updated_at: datetime

class QuizAttempt(BaseModel):
    answers: List[int]  # List of selected option indices

class QuizResultResponse(BaseModel):
    attempt_id: str
    quiz_id: str
    score: int
    total_possible: int
    percentage: float
    passed: bool
    time_taken: Optional[int]
    completed_at: datetime
    correct_answers: List[int]  # correct indices for comparison