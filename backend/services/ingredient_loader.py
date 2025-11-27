import json
import asyncio
from pathlib import Path
from config.db import get_database
import logging

logger = logging.getLogger(__name__)

async def load_ingredients_to_db():
    """Load ingredient data from JSON files into MongoDB"""
    db = get_database()
    data_dir = Path(__file__).parent.parent / "data"
    
    json_files = [
        "oils.json", 
        "butters.json", 
        "proteins.json", 
        "alcohols.json", 
        "silicones.json", 
        "surfactants.json"
    ]
    
    total_loaded = 0
    
    for filename in json_files:
        filepath = data_dir / filename
        
        if not filepath.exists():
            logger.warning(f"File not found: {filepath}")
            continue
        
        try:
            with open(filepath, 'r') as f:
                ingredients = json.load(f)
            
            for ingredient in ingredients:
                # Use upsert to avoid duplicates
                await db.ingredients.update_one(
                    {"name": ingredient["name"]},
                    {"$set": ingredient},
                    upsert=True
                )
                total_loaded += 1
            
            logger.info(f"Loaded {len(ingredients)} ingredients from {filename}")
        
        except Exception as e:
            logger.error(f"Error loading {filename}: {e}")
    
    logger.info(f"Total ingredients loaded: {total_loaded}")
    return total_loaded

async def get_ingredient_by_name(name: str):
    """Get ingredient info from database"""
    db = get_database()
    return await db.ingredients.find_one({"name": name.lower()})

async def search_ingredients(query: str, limit: int = 20):
    """Search ingredients by name"""
    db = get_database()
    cursor = db.ingredients.find(
        {"name": {"$regex": query.lower(), "$options": "i"}}
    ).limit(limit)
    
    return await cursor.to_list(length=limit)

if __name__ == "__main__":
    # For testing
    from config.db import connect_to_mongo, close_mongo_connection
    
    async def main():
        await connect_to_mongo()
        count = await load_ingredients_to_db()
        print(f"Loaded {count} ingredients")
        await close_mongo_connection()
    
    asyncio.run(main())
