from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta

from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import AuthService
from app.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    service = AuthService()
    return await service.register(user_data)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user with email and password"""
    service = AuthService()
    user_data = UserLogin(email=form_data.username, password=form_data.password)
    return await service.login(user_data)

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """Get current user information"""
    service = AuthService()
    user = await service.get_current_user(token)
    return UserResponse(
        id=str(user.id),
        name=user.full_name or user.username or "",
        email=user.email,
        role=user.role or "student",
        avatar=user.avatar or "",
        bio=user.bio or "",
        enrolled_courses=user.enrolled_courses or [],
        completed_courses=user.completed_courses or [],
        points=user.points or 0,
        achievements=user.achievements or [],
        created_at=user.created_at
    )

@router.post("/logout")
async def logout(token: Annotated[str, Depends(oauth2_scheme)]):
    """Logout user (client-side token removal)"""
    return {"message": "Successfully logged out"}