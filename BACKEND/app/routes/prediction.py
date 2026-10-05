"""
FloodShield AI - Prediction Endpoints
Accepts coordinates or explicit feature vectors, executes RandomForest inference,
and saves prediction history in database.
"""
import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.risk_service import RiskService
from app.services.ml_service import ml_service
from app.database.mongodb import db_manager

router = APIRouter(prefix="/prediction", tags=["Prediction"])

class CoordinatesPredictionRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = "Selected Location"
    historical_flood: Optional[int] = 0

class DirectFeaturePredictionRequest(BaseModel):
    rainfall: float
    temperature: float
    humidity: float
    river_level: float
    soil_moisture: float
    elevation: float
    historical_flood: int = 0
    location_name: Optional[str] = "Manual Input"

@router.post("")
def predict_flood_risk(req: CoordinatesPredictionRequest):
    """
    Main complete flow:
    Coordinates -> Collect Environmental Data -> ML Inference ->
    Risk Classification -> Contributing Factors -> Safe Zones.
    """
    result = RiskService.assess_location_risk(
        latitude=req.latitude,
        longitude=req.longitude,
        location_name=req.location_name,
        historical_flood=req.historical_flood
    )

    # Record prediction in history
    try:
        predictions_col = db_manager.get_collection("predictions")
        predictions_col.insert_one({
            "location_name": req.location_name,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "flood_probability": result["risk_assessment"]["flood_probability"],
            "risk_level": result["risk_assessment"]["risk_level"],
            "features": result["features_used"],
            "timestamp": datetime.datetime.utcnow().isoformat()
        })
    except Exception as e:
        print(f"[Prediction] Error logging history: {e}")

    return result

@router.post("/simulate")
def simulate_manual_features(req: DirectFeaturePredictionRequest):
    """
    Direct ML model inference on specified feature values (for data scientists and scenario testing).
    """
    features = {
        "rainfall": req.rainfall,
        "temperature": req.temperature,
        "humidity": req.humidity,
        "river_level": req.river_level,
        "soil_moisture": req.soil_moisture,
        "elevation": req.elevation,
        "historical_flood": req.historical_flood
    }
    prediction = ml_service.predict(features)
    return {
        "location_name": req.location_name,
        "prediction": prediction,
        "features": features
    }
