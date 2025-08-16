from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class ChallengeType(str, Enum):
    individual = "individual"
    team = "team"
    organization = "organization"

class ChallengeStatus(str, Enum):
    draft = "draft"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class Challenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    description: str
    type: ChallengeType
    org_id: Optional[str] = None
    created_by: str
    goal_type: str  # savings, co2_reduction, points, participation
    goal_value: float
    reward_points: int = 0
    reward_description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    status: ChallengeStatus = ChallengeStatus.draft
    rules: Dict[str, Any] = Field(default_factory=dict)
    participants: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True

class ChallengeParticipant(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    challenge_id: str
    user_id: str
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    current_progress: float = 0.0
    is_completed: bool = False
    completed_at: Optional[datetime] = None

    class Config:
        populate_by_name = True

class ChallengeTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    description: str
    goal_type: str
    suggested_duration_days: int
    suggested_goal_value: float
    category: str  # water, energy, transport, general
    template_content: Dict[str, Any]

    class Config:
        populate_by_name = True

class ChallengeCreate(BaseModel):
    title: str
    description: str
    type: ChallengeType
    goal_type: str
    goal_value: float
    reward_points: int = 0
    reward_description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    rules: Dict[str, Any] = Field(default_factory=dict)

class ChallengeResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    description: str
    type: str
    goal_type: str
    goal_value: float
    reward_points: int
    start_date: datetime
    end_date: datetime
    status: str
    participant_count: int = 0
    user_progress: Optional[float] = None
    
    class Config:
        populate_by_name = True