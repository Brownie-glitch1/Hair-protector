from fastapi import APIRouter, Depends, HTTPException, status, Query
from config.db import get_database
from middleware.auth import get_current_user
from .models import ProductCreate, ProductUpdate, ProductResponse
import uuid
from datetime import datetime
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new product"""
    db = get_database()
    
    # Check if barcode already exists
    if product_data.barcode:
        existing = await db.products.find_one({"barcode": product_data.barcode})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this barcode already exists"
            )
    
    product_id = str(uuid.uuid4())
    
    product_doc = {
        "product_id": product_id,
        "name": product_data.name,
        "brand": product_data.brand,
        "barcode": product_data.barcode,
        "category": product_data.category,
        "ingredients_text": product_data.ingredients_text,
        "image_url": product_data.image_url,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "scan_count": 0,
        "created_by": current_user["user_id"]
    }
    
    await db.products.insert_one(product_doc)
    logger.info(f"Product created: {product_data.name}")
    
    return ProductResponse(**product_doc)

@router.get("/barcode/{barcode}", response_model=ProductResponse)
async def get_product_by_barcode(barcode: str):
    """Get product by barcode"""
    db = get_database()
    
    product = await db.products.find_one({"barcode": barcode})
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with barcode '{barcode}' not found"
        )
    
    return ProductResponse(**product)

@router.get("/search", response_model=List[ProductResponse])
async def search_products(
    q: str = Query(..., description="Search query"),
    category: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100)
):
    """Search products by name or brand"""
    db = get_database()
    
    query = {
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"brand": {"$regex": q, "$options": "i"}}
        ]
    }
    
    if category:
        query["category"] = category
    
    cursor = db.products.find(query).limit(limit)
    products = await cursor.to_list(length=limit)
    
    return [ProductResponse(**p) for p in products]

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get product by ID"""
    db = get_database()
    
    product = await db.products.find_one({"product_id": product_id})
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return ProductResponse(**product)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update product"""
    db = get_database()
    
    product = await db.products.find_one({"product_id": product_id})
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Build update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if product_update.name:
        update_data["name"] = product_update.name
    if product_update.brand:
        update_data["brand"] = product_update.brand
    if product_update.barcode:
        update_data["barcode"] = product_update.barcode
    if product_update.category:
        update_data["category"] = product_update.category
    if product_update.ingredients_text:
        update_data["ingredients_text"] = product_update.ingredients_text
    if product_update.image_url:
        update_data["image_url"] = product_update.image_url
    
    await db.products.update_one(
        {"product_id": product_id},
        {"$set": update_data}
    )
    
    updated_product = await db.products.find_one({"product_id": product_id})
    
    logger.info(f"Product updated: {product_id}")
    
    return ProductResponse(**updated_product)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete product"""
    db = get_database()
    
    result = await db.products.delete_one({"product_id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    logger.info(f"Product deleted: {product_id}")
    return None