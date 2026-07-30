from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.models.user import User
from app.models.progress import Progress
from app.models.quiz import Attempt

router = APIRouter()

@router.get("/")
async def get_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    course_id: Optional[str] = None
):
    """Get global or course-specific leaderboard"""
    if course_id:
        # Get course-specific leaderboard based on quiz scores
        pipeline = [
            {"$match": {"course_id": course_id}},
            {"$group": {"_id": "$user_id", "total_score": {"$sum": "$score"}}},
            {"$sort": {"total_score": -1}},
            {"$skip": offset},
            {"$limit": limit}
        ]
        
        # Get user details
        results = []
        async for doc in Progress.aggregate(pipeline):
            user = await User.get(doc["_id"])
            if user:
                results.append({
                    "rank": len(results) + offset + 1,
                    "user_id": doc["_id"],
                    "name": user.full_name or user.username,
                    "score": doc["total_score"],
                    "avatar": user.avatar or ""
                })
        return results
    else:
        # Global leaderboard based on points
        users = await User.find().sort("-points").skip(offset).limit(limit).to_list()
        return [
            {
                "rank": idx + offset + 1,
                "user_id": str(user.id),
                "name": user.full_name or user.username,
                "points": user.points,
                "avatar": user.avatar or "",
                "courses_completed": len(user.completed_courses)
            }
            for idx, user in enumerate(users)
        ]