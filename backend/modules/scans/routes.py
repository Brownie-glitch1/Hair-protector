from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from config.db import get_database
from middleware.auth import get_current_user
from .models import (
    ScanByIngredients, 
    ScanByBarcode, 
    ScanByImage, 
    ScanResult,
    ScanHistoryResponse
)
from services.scoring_service import scoring_service
from services.barcode_service import barcode_service
from services.ocr_service import ocr_service
import uuid
from datetime import datetime
from typing import List
import logging
import base64

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/scans", tags=["Scans"])

@router.post("/ingredients", response_model=ScanResult, status_code=status.HTTP_201_CREATED)
async def scan_by_ingredients(
    scan_data: ScanByIngredients,
    current_user: dict = Depends(get_current_user)
):
    """
    Scan product by manually pasting ingredient list.
    This is the primary scan method.
    """
    db = get_database()
    
    # Score the ingredients
    result = await scoring_service.score_ingredients(
        scan_data.ingredients_text,
        current_user["user_id"]
    )
    
    # Check for errors
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    # Create scan record
    scan_id = str(uuid.uuid4())
    
    scan_doc = {
        "scan_id": scan_id,
        "user_id": current_user["user_id"],
        "scan_type": "ingredients",
        
        # Product info
        "product_name": scan_data.product_name,
        "product_brand": scan_data.product_brand,
        "product_category": scan_data.product_category,
        "product_id": None,
        "ingredients_text": scan_data.ingredients_text,
        
        # Scoring results
        "verdict": result["verdict"],
        "overall_score": result["overall_score"],
        "moisture_score": result["moisture_score"],
        "buildup_risk": result["buildup_risk"],
        "scalp_score": result["scalp_score"],
        "water_based": result["water_based"],
        "heavy_oils": result["heavy_oils"],
        "protein_heavy": result["protein_heavy"],
        "explanation": result["explanation"],
        
        # Metadata
        "matched_ingredients_count": result["matched_ingredients_count"],
        "total_ingredients_count": result["total_ingredients_count"],
        
        # Hair profile used
        "hair_profile": result["hair_profile"],
        
        # Timestamps
        "created_at": datetime.utcnow()
    }
    
    await db.scans.insert_one(scan_doc)
    logger.info(f"Scan created: {scan_id} by user {current_user['user_id']}")
    
    return ScanResult(**scan_doc)

@router.post("/barcode", response_model=ScanResult, status_code=status.HTTP_201_CREATED)
async def scan_by_barcode(
    scan_data: ScanByBarcode,
    current_user: dict = Depends(get_current_user)
):
    """
    Scan product by barcode.
    Looks up product in database first, then scores ingredients.
    """
    db = get_database()
    
    # Lookup product by barcode
    product = await barcode_service.lookup_product(scan_data.barcode)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with barcode '{scan_data.barcode}' not found. Please scan by ingredients instead."
        )
    
    # Score the product
    result = await scoring_service.score_ingredients(
        product["ingredients_text"],
        current_user["user_id"]
    )
    
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    # Create scan record
    scan_id = str(uuid.uuid4())
    
    scan_doc = {
        "scan_id": scan_id,
        "user_id": current_user["user_id"],
        "scan_type": "barcode",
        
        # Product info from barcode lookup
        "product_name": product["name"],
        "product_brand": product.get("brand"),
        "product_category": product["category"],
        "product_id": product.get("product_id"),
        "barcode": scan_data.barcode,
        "ingredients_text": product["ingredients_text"],
        
        # Scoring results
        "verdict": result["verdict"],
        "overall_score": result["overall_score"],
        "moisture_score": result["moisture_score"],
        "buildup_risk": result["buildup_risk"],
        "scalp_score": result["scalp_score"],
        "water_based": result["water_based"],
        "heavy_oils": result["heavy_oils"],
        "protein_heavy": result["protein_heavy"],
        "explanation": result["explanation"],
        
        # Metadata
        "matched_ingredients_count": result["matched_ingredients_count"],
        "total_ingredients_count": result["total_ingredients_count"],
        
        # Hair profile used
        "hair_profile": result["hair_profile"],
        
        # Timestamps
        "created_at": datetime.utcnow()
    }
    
    await db.scans.insert_one(scan_doc)
    
    # Increment product scan count
    if product.get("product_id"):
        await db.products.update_one(
            {"product_id": product["product_id"]},
            {"$inc": {"scan_count": 1}}
        )
    
    logger.info(f"Barcode scan created: {scan_id}")
    
    return ScanResult(**scan_doc)

@router.post("/image", response_model=ScanResult, status_code=status.HTTP_201_CREATED)
async def scan_by_image(
    file: UploadFile = File(..., description="Image of ingredient label"),
    current_user: dict = Depends(get_current_user)
):
    """
    Scan product by uploading ingredient label image.
    Uses OCR to extract ingredient text.
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Read image data
    image_data = await file.read()
    
    # Extract ingredients using OCR
    ingredients_text = await ocr_service.extract_ingredients_from_image(image_data)
    
    if not ingredients_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract ingredients from image. OCR service not configured. Please use manual ingredient entry instead."
        )
    
    # Score the extracted ingredients
    db = get_database()
    
    result = await scoring_service.score_ingredients(
        ingredients_text,
        current_user["user_id"]
    )
    
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    # Create scan record
    scan_id = str(uuid.uuid4())
    
    scan_doc = {
        "scan_id": scan_id,
        "user_id": current_user["user_id"],
        "scan_type": "image",
        
        # Product info
        "product_name": None,
        "product_brand": None,
        "product_category": None,
        "product_id": None,
        "ingredients_text": ingredients_text,
        
        # Scoring results
        "verdict": result["verdict"],
        "overall_score": result["overall_score"],
        "moisture_score": result["moisture_score"],
        "buildup_risk": result["buildup_risk"],
        "scalp_score": result["scalp_score"],
        "water_based": result["water_based"],
        "heavy_oils": result["heavy_oils"],
        "protein_heavy": result["protein_heavy"],
        "explanation": result["explanation"],
        
        # Metadata
        "matched_ingredients_count": result["matched_ingredients_count"],
        "total_ingredients_count": result["total_ingredients_count"],
        
        # Hair profile used
        "hair_profile": result["hair_profile"],
        
        # Timestamps
        "created_at": datetime.utcnow()
    }
    
    await db.scans.insert_one(scan_doc)
    logger.info(f"Image scan created: {scan_id}")
    
    return ScanResult(**scan_doc)

@router.get("/history", response_model=List[ScanResult])
async def get_scan_history(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """
    Get user's scan history.
    Returns most recent scans first.
    """
    db = get_database()
    
    cursor = db.scans.find(
        {"user_id": current_user["user_id"]}
    ).sort("created_at", -1).skip(skip).limit(limit)
    
    scans = await cursor.to_list(length=limit)
    
    return [ScanResult(**scan) for scan in scans]

@router.get("/{scan_id}", response_model=ScanResult)
async def get_scan(
    scan_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get specific scan by ID.
    User can only access their own scans.
    """
    db = get_database()
    
    scan = await db.scans.find_one({
        "scan_id": scan_id,
        "user_id": current_user["user_id"]
    })
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    return ScanResult(**scan)

@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_scan(
    scan_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a scan from history"""
    db = get_database()
    
    result = await db.scans.delete_one({
        "scan_id": scan_id,
        "user_id": current_user["user_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    logger.info(f"Scan deleted: {scan_id}")
    return None