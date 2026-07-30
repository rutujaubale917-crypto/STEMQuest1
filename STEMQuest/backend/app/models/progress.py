from typing import Dict, Optional
from datetime import datetime
# pyrefly: ignore [missing-import]
from typing import List
# pyrefly: ignore [missing-import]
from beanie import Document
from pydantic import Field

class Progress(Document):
    user_id: str
    course_id: str
    completed_chapters: List[str] = Field(default_factory=list)
    quiz_scores: Dict[str, int] = Field(default_factory=dict)  # quiz_id: score
    overall_progress: int = Field(default=0)  # percentage
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Settings:
        name = "progress"