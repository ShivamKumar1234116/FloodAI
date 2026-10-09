"""
FloodShield AI - Public Alerts Route
Displays active flood advisories, AI prediction alerts, and official authority warnings.
"""
from fastapi import APIRouter
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("")
def get_public_alerts():
    """Fetches currently active flood alerts with labeled sources."""
    alerts = AlertService.get_all_alerts(active_only=True)
    return {"count": len(alerts), "alerts": alerts}

from pydantic import BaseModel
class SubscribeRequest(BaseModel):
    phone_number: str
    latitude: float
    longitude: float

@router.post("/subscribe")
def subscribe_to_alerts(req: SubscribeRequest):
    """Registers a phone number for emergency SMS alerts."""
    from app.database.mongodb import db_manager
    collection = db_manager.get_collection("alert_subscribers")
    collection.insert_one({
        "phone_number": req.phone_number,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "is_active": True
    })
    return {"success": True, "message": "Successfully subscribed to emergency flood alerts."}

class DemoTriggerRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: str

@router.post("/trigger-demo")
def trigger_demo_alert(req: DemoTriggerRequest):
    """Bypasses ML model and forces a CRITICAL alert broadcast (For Hackathon Demo)."""
    from app.services.notification_service import NotificationService
    
    NotificationService.trigger_critical_alerts(
        latitude=req.latitude,
        longitude=req.longitude,
        location_name=req.location_name,
        risk_level="CRITICAL"
    )
    return {"success": True, "message": "CRITICAL alert broadcast triggered to all nearby subscribers!"}
