import json
import os
from typing import Dict, List, Optional
from pathlib import Path

from engine.rules.low_porosity import evaluate_low_porosity
from engine.rules.high_porosity import evaluate_high_porosity
from engine.rules.scalp import evaluate_scalp_safety
from engine.rules.protein import evaluate_protein_balance
from engine.scoring.moisture import calculate_moisture_score
from engine.scoring.buildup import calculate_buildup_risk
from engine.scoring.scalp import calculate_scalp_safety_score


class IngredientEngine:
    """Main ingredient scoring engine for hair product compatibility"""
    
    def __init__(self):
        self.ingredient_database = self._load_ingredient_database()
    
    def _load_ingredient_database(self) -> Dict[str, Dict]:
        """Load all ingredient data from JSON files"""
        data_dir = Path(__file__).parent.parent / "data"
        database = {}
        
        json_files = ["oils.json", "butters.json", "proteins.json", 
                      "alcohols.json", "silicones.json", "surfactants.json"]
        
        for filename in json_files:
            filepath = data_dir / filename
            if filepath.exists():
                with open(filepath, 'r') as f:
                    ingredients = json.load(f)
                    for ingredient in ingredients:
                        # Store by lowercase name for easy lookup
                        database[ingredient["name"].lower()] = ingredient
        
        return database
    
    def parse_ingredient_list(self, ingredient_text: str) -> List[str]:
        """
        Parse ingredient text into a clean list.
        Handles various formats: comma-separated, with parentheses, etc.
        """
        # Remove common prefixes
        text = ingredient_text.lower().strip()
        text = text.replace("ingredients:", "").replace("aqua", "water")
        
        # Split by common delimiters
        ingredients = []
        for item in text.split(","):
            # Clean up each ingredient
            item = item.strip()
            
            # Remove content in parentheses (often derivatives or specifications)
            if "(" in item:
                item = item[:item.index("(")].strip()
            
            if item:
                ingredients.append(item)
        
        return ingredients
    
    def match_ingredients(self, ingredient_names: List[str]) -> tuple[List[Dict], Dict[str, int]]:
        """
        Match ingredient names to database entries.
        Returns (matched_ingredients, ingredient_positions)
        """
        matched = []
        positions = {}
        
        for idx, name in enumerate(ingredient_names):
            name_lower = name.lower().strip()
            positions[name_lower] = idx
            
            # Direct match
            if name_lower in self.ingredient_database:
                matched.append(self.ingredient_database[name_lower])
            # Partial match for variations
            else:
                for db_name, db_ingredient in self.ingredient_database.items():
                    if db_name in name_lower or name_lower in db_name:
                        matched.append(db_ingredient)
                        positions[db_ingredient["name"]] = idx
                        break
        
        return matched, positions
    
    def detect_water_based(self, ingredient_positions: Dict[str, int]) -> bool:
        """Check if product is water-based (water in first 5 ingredients)"""
        water_terms = ["water", "aqua"]
        for term in water_terms:
            if term in ingredient_positions and ingredient_positions[term] < 5:
                return True
        return False
    
    def detect_heavy_oils(self, ingredients: List[Dict], ingredient_positions: Dict[str, int]) -> bool:
        """Check if product contains heavy oils in significant amounts"""
        heavy_oils = ["coconut oil", "castor oil", "mineral oil", "petrolatum", "olive oil"]
        
        for oil in heavy_oils:
            if oil in ingredient_positions and ingredient_positions[oil] < 10:
                return True
        
        # Also check from matched ingredients
        heavy_in_top = [ing for ing in ingredients 
                       if ing.get("heavy", False) 
                       and ingredient_positions.get(ing["name"], 99) < 10]
        
        return len(heavy_in_top) >= 2
    
    def score_product(self, ingredient_text: str, hair_profile: Dict) -> Dict:
        """
        Main scoring function. Analyzes ingredients against hair profile.
        
        Args:
            ingredient_text: Raw ingredient list as text
            hair_profile: User's hair profile dict with porosity, scalp_type, etc.
        
        Returns:
            Complete scoring result with verdict and explanations
        """
        # Parse and match ingredients
        ingredient_names = self.parse_ingredient_list(ingredient_text)
        matched_ingredients, ingredient_positions = self.match_ingredients(ingredient_names)
        
        if not matched_ingredients:
            return {
                "verdict": "UNKNOWN",
                "moisture_score": 0,
                "buildup_risk": 0,
                "scalp_score": 0,
                "water_based": False,
                "heavy_oils": False,
                "protein_heavy": False,
                "explanation": ["❌ Unable to analyze - no recognized ingredients found"]
            }
        
        # Extract hair profile data
        porosity = hair_profile.get("porosity", "medium")
        scalp_type = hair_profile.get("scalp_type", "normal")
        
        # Run all scoring modules
        explanation = []
        
        # 1. Porosity-specific rules
        if porosity == "low":
            porosity_score, porosity_exp = evaluate_low_porosity(matched_ingredients, ingredient_positions)
            explanation.extend(porosity_exp)
        elif porosity == "high":
            porosity_score, porosity_exp = evaluate_high_porosity(matched_ingredients, ingredient_positions)
            explanation.extend(porosity_exp)
        else:  # medium
            porosity_score = 80  # Base good score for medium
            explanation.append("ℹ️ Medium porosity - most products work well")
        
        # 2. Scalp safety
        scalp_score, scalp_exp = evaluate_scalp_safety(matched_ingredients, ingredient_positions, scalp_type)
        explanation.extend(scalp_exp)
        
        # 3. Protein balance
        protein_heavy, protein_exp = evaluate_protein_balance(matched_ingredients, ingredient_positions)
        explanation.extend(protein_exp)
        
        # 4. Calculate numeric scores
        moisture_score = calculate_moisture_score(matched_ingredients, ingredient_positions)
        buildup_risk = calculate_buildup_risk(matched_ingredients, ingredient_positions, porosity)
        scalp_safety_score = calculate_scalp_safety_score(matched_ingredients, ingredient_positions, scalp_type)
        
        # 5. Detect key properties
        water_based = self.detect_water_based(ingredient_positions)
        heavy_oils = self.detect_heavy_oils(matched_ingredients, ingredient_positions)
        
        # 6. Calculate overall verdict
        # Average the main scores
        overall_score = (porosity_score + scalp_score + moisture_score) / 3
        
        # Adjust based on risks
        if buildup_risk > 60:
            overall_score -= 15
        
        if scalp_safety_score < 50:
            overall_score -= 20
        
        # Determine verdict
        if overall_score >= 70:
            verdict = "GREAT"
            verdict_emoji = "✅"
        elif overall_score >= 50:
            verdict = "CAUTION"
            verdict_emoji = "⚠️"
        else:
            verdict = "AVOID"
            verdict_emoji = "❌"
        
        # Add verdict summary
        explanation.insert(0, f"{verdict_emoji} Overall verdict: {verdict} (Score: {int(overall_score)}/100)")
        
        return {
            "verdict": verdict,
            "overall_score": int(overall_score),
            "moisture_score": moisture_score,
            "buildup_risk": buildup_risk,
            "scalp_score": scalp_safety_score,
            "water_based": water_based,
            "heavy_oils": heavy_oils,
            "protein_heavy": protein_heavy,
            "matched_ingredients_count": len(matched_ingredients),
            "total_ingredients_count": len(ingredient_names),
            "explanation": explanation
        }


# Global engine instance
engine = IngredientEngine()
