from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: Optional[str] = ""
    email: EmailStr
    role: Optional[str] = "student"
    avatar: Optional[str] = ""
    bio: Optional[str] = ""
    enrolled_courses: List[str] = Field(default_factory=list)
    completed_courses: List[str] = Field(default_factory=list)
    points: int = 0
    achievements: List[str] = Field(default_factory=list)
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    avatar: Optional[str] = None
    bio: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)