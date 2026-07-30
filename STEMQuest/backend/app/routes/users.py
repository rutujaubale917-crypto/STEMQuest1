from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List
# pyrefly: ignore [missing-import]
from beanie import PydanticObjectId

from app.models.user import User
from app.models.progress import Progress
from app.schemas.user_schema import UserResponse, UserUpdate, PasswordChange
from app.schemas.course_schema import CourseProgressResponse
from app.services.auth_service import AuthService
from app.database.mongodb import get_collection

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]):
    """Get current user's profile"""
    return UserResponse(
        id=str(current_user.id),
        name=current_user.full_name or current_user.username,
        email=current_user.email,
        role=current_user.role,
        avatar=current_user.avatar or "",
        bio=current_user.bio or "",
        enrolled_courses=current_user.enrolled_courses,
        completed_courses=current_user.completed_courses,
        points=current_user.points,
        achievements=current_user.achievements,
        created_at=current_user.created_at
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Update user profile"""
    update_dict = update_data.dict(exclude_unset=True)
    # Map 'name' from schema to 'full_name' in model
    if 'name' in update_dict:
        current_user.full_name = update_dict.pop('name')
    for key, value in update_dict.items():
        setattr(current_user, key, value)
    await current_user.save()
    return UserResponse(
        id=str(current_user.id),
        name=current_user.full_name or current_user.username,
        email=current_user.email,
        role=current_user.role,
        avatar=current_user.avatar or "",
        bio=current_user.bio or "",
        enrolled_courses=current_user.enrolled_courses,
        completed_courses=current_user.completed_courses,
        points=current_user.points,
        achievements=current_user.achievements,
        created_at=current_user.created_at
    )

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Change user password"""
    service = AuthService()
    await service.change_password(current_user, password_data)
    return {"message": "Password changed successfully"}

@router.get("/enrolled-courses")
async def get_enrolled_courses(current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]):
    """Get courses the user is enrolled in"""
    from app.models.course import Course
    if not current_user.enrolled_courses:
        return []
    
    courses = []
    for course_id in current_user.enrolled_courses:
        try:
            course = await Course.get(PydanticObjectId(course_id))
            if course:
                courses.append(course)
        except Exception:
            continue
    return courses

@router.get("/progress", response_model=List[CourseProgressResponse])
async def get_user_progress(current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]):
    """Get progress for all enrolled courses"""
    progresses = await Progress.find({"user_id": str(current_user.id)}).to_list()
    return progresses

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top users by points"""
    users = await User.find().sort("-points").limit(limit).to_list()
    return [
        {
            "rank": idx + 1,
            "user_id": str(user.id),
            "name": user.full_name or user.username,
            "points": user.points,
            "avatar": user.avatar or ""
        }
        for idx, user in enumerate(users)
    ]