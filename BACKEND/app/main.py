"""
FloodShield AI - FastAPI Main Application Entry Point
Full-stack AI/ML disaster decision-support platform.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

# Import Route Modules
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.prediction import router as prediction_router
from app.routes.locations import router as locations_router
from app.routes.weather import router as weather_router
from app.routes.river import router as river_router
from app.routes.safe_zones import router as safe_zones_router
from app.routes.alerts import router as alerts_router
from app.routes.chatbot import router as chatbot_router
from app.routes.admin import router as admin_router

app = FastAPI(
    title="FloodShield AI API",
    description="Full-stack AI/ML localized flood risk estimation, safe-zone recommendation, and alert management system.",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes under /api
api_prefix = settings.API_PREFIX

app.include_router(auth_router, prefix=api_prefix)
app.include_router(user_router, prefix=api_prefix)
app.include_router(prediction_router, prefix=api_prefix)
app.include_router(locations_router, prefix=api_prefix)
app.include_router(weather_router, prefix=api_prefix)
app.include_router(river_router, prefix=api_prefix)
app.include_router(safe_zones_router, prefix=api_prefix)
app.include_router(alerts_router, prefix=api_prefix)
app.include_router(chatbot_router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)

@app.get("/")
def root():
    return {
        "system": "FloodShield AI Core API",
        "status": "OPERATIONAL",
        "version": settings.VERSION,
        "docs": "/api/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FloodShield AI",
        "ml_model_status": "READY",
        "database": "CONNECTED"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
