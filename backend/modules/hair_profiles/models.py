from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime

class PorosityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class CurlPattern(str, Enum):
    TYPE_3A = "3a"
    TYPE_3B = "3b"
    TYPE_3C = "3c"
    TYPE_4A = "4a"
    TYPE_4B = "4b"
    TYPE_4C = "4c"

class ScalpType(str, Enum):
    DRY = "dry"
    NORMAL = "normal"
    OILY = "oily"
    SENSITIVE = "sensitive"

class HairDensity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class HairProfileCreate(BaseModel):
    porosity: PorosityLevel
    curl_pattern: CurlPattern
    scalp_type: ScalpType
    density: HairDensity
    notes: Optional[str] = None

class HairProfileUpdate(BaseModel):
    porosity: Optional[PorosityLevel] = None
    curl_pattern: Optional[CurlPattern] = None
    scalp_type: Optional[ScalpType] = None
    density: Optional[HairDensity] = None
    notes: Optional[str] = None

class HairProfileResponse(BaseModel):
    profile_id: str
    user_id: str
    porosity: PorosityLevel
    curl_pattern: CurlPattern
    scalp_type: ScalpType
    density: HairDensity
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime