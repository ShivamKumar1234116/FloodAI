import os

class Settings:
    PROJECT_NAME: str = "FloodShield AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "floodshield-ai-super-secret-key-2026-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "floodshield_db")
    
    # ML Model & Config
    ML_MODEL_PATH: str = os.getenv(
        "ML_MODEL_PATH",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ML", "flood_model.pkl"))
    )
    FEATURE_CONFIG_PATH: str = os.getenv(
        "FEATURE_CONFIG_PATH",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ML", "feature_config.json"))
    )
    
    # Default Admin
    DEFAULT_ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@floodshield.ai")
    DEFAULT_ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "Admin@12345")
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
