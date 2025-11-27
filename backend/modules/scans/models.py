from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ScanByIngredients(BaseModel):
    ingredients_text: str = Field(..., description="Raw ingredient list as text")
    product_name: Optional[str] = Field(None, description="Optional product name")
    product_brand: Optional[str] = None
    product_category: Optional[str] = None

class ScanByBarcode(BaseModel):
    barcode: str = Field(..., description="Product barcode/UPC")

class ScanByImage(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded image")
    product_name: Optional[str] = None
    product_brand: Optional[str] = None

class ScanResult(BaseModel):
    scan_id: str
    user_id: str
    scan_type: str = Field(..., description="ingredients, barcode, or image")
    
    # Product info
    product_name: Optional[str]
    product_brand: Optional[str]
    product_category: Optional[str]
    product_id: Optional[str]
    ingredients_text: str
    
    # Scoring results
    verdict: str
    overall_score: int
    moisture_score: int
    buildup_risk: int
    scalp_score: int
    water_based: bool
    heavy_oils: bool
    protein_heavy: bool
    explanation: List[str]
    
    # Metadata
    matched_ingredients_count: int
    total_ingredients_count: int
    
    # Hair profile used
    hair_profile: Dict
    
    # Timestamps
    created_at: datetime

class ScanHistoryResponse(BaseModel):
    scans: List[ScanResult]
    total: int
    page: int
    limit: int