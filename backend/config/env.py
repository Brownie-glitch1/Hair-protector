from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    # MongoDB
    MONGO_URL: str
    MONGO_DB_NAME: str = "hair_scanner"
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    
    # API
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Afro Hair Product Scanner"
    
    # CORS
    BACKEND_CORS_ORIGINS: str = '["http://localhost:3000"]'
    
    # Optional API Keys
    OCR_API_KEY: str = "placeholder"
    BARCODE_API_KEY: str = "placeholder"
    
    @property
    def cors_origins(self) -> List[str]:
        try:
            return json.loads(self.BACKEND_CORS_ORIGINS)
        except:
            return ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()