from typing import Optional, List
from fastapi import HTTPException, status
# pyrefly: ignore [missing-import]
from beanie import PydanticObjectId
from datetime import datetime

from app.models.quiz import Quiz, Attempt
from app.models.user import User
from app.models.progress import Progress
from app.schemas.quiz_schema import QuizCreate, QuizUpdate, QuizAttempt, QuizResultResponse

class QuizService:
    async def get_quiz(self, quiz_id: str) -> Optional[Quiz]:
        return await Quiz.get(PydanticObjectId(quiz_id))
    
    async def create_quiz(self, quiz_data: QuizCreate, created_by: str) -> Quiz:
        quiz = Quiz(
            **quiz_data.dict(),
            created_by=created_by
        )
        await quiz.insert()
        return quiz
    
    async def update_quiz(self, quiz: Quiz, update_data: QuizUpdate) -> Quiz:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(quiz, key, value)
        await quiz.save()
        return quiz
    
    async def submit_quiz(self, quiz_id: str, user_id: str, attempt: QuizAttempt) -> QuizResultResponse:
        quiz = await self.get_quiz(quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Validate answers count
        if len(attempt.answers) != len(quiz.questions):
            raise HTTPException(
                status_code=400,
                detail="Number of answers does not match number of questions"
            )
        
        # Calculate score
        score = 0
        total_possible = sum(q.points for q in quiz.questions)
        
        for idx, answer in enumerate(attempt.answers):
            if answer == quiz.questions[idx].correct_answer:
                score += quiz.questions[idx].points
        
        percentage = (score / total_possible) * 100 if total_possible > 0 else 0
        passed = percentage >= quiz.passing_score
        
        # Save attempt
        attempt_record = Attempt(
            user_id=user_id,
            quiz_id=quiz_id,
            answers=attempt.answers,
            score=score,
            total_possible=total_possible,
            percentage=percentage,
            passed=passed,
            completed_at=datetime.utcnow()
        )
        await attempt_record.insert()
        
        # Update user points
        user = await User.get(PydanticObjectId(user_id))
        if user:
            points_earned = score * 10  # 10 points per correct answer
            user.points += points_earned
            await user.save()
        
        # Update progress
        progress = await Progress.find_one({
            "user_id": user_id,
            "course_id": quiz.course_id
        })
        if progress:
            progress.quiz_scores[quiz_id] = score
            await progress.save()
        
        correct_answers = [q.correct_answer for q in quiz.questions]
        
        return QuizResultResponse(
            attempt_id=str(attempt_record.id),
            quiz_id=quiz_id,
            score=score,
            total_possible=total_possible,
            percentage=percentage,
            passed=passed,
            time_taken=attempt_record.time_taken,
            completed_at=attempt_record.completed_at,
            correct_answers=correct_answers
        )