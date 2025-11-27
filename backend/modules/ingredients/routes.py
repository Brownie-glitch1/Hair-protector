from fastapi import APIRouter, Query
from config.db import get_database
from .models import IngredientResponse
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/search", response_model=List[IngredientResponse])
async def search_ingredients(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=100)
):
    """Search ingredients by name"""
    db = get_database()
    
    cursor = db.ingredients.find(
        {"name": {"$regex": q.lower(), "$options": "i"}}
    ).limit(limit)
    
    ingredients = await cursor.to_list(length=limit)
    
    # Remove MongoDB _id field
    for ing in ingredients:
        ing.pop("_id", None)
    
    return ingredients

@router.get("/{name}", response_model=IngredientResponse)
async def get_ingredient(name: str):
    """Get ingredient by exact name"""
    db = get_database()
    
    ingredient = await db.ingredients.find_one({"name": name.lower()})
    
    if not ingredient:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ingredient '{name}' not found"
        )
    
    ingredient.pop("_id", None)
    return ingredient

@router.get("", response_model=List[IngredientResponse])
async def list_ingredients(
    category: str = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=200)
):
    """List all ingredients with optional category filter"""
    db = get_database()
    
    query = {}
    if category:
        query["category"] = category.lower()
    
    cursor = db.ingredients.find(query).limit(limit)
    ingredients = await cursor.to_list(length=limit)
    
    # Remove MongoDB _id field
    for ing in ingredients:
        ing.pop("_id", None)
    
    return ingredients