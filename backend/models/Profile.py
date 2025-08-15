from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class ProfileType(str, Enum):
    solar = "solar"
    water = "water"
    transport = "transport"
    electricity = "electricity"

class Profile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    type: ProfileType
    name: str
    data: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True
        json_schema_extra = {
            "example": {
                "type": "solar",
                "name": "Home Solar Setup",
                "data": {
                    "panel_size": 3,
                    "sunlight_hours": 6
                }
            }
        }

class ProfileCreate(BaseModel):
    type: ProfileType
    name: str
    data: Dict[str, Any] = Field(default_factory=dict)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class ProfileResponse(BaseModel):
    id: str = Field(alias="_id")
    type: str
    name: str
    data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True