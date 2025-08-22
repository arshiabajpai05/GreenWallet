from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class CalculationType(str, Enum):
    solar = "solar"
    afforestation = "afforestation"
    water = "water"
    transport = "transport"
    electricity = "electricity"

class Calculation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    type: CalculationType
    title: str
    money_saved: float
    co2_reduced: float
    points: int
    details: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True
        json_schema_extra = {
            "example": {
                "type": "solar",
                "title": "Solar Panel (3kW)",
                "money_saved": 450.25,
                "co2_reduced": 15.8,
                "points": 85,
                "details": {
                    "panel_size": "3kW",
                    "sunlight_hours": 6,
                    "monthly_generation": "540 kWh"
                }
            }
        }

class CalculationCreate(BaseModel):
    type: CalculationType
    title: str
    money_saved: float
    co2_reduced: float
    points: int
    details: Dict[str, Any] = Field(default_factory=dict)

class CalculationUpdate(BaseModel):
    title: Optional[str] = None
    money_saved: Optional[float] = None
    co2_reduced: Optional[float] = None
    points: Optional[int] = None
    details: Optional[Dict[str, Any]] = None

class CalculationResponse(BaseModel):
    id: str = Field(alias="_id")
    type: str
    title: str
    money_saved: float
    co2_reduced: float
    points: int
    details: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True