from fastapi import APIRouter, Depends, HTTPException, status
from config.db import get_database
from middleware.auth import get_current_user
from .models import UserUpdate, UserProfile
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile with statistics"""
    db = get_database()
    
    # Count total scans
    total_scans = await db.scans.count_documents({"user_id": current_user["user_id"]})
    
    return UserProfile(
        user_id=current_user["user_id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        created_at=current_user["created_at"],
        total_scans=total_scans
    )

@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    db = get_database()
    
    update_data = {"updated_at": datetime.utcnow()}
    
    if user_update.full_name:
        update_data["full_name"] = user_update.full_name
    
    if user_update.email:
        # Check if email is already taken
        existing_user = await db.users.find_one({
            "email": user_update.email,
            "user_id": {"$ne": current_user["user_id"]}
        })
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
        update_data["email"] = user_update.email
    
    # Update user
    await db.users.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"user_id": current_user["user_id"]})
    total_scans = await db.scans.count_documents({"user_id": current_user["user_id"]})
    
    logger.info(f"User profile updated: {current_user['user_id']}")
    
    return UserProfile(
        user_id=updated_user["user_id"],
        email=updated_user["email"],
        full_name=updated_user["full_name"],
        created_at=updated_user["created_at"],
        total_scans=total_scans
    )