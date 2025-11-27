from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserProfile(BaseModel):
    user_id: str
    email: str
    full_name: str
    created_at: datetime
    total_scans: int = 0