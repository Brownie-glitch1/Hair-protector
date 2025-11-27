from engine.engine import engine
from config.db import get_database
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class ScoringService:
    """Service for scoring products against user hair profiles"""
    
    @staticmethod
    async def score_ingredients(ingredient_text: str, user_id: str) -> Dict:
        """
        Score ingredient list against user's hair profile.
        
        Args:
            ingredient_text: Raw ingredient list as text
            user_id: User's ID to fetch hair profile
        
        Returns:
            Scoring result with verdict and explanations
        """
        db = get_database()
        
        # Fetch user's hair profile
        hair_profile = await db.hair_profiles.find_one({"user_id": user_id})
        
        if not hair_profile:
            return {
                "error": "No hair profile found",
                "message": "Please complete your hair profile before scanning products",
                "requires_profile": True
            }
        
        # Run the scoring engine
        try:
            result = engine.score_product(ingredient_text, hair_profile)
            
            # Add hair profile info to result
            result["hair_profile"] = {
                "porosity": hair_profile["porosity"],
                "curl_pattern": hair_profile["curl_pattern"],
                "scalp_type": hair_profile["scalp_type"],
                "density": hair_profile["density"]
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error scoring ingredients: {e}", exc_info=True)
            return {
                "error": "Scoring failed",
                "message": str(e)
            }
    
    @staticmethod
    async def score_product_by_id(product_id: str, user_id: str) -> Dict:
        """
        Score a saved product against user's hair profile.
        
        Args:
            product_id: Product ID from database
            user_id: User's ID to fetch hair profile
        
        Returns:
            Scoring result with product info
        """
        db = get_database()
        
        # Fetch product
        product = await db.products.find_one({"product_id": product_id})
        
        if not product:
            return {
                "error": "Product not found",
                "message": f"No product found with ID {product_id}"
            }
        
        # Score using product ingredients
        result = await ScoringService.score_ingredients(
            product["ingredients_text"], 
            user_id
        )
        
        # Add product info
        if "error" not in result:
            result["product"] = {
                "product_id": product["product_id"],
                "name": product["name"],
                "brand": product.get("brand"),
                "category": product["category"]
            }
        
        return result

scoring_service = ScoringService()