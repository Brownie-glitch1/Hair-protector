from typing import Dict, List

def calculate_buildup_risk(ingredients: List[Dict], ingredient_positions: Dict[str, int], porosity: str) -> int:
    """
    Calculate buildup risk (0-100) based on heavy ingredients and porosity.
    Higher score = higher risk
    """
    risk = 0
    
    # Heavy oils and butters
    heavy_ingredients = [ing for ing in ingredients if ing.get("heavy", False)]
    
    for heavy_ing in heavy_ingredients:
        position = ingredient_positions.get(heavy_ing["name"], 99)
        
        if position < 5:
            base_risk = 25
        elif position < 10:
            base_risk = 15
        elif position < 15:
            base_risk = 8
        else:
            base_risk = 3
        
        # Multiply risk for low porosity
        if porosity == "low":
            risk += base_risk * 1.5
        elif porosity == "medium":
            risk += base_risk
        else:  # high porosity
            risk += base_risk * 0.5
    
    # Non-water-soluble silicones
    non_soluble_silicones = [ing for ing in ingredients if 
                             ing["category"] == "silicone" and 
                             "water-soluble" not in ing.get("properties", [])]
    
    for silicone in non_soluble_silicones:
        position = ingredient_positions.get(silicone["name"], 99)
        
        if position < 10:
            if porosity == "low":
                risk += 20
            else:
                risk += 10
    
    # Mineral oil and petrolatum (worst offenders)
    coating_oils = ["mineral oil", "petrolatum"]
    for oil in coating_oils:
        if oil in ingredient_positions:
            position = ingredient_positions[oil]
            if position < 10:
                risk += 30
            else:
                risk += 15
    
    # Reduce risk if product has cleansing agents (it's a cleanser)
    surfactants = [ing for ing in ingredients if ing["category"] == "surfactant"]
    if surfactants:
        risk = max(0, risk - 30)  # Cleansers have lower buildup risk
    
    return max(0, min(100, int(risk)))