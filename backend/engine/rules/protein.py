from typing import Dict, List, Tuple

def evaluate_protein_balance(ingredients: List[Dict], ingredient_positions: Dict[str, int]) -> Tuple[bool, List[str]]:
    """
    Evaluate if product is protein-heavy.
    Returns (is_protein_heavy, explanation_points)
    """
    explanation = []
    
    # Count proteins in top 10 ingredients
    proteins = [ing for ing in ingredients if ing["category"] == "protein"]
    proteins_in_top_10 = sum(1 for p in proteins if ingredient_positions.get(p["name"], 99) < 10)
    
    is_protein_heavy = proteins_in_top_10 >= 2
    
    if is_protein_heavy:
        protein_names = [p["name"] for p in proteins if ingredient_positions.get(p["name"], 99) < 10]
        explanation.append(f"⚠️ Protein-heavy formula with {', '.join(protein_names[:2])}")
        explanation.append("ℹ️ Use balanced with moisturizing products to avoid protein overload")
    elif proteins_in_top_10 == 1:
        explanation.append("✓ Balanced protein content for strengthening")
    
    return is_protein_heavy, explanation