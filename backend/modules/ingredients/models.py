from pydantic import BaseModel
from typing import Optional, List

class IngredientResponse(BaseModel):
    name: str
    category: str
    heavy: bool
    low_porosity_safe: bool
    high_porosity_safe: bool
    scalp_safe: bool
    properties: List[str]
    notes: str

class IngredientSearch(BaseModel):
    query: str
    limit: int = 20