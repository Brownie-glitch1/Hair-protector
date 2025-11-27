from typing import Dict, List, Tuple

def evaluate_high_porosity(ingredients: List[Dict], ingredient_positions: Dict[str, int]) -> Tuple[int, List[str]]:
    """
    Evaluate product compatibility for high porosity hair.
    Returns (score, explanation_points)
    """
    score = 100
    explanation = []
    
    # High porosity NEEDS proteins for strength
    proteins = [ing for ing in ingredients if ing["category"] == "protein"]
    
    if proteins:
        protein_in_top = sum(1 for p in proteins if ingredient_positions.get(p["name"], 99) < 10)
        if protein_in_top >= 2:
            score += 20
            explanation.append(f"✓ Contains proteins ({', '.join([p['name'] for p in proteins[:2]])}) - excellent for strengthening high porosity hair")
        elif protein_in_top >= 1:
            score += 10
            explanation.append("✓ Contains protein for strengthening damaged cuticles")
    else:
        score -= 15
        explanation.append("⚠️ No proteins detected - high porosity hair benefits from protein for strength")
    
    # High porosity NEEDS heavy oils/butters for sealing
    heavy_ingredients = [ing for ing in ingredients if ing.get("heavy", False)]
    
    if heavy_ingredients:
        heavy_in_top = sum(1 for ing in heavy_ingredients if ingredient_positions.get(ing["name"], 99) < 10)
        
        if heavy_in_top >= 2:
            score += 20
            explanation.append(f"✓ Contains sealing oils/butters ({', '.join([h['name'] for h in heavy_ingredients[:2]])}) - locks in moisture for high porosity")
        elif heavy_in_top >= 1:
            score += 10
            explanation.append("✓ Contains heavy oils for moisture sealing")
    else:
        score -= 10
        explanation.append("⚠️ Lacks heavy oils/butters - high porosity needs sealing ingredients")
    
    # Check for humectants (very important for high porosity)
    humectants = ["glycerin", "propylene glycol", "honey", "aloe vera", "hyaluronic acid"]
    found_humectants = [h for h in humectants if h in ingredient_positions]
    
    if found_humectants:
        score += 15
        explanation.append(f"✓ Rich in humectants ({', '.join(found_humectants[:2])}) - draws moisture into high porosity hair")
    else:
        score -= 10
        explanation.append("⚠️ Low humectant content - high porosity needs moisture-attracting ingredients")
    
    # Check for drying alcohols (bad for high porosity)
    drying_alcohols = [ing for ing in ingredients if 
                       ing["category"] == "alcohol" and 
                       not ing.get("scalp_safe", False)]
    
    if drying_alcohols:
        alcohol_in_top = sum(1 for a in drying_alcohols if ingredient_positions.get(a["name"], 99) < 10)
        if alcohol_in_top >= 1:
            score -= 25
            explanation.append("⚠️ Contains drying alcohols - will further dry out high porosity hair")
    
    # Check for silicones (can be helpful for high porosity if used correctly)
    silicones = [ing for ing in ingredients if ing["category"] == "silicone"]
    water_soluble_silicones = [s for s in silicones if "water-soluble" in s.get("properties", [])]
    
    if water_soluble_silicones:
        score += 10
        explanation.append("✓ Contains water-soluble silicones for shine without buildup")
    
    return max(0, min(100, score)), explanation