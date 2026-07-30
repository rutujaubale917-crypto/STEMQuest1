from typing import Optional, List
from fastapi import HTTPException, status
# pyrefly: ignore [missing-import]
from beanie import PydanticObjectId

from app.models.course import Course, Chapter
from app.models.user import User
from app.models.progress import Progress
from app.schemas.course_schema import CourseCreate, CourseUpdate, CourseResponse
from app.database.mongodb import get_collection

class CourseService:
    async def get_courses(
        self,
        category: Optional[str] = None,
        level: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Course]:
        query = {"is_published": True}
        
        if category:
            query["category"] = category
        if level:
            query["level"] = level
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}},
                {"chapters.title": {"$regex": search, "$options": "i"}},
                {"chapters.description": {"$regex": search, "$options": "i"}},
                {"chapters.content": {"$regex": search, "$options": "i"}}
            ]
        
        return await Course.find(query).sort("-created_at").to_list()
    
    async def get_course(self, course_id: str) -> Optional[Course]:
        return await Course.get(PydanticObjectId(course_id))
    
    async def create_course(self, course_data: CourseCreate, instructor_id: str) -> Course:
        course = Course(
            **course_data.dict(),
            instructor_id=instructor_id
        )
        await course.insert()
        return course
    
    async def update_course(self, course: Course, update_data: CourseUpdate) -> Course:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(course, key, value)
        await course.save()
        return course
    
    async def enroll_course(self, course_id: str, user_id: str) -> dict:
        course = await self.get_course(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        user = await User.get(PydanticObjectId(user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if already enrolled
        if course_id in user.enrolled_courses:
            raise HTTPException(status_code=400, detail="Already enrolled in this course")
        
        # Enroll user
        user.enrolled_courses.append(course_id)
        await user.save()
        
        # Increment enrolled count
        course.enrolled_count += 1
        await course.save()
        
        # Create progress record
        progress = Progress(
            user_id=user_id,
            course_id=course_id
        )
        await progress.insert()
        
        return {
            "message": "Successfully enrolled in course",
            "course_id": course_id,
            "user_id": user_id
        }