from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, Optional

# pyrefly: ignore [missing-import]
from app.schemas.course_schema import CourseCreate
from app.models.user import User
from app.services.course_service import CourseService
from app.services.auth_service import AuthService


router = APIRouter()


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
async def create_course(
    course_data: CourseCreate,
    current_user: Annotated[
        User,
        Depends(AuthService.get_current_user_dep)
    ]
):

    """Create a new course (instructors only)"""

    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only instructors can create courses"
        )

    service = CourseService()

    return await service.create_course(
        course_data,
        str(current_user.id)
    )


@router.get("/")
async def get_all_courses(
    category: Optional[str] = None,
    level: Optional[str] = None,
    search: Optional[str] = None
):
    service = CourseService()

    return await service.get_courses(
        category,
        level,
        search
    )


@router.get("/{course_id}")
async def get_course_by_id(course_id: str):
    """Get a specific course by ID"""
    service = CourseService()
    course = await service.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("/{course_id}/enroll")
async def enroll_in_course(
    course_id: str,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Enroll current user in a course"""
    service = CourseService()
    return await service.enroll_course(course_id, str(current_user.id))


@router.get("/{course_id}/progress")
async def get_course_progress(
    course_id: str,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Get user's progress for a specific course"""
    from app.models.progress import Progress
    progress = await Progress.find_one({
        "user_id": str(current_user.id),
        "course_id": course_id
    })
    if not progress:
        return {
            "course_id": course_id,
            "completed_chapters": [],
            "quiz_scores": {},
            "overall_progress": 0
        }
    return progress