from typing import Dict, List, Tuple

def evaluate_low_porosity(ingredients: List[Dict], ingredient_positions: Dict[str, int]) -> Tuple[int, List[str]]:
    """
    Evaluate product compatibility for low porosity hair.
    Returns (score, explanation_points)
    """
    score = 100
    explanation = []
    
    # Check for heavy oils/butters
    heavy_ingredients = [ing for ing in ingredients if ing.get("heavy", False)]
    
    if heavy_ingredients:
        # Count heavy ingredients in first 10
        heavy_in_top = sum(1 for ing in heavy_ingredients if ingredient_positions.get(ing["name"], 99) < 10)
        
        if heavy_in_top >= 3:
            score -= 40
            explanation.append("⚠️ Multiple heavy oils/butters detected - high buildup risk for low porosity hair")
        elif heavy_in_top >= 1:
            score -= 20
            explanation.append("⚠️ Contains heavy oils/butters - may cause buildup on low porosity hair")
    
    # Check for proteins
    proteins = [ing for ing in ingredients if ing["category"] == "protein" and not ing.get("low_porosity_safe", True)]
    
    if proteins:
        protein_in_top = sum(1 for p in proteins if ingredient_positions.get(p["name"], 99) < 10)
        if protein_in_top >= 2:
            score -= 25
            explanation.append("⚠️ High protein content may make low porosity hair stiff")
    
    # Check for light oils (good for low porosity)
    light_oils = [ing for ing in ingredients if 
                  ing["category"] == "oil" and 
                  not ing.get("heavy", False) and 
                  ing.get("low_porosity_safe", False)]
    
    if light_oils:
        score += 10
        explanation.append(f"✓ Contains light oils ({', '.join([o['name'] for o in light_oils[:2]])}) - good for low porosity")
    
    # Check for water-based formula
    first_ingredients = [name for name, pos in sorted(ingredient_positions.items(), key=lambda x: x[1]) if pos < 5]
    
    if "water" in first_ingredients or "aqua" in first_ingredients:
        score += 15
        explanation.append("✓ Water-based formula - excellent for low porosity hair penetration")
    else:
        score -= 15
        explanation.append("⚠️ Not water-based - may sit on hair surface instead of penetrating")
    
    # Check for humectants (good for moisture)
    humectants = ["glycerin", "propylene glycol", "honey", "aloe vera", "hyaluronic acid"]
    found_humectants = [h for h in humectants if h in ingredient_positions]
    
    if found_humectants:
        score += 10
        explanation.append(f"✓ Contains humectants ({', '.join(found_humectants[:2])}) for moisture retention")
    
    return max(0, min(100, score)), explanation