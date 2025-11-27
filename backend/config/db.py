from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from config.env import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGO_URL}")
        db_instance.client = AsyncIOMotorClient(settings.MONGO_URL)
        db_instance.db = db_instance.client[settings.MONGO_DB_NAME]
        
        # Test connection
        await db_instance.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes
        await create_indexes()
        
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db_instance.client:
        db_instance.client.close()
        logger.info("Closed MongoDB connection")

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.users.create_index("user_id", unique=True)
        
        # Hair profiles collection
        await db_instance.db.hair_profiles.create_index("user_id", unique=True)
        
        # Products collection
        await db_instance.db.products.create_index("barcode", unique=True, sparse=True)
        await db_instance.db.products.create_index("name")
        
        # Ingredients collection
        await db_instance.db.ingredients.create_index("name", unique=True)
        await db_instance.db.ingredients.create_index("category")
        
        # Scans collection
        await db_instance.db.scans.create_index("user_id")
        await db_instance.db.scans.create_index("created_at")
        
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.warning(f"Error creating indexes: {e}")

def get_database():
    """Get database instance"""
    return db_instance.db