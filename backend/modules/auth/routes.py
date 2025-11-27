from fastapi import APIRouter, HTTPException, status, Depends
from passlib.context import CryptContext
from config.db import get_database
from middleware.auth import create_access_token, get_current_user
from .models import UserRegister, UserLogin, Token, UserResponse
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Register a new user"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_doc)
    logger.info(f"New user registered: {user_data.email}")
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return Token(
        access_token=access_token,
        user_id=user_id,
        email=user_data.email
    )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    db = get_database()
    
    # Find user
    user = await db.users.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["user_id"]})
    
    logger.info(f"User logged in: {user_data.email}")
    
    return Token(
        access_token=access_token,
        user_id=user["user_id"],
        email=user["email"]
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    db = get_database()
    
    # Check if user has hair profile
    hair_profile = await db.hair_profiles.find_one({"user_id": current_user["user_id"]})
    
    return UserResponse(
        user_id=current_user["user_id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        created_at=current_user["created_at"],
        has_hair_profile=hair_profile is not None
    )