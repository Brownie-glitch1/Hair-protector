from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config.env import settings
from config.db import connect_to_mongo, close_mongo_connection
from middleware.rate_limit import rate_limiter
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Afro Hair Product Scanner API - Analyze product compatibility with your hair type",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    logger.info("Starting up Hair Scanner API...")
    await connect_to_mongo()
    
    # Load ingredients into database
    from services.ingredient_loader import load_ingredients_to_db
    try:
        count = await load_ingredients_to_db()
        logger.info(f"Loaded {count} ingredients into database")
    except Exception as e:
        logger.warning(f"Error loading ingredients: {e}")
    
    logger.info("API ready to accept requests")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    logger.info("Shutting down Hair Scanner API...")
    await close_mongo_connection()

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Apply rate limiting to all requests"""
    try:
        await rate_limiter.check_rate_limit(request)
        response = await call_next(request)
        return response
    except Exception as e:
        return JSONResponse(
            status_code=429,
            content={"detail": str(e)}
        )

# Import and register routes
from modules.auth.routes import router as auth_router
from modules.users.routes import router as users_router
from modules.hair_profiles.routes import router as hair_profiles_router

app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(users_router, prefix=settings.API_V1_PREFIX)
app.include_router(hair_profiles_router, prefix=settings.API_V1_PREFIX)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Afro Hair Product Scanner API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "path": str(request.url)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
