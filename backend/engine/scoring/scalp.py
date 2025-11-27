from typing import Dict, List

def calculate_scalp_safety_score(ingredients: List[Dict], ingredient_positions: Dict[str, int], scalp_type: str) -> int:
    """
    Calculate scalp safety score (0-100) based on scalp type and ingredients.
    """
    score = 100  # Start with perfect score
    
    # Check for universally problematic ingredients
    unsafe_ingredients = [ing for ing in ingredients if not ing.get("scalp_safe", True)]
    
    for unsafe in unsafe_ingredients:
        position = ingredient_positions.get(unsafe["name"], 99)
        if position < 5:
            score -= 25
        elif position < 10:
            score -= 15
        else:
            score -= 5
    
    # Scalp-specific checks
    if scalp_type == "sensitive":
        # Fragrance penalty
        fragrance_terms = ["fragrance", "parfum", "perfume"]
        if any(term in ingredient_positions for term in fragrance_terms):
            score -= 20
        
        # Drying alcohol penalty
        drying_alcohols = [ing for ing in ingredients if 
                           ing["category"] == "alcohol" and 
                           not ing.get("scalp_safe", False)]
        if drying_alcohols:
            score -= 20
        
        # Essential oils penalty
        essential_oil_terms = ["essential oil", "peppermint oil", "tea tree oil"]
        if any(term in ingredient_positions for term in essential_oil_terms):
            score -= 15
    
    elif scalp_type == "oily":
        # Heavy oils that clog pores
        clogging_ingredients = ["mineral oil", "petrolatum", "coconut oil"]
        found_clogging = [ing for ing in clogging_ingredients if ing in ingredient_positions]
        
        for clog in found_clogging:
            position = ingredient_positions[clog]
            if position < 5:
                score -= 25
            elif position < 10:
                score -= 15
    
    elif scalp_type == "dry":
        # Harsh sulfates penalty
        harsh_sulfates = ["sodium lauryl sulfate"]
        if any(sulfate in ingredient_positions for sulfate in harsh_sulfates):
            score -= 25
        
        # Drying alcohols penalty
        drying_alcohols = [ing for ing in ingredients if 
                           ing["category"] == "alcohol" and 
                           not ing.get("scalp_safe", False)]
        
        for alcohol in drying_alcohols:
            position = ingredient_positions.get(alcohol["name"], 99)
            if position < 10:
                score -= 20
    
    return max(0, min(100, score))