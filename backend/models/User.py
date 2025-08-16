from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class UserType(str, Enum):
    individual = "individual"
    org_admin = "org_admin"
    both = "both"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    email: EmailStr
    password: str  # This will be hashed
    name: str
    user_type: UserType = UserType.individual
    profile_data: Dict[str, Any] = Field(default_factory=dict)
    organizations: List[str] = Field(default_factory=list)  # Organization IDs user belongs to
    education_progress: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "password": "hashedpassword123",
                "user_type": "individual"
            }
        }

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    user_type: UserType = UserType.individual

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    user_type: str
    organizations: List[str] = Field(default_factory=list)
    created_at: datetime
    
    class Config:
        populate_by_name = True

class UserStats(BaseModel):
    total_saved: float = 0.0
    total_co2_reduced: float = 0.0
    total_points: int = 0
    calculation_count: int = 0
    education_points: int = 0
    certifications: int = 0

# Import Enum here to avoid circular import
from enum import Enum