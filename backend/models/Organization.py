from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class OrganizationType(str, Enum):
    company = "company"
    school = "school"
    society = "society"
    ngo = "ngo"
    other = "other"

class InviteStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"
    expired = "expired"

class Organization(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    type: OrganizationType
    admin_user_id: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    invite_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    settings: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True

class OrganizationCreate(BaseModel):
    name: str
    type: OrganizationType
    description: Optional[str] = None

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class OrganizationMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    org_id: str
    user_id: str
    role: str = "member"  # member, admin
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        populate_by_name = True

class OrganizationInvite(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    org_id: str
    invited_by: str
    email: str
    status: InviteStatus = InviteStatus.pending
    invite_token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True

class OrganizationResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    type: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    invite_code: str
    member_count: int = 0
    created_at: datetime
    
    class Config:
        populate_by_name = True

class OrganizationStats(BaseModel):
    total_members: int = 0
    total_saved: float = 0.0
    total_co2_reduced: float = 0.0
    total_points: int = 0
    calculation_count: int = 0
    top_contributors: List[Dict[str, Any]] = Field(default_factory=list)