from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List
from datetime import datetime
# pyrefly: ignore [missing-import]
from beanie import PydanticObjectId

from app.models.quiz import Quiz, Attempt, Question
from app.models.user import User
from app.schemas.quiz_schema import QuizCreate, QuizUpdate, QuizResponse, QuizAttempt, QuizResultResponse
from app.services.auth_service import AuthService
from app.services.quiz_service import QuizService

router = APIRouter()

@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: str,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Get quiz by ID"""
    service = QuizService()
    quiz = await service.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.post("/", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
async def create_quiz(
    quiz_data: QuizCreate,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Create a new quiz (instructors only)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can create quizzes")
    
    service = QuizService()
    return await service.create_quiz(quiz_data, str(current_user.id))

@router.put("/{quiz_id}", response_model=QuizResponse)
async def update_quiz(
    quiz_id: str,
    update_data: QuizUpdate,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Update quiz (instructors only)"""
    service = QuizService()
    quiz = await service.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if current_user.role not in ["admin"] and quiz.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this quiz")
    
    return await service.update_quiz(quiz, update_data)

@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
async def submit_quiz(
    quiz_id: str,
    attempt: QuizAttempt,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Submit quiz answers and get results"""
    service = QuizService()
    return await service.submit_quiz(quiz_id, str(current_user.id), attempt)

@router.get("/results/{attempt_id}", response_model=QuizResultResponse)
async def get_quiz_results(
    attempt_id: str,
    current_user: Annotated[User, Depends(AuthService.get_current_user_dep)]
):
    """Get results of a quiz attempt"""
    # pyrefly: ignore [unknown-name]
    attempt = await Attempt.get(PydanticObjectId(attempt_id))
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    if attempt.user_id != str(current_user.id) and current_user.role not in ["admin", "instructor"]:
        raise HTTPException(status_code=403, detail="Not authorized to view these results")
    
    # pyrefly: ignore [unknown-name]
    quiz = await Quiz.get(PydanticObjectId(attempt.quiz_id))
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    correct_answers = [q.correct_answer for q in quiz.questions]
    
    return QuizResultResponse(
        attempt_id=str(attempt.id),
        quiz_id=attempt.quiz_id,
        score=attempt.score,
        total_possible=attempt.total_possible,
        percentage=attempt.percentage,
        passed=attempt.passed,
        time_taken=attempt.time_taken,
        completed_at=attempt.completed_at or datetime.utcnow(),
        correct_answers=correct_answers
    )