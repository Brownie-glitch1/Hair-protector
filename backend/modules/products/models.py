from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    brand: Optional[str] = None
    barcode: Optional[str] = None
    category: str = Field(..., description="e.g., conditioner, shampoo, leave-in, oil")
    ingredients_text: str = Field(..., description="Full ingredient list as text")
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    barcode: Optional[str] = None
    category: Optional[str] = None
    ingredients_text: Optional[str] = None
    image_url: Optional[str] = None

class ProductResponse(BaseModel):
    product_id: str
    name: str
    brand: Optional[str]
    barcode: Optional[str]
    category: str
    ingredients_text: str
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    scan_count: int = 0