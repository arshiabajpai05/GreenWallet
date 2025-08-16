from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class ModuleType(str, Enum):
    article = "article"
    interactive = "interactive"
    quiz = "quiz"
    video = "video"

class DifficultyLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class EducationModule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    description: str
    type: ModuleType
    difficulty: DifficultyLevel
    category: str  # sustainability, solar, water, transport, electricity
    content: Dict[str, Any]  # Flexible content structure
    points_reward: int = 10
    duration_minutes: int = 5
    prerequisites: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True

class UserProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    module_id: str
    status: str = "in_progress"  # not_started, in_progress, completed, certified
    progress_percentage: int = 0
    score: Optional[int] = None
    attempts: int = 0
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class Quiz(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    module_id: str
    questions: List[Dict[str, Any]]
    passing_score: int = 70
    max_attempts: int = 3
    time_limit_minutes: int = 10

    class Config:
        populate_by_name = True

class QuizAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    quiz_id: str
    answers: Dict[str, Any]
    score: int
    passed: bool
    completed_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class Certification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    module_id: str
    certificate_name: str
    issued_at: datetime = Field(default_factory=datetime.utcnow)
    certificate_url: Optional[str] = None

    class Config:
        populate_by_name = True

# Response models
class EducationModuleResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    description: str
    type: str
    difficulty: str
    category: str
    points_reward: int
    duration_minutes: int
    is_active: bool
    user_progress: Optional[Dict[str, Any]] = None
    
    class Config:
        populate_by_name = True

class UserEducationStats(BaseModel):
    modules_completed: int = 0
    total_points_earned: int = 0
    certifications_earned: int = 0
    current_streak: int = 0
    favorite_category: Optional[str] = None