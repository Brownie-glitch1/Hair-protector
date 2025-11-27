from typing import Dict, List, Tuple

def evaluate_scalp_safety(ingredients: List[Dict], ingredient_positions: Dict[str, int], scalp_type: str) -> Tuple[int, List[str]]:
    """
    Evaluate product safety for different scalp types.
    Returns (score, explanation_points)
    """
    score = 100
    explanation = []
    
    # Check for scalp-irritating ingredients
    unsafe_for_scalp = [ing for ing in ingredients if not ing.get("scalp_safe", True)]
    
    if unsafe_for_scalp:
        unsafe_in_top = sum(1 for ing in unsafe_for_scalp if ingredient_positions.get(ing["name"], 99) < 10)
        
        if unsafe_in_top >= 2:
            score -= 40
            explanation.append(f"⚠️ Contains scalp irritants ({', '.join([i['name'] for i in unsafe_for_scalp[:2]])})")
        elif unsafe_in_top >= 1:
            score -= 20
            explanation.append("⚠️ Contains potential scalp irritant")
    
    # Specific checks based on scalp type
    if scalp_type == "sensitive":
        # Check for fragrance
        fragrance_terms = ["fragrance", "parfum", "perfume"]
        has_fragrance = any(term in ingredient_positions for term in fragrance_terms)
        
        if has_fragrance:
            score -= 25
            explanation.append("⚠️ Contains fragrance - may irritate sensitive scalp")
        else:
            explanation.append("✓ Fragrance-free - good for sensitive scalp")
        
        # Check for drying alcohols
        drying_alcohols = [ing for ing in ingredients if 
                           ing["category"] == "alcohol" and 
                           not ing.get("scalp_safe", False)]
        
        if drying_alcohols:
            score -= 20
            explanation.append("⚠️ Contains drying alcohols - may irritate sensitive scalp")
        
        # Check for essential oils (can be irritating)
        essential_oil_terms = ["essential oil", "peppermint oil", "tea tree oil", "eucalyptus oil"]
        has_essential_oils = any(term in ingredient_positions for term in essential_oil_terms)
        
        if has_essential_oils:
            score -= 15
            explanation.append("⚠️ Contains essential oils - may cause sensitivity")
    
    elif scalp_type == "oily":
        # Check for heavy oils that can clog pores
        clogging_oils = ["mineral oil", "petrolatum", "coconut oil"]
        found_clogging = [oil for oil in clogging_oils if oil in ingredient_positions]
        
        if found_clogging:
            position = min([ingredient_positions[oil] for oil in found_clogging])
            if position < 10:
                score -= 30
                explanation.append(f"⚠️ Contains pore-clogging ingredients ({', '.join(found_clogging)}) - risky for oily scalp")
            else:
                score -= 10
                explanation.append("⚠️ Contains some pore-clogging ingredients in lower concentration")
        else:
            explanation.append("✓ No pore-clogging heavy oils - good for oily scalp")
        
        # Light oils are good
        light_oils = [ing for ing in ingredients if 
                      ing["category"] == "oil" and 
                      not ing.get("heavy", False) and 
                      ing.get("scalp_safe", True)]
        
        if light_oils:
            score += 10
            explanation.append("✓ Contains light, balancing oils suitable for oily scalp")
    
    elif scalp_type == "dry":
        # Dry scalp benefits from moisturizing ingredients
        moisturizing_oils = [ing for ing in ingredients if 
                             ing["category"] in ["oil", "butter"] and 
                             ing.get("scalp_safe", True)]
        
        if moisturizing_oils:
            score += 15
            explanation.append("✓ Contains nourishing oils for dry scalp relief")
        
        # Check for drying ingredients
        drying_alcohols = [ing for ing in ingredients if 
                           ing["category"] == "alcohol" and 
                           not ing.get("scalp_safe", False)]
        
        if drying_alcohols:
            score -= 30
            explanation.append("⚠️ Contains drying alcohols - will worsen dry scalp")
        
        # Check for harsh sulfates
        harsh_sulfates = ["sodium lauryl sulfate", "sodium laureth sulfate"]
        found_sulfates = [s for s in harsh_sulfates if s in ingredient_positions]
        
        if found_sulfates:
            score -= 20
            explanation.append("⚠️ Contains harsh sulfates - may strip natural oils from dry scalp")
    
    return max(0, min(100, score)), explanation