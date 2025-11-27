from typing import Dict, List

def calculate_moisture_score(ingredients: List[Dict], ingredient_positions: Dict[str, int]) -> int:
    """
    Calculate moisture score (0-100) based on humectants and moisturizing ingredients.
    """
    score = 50  # Base score
    
    # Humectants (attract moisture)
    humectants = ["glycerin", "propylene glycol", "honey", "aloe vera", "hyaluronic acid", 
                  "sorbitol", "panthenol", "betaine"]
    found_humectants = [h for h in humectants if h in ingredient_positions]
    
    # Score based on position
    for humectant in found_humectants:
        position = ingredient_positions[humectant]
        if position < 5:
            score += 15
        elif position < 10:
            score += 10
        else:
            score += 5
    
    # Moisturizing oils (non-heavy)
    moisturizing_oils = [ing for ing in ingredients if 
                         ing["category"] == "oil" and 
                         not ing.get("heavy", False) and 
                         "moisturizing" in ing.get("properties", [])]
    
    for oil in moisturizing_oils:
        position = ingredient_positions.get(oil["name"], 99)
        if position < 10:
            score += 8
    
    # Water content
    if "water" in ingredient_positions or "aqua" in ingredient_positions:
        water_position = ingredient_positions.get("water", ingredient_positions.get("aqua", 99))
        if water_position == 0:  # First ingredient
            score += 15
        elif water_position < 3:
            score += 10
    
    # Penalize drying alcohols
    drying_alcohols = [ing for ing in ingredients if 
                       ing["category"] == "alcohol" and 
                       not ing.get("scalp_safe", False)]
    
    for alcohol in drying_alcohols:
        position = ingredient_positions.get(alcohol["name"], 99)
        if position < 5:
            score -= 20
        elif position < 10:
            score -= 10
    
    # Penalize harsh sulfates
    harsh_sulfates = ["sodium lauryl sulfate"]
    for sulfate in harsh_sulfates:
        if sulfate in ingredient_positions:
            score -= 15
    
    return max(0, min(100, score))