from fastapi import APIRouter, Depends, HTTPException, status
from config.db import get_database
from middleware.auth import get_current_user
from .models import HairProfileCreate, HairProfileUpdate, HairProfileResponse
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/hair-profiles", tags=["Hair Profiles"])

@router.post("", response_model=HairProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_hair_profile(
    profile_data: HairProfileCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create or update hair profile for current user"""
    db = get_database()
    
    # Check if profile already exists
    existing_profile = await db.hair_profiles.find_one({"user_id": current_user["user_id"]})
    
    profile_id = existing_profile["profile_id"] if existing_profile else str(uuid.uuid4())
    
    profile_doc = {
        "profile_id": profile_id,
        "user_id": current_user["user_id"],
        "porosity": profile_data.porosity,
        "curl_pattern": profile_data.curl_pattern,
        "scalp_type": profile_data.scalp_type,
        "density": profile_data.density,
        "notes": profile_data.notes,
        "updated_at": datetime.utcnow()
    }
    
    if existing_profile:
        # Update existing profile
        await db.hair_profiles.update_one(
            {"user_id": current_user["user_id"]},
            {"$set": profile_doc}
        )
        logger.info(f"Hair profile updated for user: {current_user['user_id']}")
    else:
        # Create new profile
        profile_doc["created_at"] = datetime.utcnow()
        await db.hair_profiles.insert_one(profile_doc)
        logger.info(f"Hair profile created for user: {current_user['user_id']}")
    
    # Get the profile
    profile = await db.hair_profiles.find_one({"user_id": current_user["user_id"]})
    
    return HairProfileResponse(**profile)

@router.get("", response_model=HairProfileResponse)
async def get_hair_profile(current_user: dict = Depends(get_current_user)):
    """Get hair profile for current user"""
    db = get_database()
    
    profile = await db.hair_profiles.find_one({"user_id": current_user["user_id"]})
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hair profile not found. Please complete your hair profile first."
        )
    
    return HairProfileResponse(**profile)

@router.put("", response_model=HairProfileResponse)
async def update_hair_profile(
    profile_update: HairProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update hair profile for current user"""
    db = get_database()
    
    profile = await db.hair_profiles.find_one({"user_id": current_user["user_id"]})
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hair profile not found. Please create a profile first."
        )
    
    # Build update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if profile_update.porosity:
        update_data["porosity"] = profile_update.porosity
    if profile_update.curl_pattern:
        update_data["curl_pattern"] = profile_update.curl_pattern
    if profile_update.scalp_type:
        update_data["scalp_type"] = profile_update.scalp_type
    if profile_update.density:
        update_data["density"] = profile_update.density
    if profile_update.notes is not None:
        update_data["notes"] = profile_update.notes
    
    # Update profile
    await db.hair_profiles.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": update_data}
    )
    
    # Get updated profile
    updated_profile = await db.hair_profiles.find_one({"user_id": current_user["user_id"]})
    
    logger.info(f"Hair profile updated for user: {current_user['user_id']}")
    
    return HairProfileResponse(**updated_profile)

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hair_profile(current_user: dict = Depends(get_current_user)):
    """Delete hair profile for current user"""
    db = get_database()
    
    result = await db.hair_profiles.delete_one({"user_id": current_user["user_id"]})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hair profile not found"
        )
    
    logger.info(f"Hair profile deleted for user: {current_user['user_id']}")
    return None
