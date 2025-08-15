from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import timedelta
from typing import List, Optional

# Import models and auth
from models.User import User, UserCreate, UserLogin, UserResponse, UserStats
from models.Calculation import (
    Calculation, CalculationCreate, CalculationUpdate, 
    CalculationResponse, CalculationType
)
from models.Profile import Profile, ProfileCreate, ProfileUpdate, ProfileResponse, ProfileType
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user_id, ACCESS_TOKEN_EXPIRE_MINUTES
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
calculations_collection = db.calculations
profiles_collection = db.profiles

# Create the main app
app = FastAPI(title="GreenWallet API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AUTHENTICATION ROUTES ====================

@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        password=hashed_password,
        name=user_data.name
    )
    
    # Insert user to database
    result = await users_collection.insert_one(user.dict(by_alias=True))
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user.dict(by_alias=True))
    }

@api_router.post("/auth/login", response_model=dict)
async def login(user_data: UserLogin):
    """Login user and return JWT token."""
    # Find user
    user_doc = await users_collection.find_one({"email": user_data.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user_doc["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_doc["_id"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user_doc)
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    """Get current user profile."""
    user_doc = await users_collection.find_one({"_id": user_id})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(**user_doc)

# ==================== USER ROUTES ====================

@api_router.get("/users/stats", response_model=UserStats)
async def get_user_stats(user_id: str = Depends(get_current_user_id)):
    """Get user statistics (total savings, CO2, points)."""
    # Aggregate user's calculations
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {
            "_id": None,
            "total_saved": {"$sum": "$money_saved"},
            "total_co2_reduced": {"$sum": "$co2_reduced"},
            "total_points": {"$sum": "$points"},
            "calculation_count": {"$sum": 1}
        }}
    ]
    
    result = await calculations_collection.aggregate(pipeline).to_list(1)
    
    if result:
        stats = result[0]
        return UserStats(
            total_saved=stats["total_saved"],
            total_co2_reduced=stats["total_co2_reduced"],
            total_points=stats["total_points"],
            calculation_count=stats["calculation_count"]
        )
    else:
        return UserStats()

# ==================== CALCULATION ROUTES ====================

@api_router.post("/calculations", response_model=CalculationResponse)
async def create_calculation(
    calculation_data: CalculationCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new calculation."""
    calculation = Calculation(
        user_id=user_id,
        **calculation_data.dict()
    )
    
    # Insert to database
    result = await calculations_collection.insert_one(calculation.dict(by_alias=True))
    
    return CalculationResponse(**calculation.dict(by_alias=True))

@api_router.get("/calculations", response_model=List[CalculationResponse])
async def get_calculations(
    user_id: str = Depends(get_current_user_id),
    calc_type: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    """Get user's calculations with optional filtering."""
    filter_query = {"user_id": user_id}
    
    if calc_type and calc_type in [t.value for t in CalculationType]:
        filter_query["type"] = calc_type
    
    # Get calculations sorted by created_at desc
    calculations = await calculations_collection.find(filter_query)\
        .sort("created_at", -1)\
        .skip(skip)\
        .limit(limit)\
        .to_list(limit)
    
    return [CalculationResponse(**calc) for calc in calculations]

@api_router.put("/calculations/{calculation_id}", response_model=CalculationResponse)
async def update_calculation(
    calculation_id: str,
    calculation_data: CalculationUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """Update a calculation."""
    # Check if calculation exists and belongs to user
    existing_calc = await calculations_collection.find_one({
        "_id": calculation_id,
        "user_id": user_id
    })
    
    if not existing_calc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in calculation_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await calculations_collection.update_one(
        {"_id": calculation_id},
        {"$set": update_data}
    )
    
    # Get updated calculation
    updated_calc = await calculations_collection.find_one({"_id": calculation_id})
    return CalculationResponse(**updated_calc)

@api_router.delete("/calculations/{calculation_id}")
async def delete_calculation(
    calculation_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete a calculation."""
    result = await calculations_collection.delete_one({
        "_id": calculation_id,
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    
    return {"message": "Calculation deleted successfully"}

# ==================== PROFILE ROUTES ====================

@api_router.post("/profiles", response_model=ProfileResponse)
async def create_profile(
    profile_data: ProfileCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new calculator profile."""
    profile = Profile(
        user_id=user_id,
        **profile_data.dict()
    )
    
    # Insert to database
    result = await profiles_collection.insert_one(profile.dict(by_alias=True))
    
    return ProfileResponse(**profile.dict(by_alias=True))

@api_router.get("/profiles/{profile_type}", response_model=List[ProfileResponse])
async def get_profiles(
    profile_type: ProfileType,
    user_id: str = Depends(get_current_user_id)
):
    """Get user's profiles by type."""
    profiles = await profiles_collection.find({
        "user_id": user_id,
        "type": profile_type.value
    }).to_list(100)
    
    return [ProfileResponse(**profile) for profile in profiles]

@api_router.delete("/profiles/{profile_id}")
async def delete_profile(
    profile_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete a profile."""
    result = await profiles_collection.delete_one({
        "_id": profile_id,
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return {"message": "Profile deleted successfully"}

# ==================== ROOT ROUTE ====================

@api_router.get("/")
async def root():
    return {"message": "GreenWallet API is running!", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Import datetime at the top
from datetime import datetime