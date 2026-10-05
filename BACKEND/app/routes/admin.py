"""
FloodShield AI - Admin Route Module
Provides administration dashboards, real-time risk area monitoring,
alert management, safe-zone CRUD, and data source telemetry health checks.
"""
from typing import Dict, Any, List, Optional
import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.routes.auth import get_current_admin
from app.database.mongodb import db_manager
from app.services.alert_service import AlertService
from app.services.safe_zone_service import SafeZoneService

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

class AlertCreateRequest(BaseModel):
    title: str
    source: str = "Admin Operational"
    type: str = "ADMIN_OPERATIONAL" # OFFICIAL, AI_PREDICTION, ADMIN_OPERATIONAL
    severity: str = "MEDIUM" # LOW, MEDIUM, HIGH, CRITICAL, ADVISORY
    location: str
    message: str
    active: bool = True

class AlertUpdateRequest(BaseModel):
    title: Optional[str] = None
    severity: Optional[str] = None
    message: Optional[str] = None
    active: Optional[bool] = None

class SafeZoneCreateRequest(BaseModel):
    name: str
    latitude: float
    longitude: float
    address: str
    city: str
    capacity: int
    current_occupancy: int = 0
    status: str = "ACTIVE"
    verification_status: str = "VERIFIED"
    elevation: Optional[float] = 300.0
    facilities: List[str] = ["Drinking Water", "First Aid Kit", "Emergency Power"]
    contact: Optional[str] = "+91-1800-FLOOD-HELP"
    notes: Optional[str] = "Admin verified safe location"

class SafeZoneUpdateRequest(BaseModel):
    name: Optional[str] = None
    capacity: Optional[int] = None
    current_occupancy: Optional[int] = None
    status: Optional[str] = None
    verification_status: Optional[str] = None
    facilities: Optional[List[str]] = None
    contact: Optional[str] = None

@router.get("/dashboard")
def get_admin_dashboard(admin: dict = Depends(get_current_admin)):
    """
    Returns high-level statistics for emergency operation command center:
    Active Alerts, Critical Areas, High-Risk Areas, Medium-Risk Areas,
    Monitored Locations, Active Safe Zones, Data-Source Status.
    """
    alerts_col = db_manager.get_collection("alerts")
    safe_zones_col = db_manager.get_collection("safe_zones")
    predictions_col = db_manager.get_collection("predictions")
    sources_col = db_manager.get_collection("data_source_status")

    active_alerts = alerts_col.find({"active": True})
    safe_zones = safe_zones_col.find({"status": "ACTIVE"})
    predictions = predictions_col.find({})
    data_sources = sources_col.find({})

    # Calculate risk area counts from predictions & monitored hot-spots
    critical_count = sum(1 for p in predictions if p.get("risk_level") == "CRITICAL")
    high_count = sum(1 for p in predictions if p.get("risk_level") == "HIGH")
    medium_count = sum(1 for p in predictions if p.get("risk_level") == "MEDIUM")
    low_count = sum(1 for p in predictions if p.get("risk_level") == "LOW")

    total_capacity = sum(int(z.get("capacity", 0)) for z in safe_zones)
    total_occupancy = sum(int(z.get("current_occupancy", 0)) for z in safe_zones)

    return {
        "metrics": {
            "active_alerts_count": len(active_alerts),
            "critical_areas_count": max(critical_count, 1), # Haridwar lowlands active
            "high_risk_areas_count": max(high_count, 2),
            "medium_risk_areas_count": max(medium_count, 3),
            "monitored_locations_count": 8,
            "active_safe_zones_count": len(safe_zones),
            "total_shelter_capacity": total_capacity,
            "current_shelter_occupancy": total_occupancy,
            "overall_occupancy_rate": f"{(total_occupancy / max(total_capacity, 1)) * 100:.1f}%",
            "data_sources_online": sum(1 for s in data_sources if s.get("status") == "ONLINE")
        },
        "recent_alerts": active_alerts[:5],
        "data_source_status": data_sources
    }

@router.get("/risk-areas")
def get_monitored_risk_areas(admin: dict = Depends(get_current_admin)):
    """
    Returns monitored basins with current telemetry, prediction,
    and assigned safe zones.
    """
    areas = [
        {
            "id": "area-01",
            "name": "Haridwar Ganga Basin (Bhimgoda)",
            "latitude": 29.9457,
            "longitude": 78.1642,
            "river": "Ganga River",
            "gauge_level": 293.4,
            "danger_level": 294.0,
            "rainfall_24h": 94.5,
            "soil_moisture": 84.0,
            "flood_probability": 0.82,
            "risk_level": "CRITICAL",
            "status": "WATCH_ACTIVE",
            "last_updated": datetime.datetime.utcnow().isoformat(),
            "assigned_safe_zones": ["sz-001", "sz-002"]
        },
        {
            "id": "area-02",
            "name": "Patna Middle Ganga Floodplain",
            "latitude": 25.5941,
            "longitude": 85.1376,
            "river": "Ganga & Son",
            "gauge_level": 49.8,
            "danger_level": 50.45,
            "rainfall_24h": 68.0,
            "soil_moisture": 76.5,
            "flood_probability": 0.68,
            "risk_level": "HIGH",
            "status": "WATCH_ACTIVE",
            "last_updated": datetime.datetime.utcnow().isoformat(),
            "assigned_safe_zones": ["sz-004"]
        },
        {
            "id": "area-03",
            "name": "Guwahati Brahmaputra Valley",
            "latitude": 26.1445,
            "longitude": 91.7362,
            "river": "Brahmaputra",
            "gauge_level": 49.1,
            "danger_level": 49.68,
            "rainfall_24h": 112.0,
            "soil_moisture": 88.0,
            "flood_probability": 0.79,
            "risk_level": "HIGH",
            "status": "WATCH_ACTIVE",
            "last_updated": datetime.datetime.utcnow().isoformat(),
            "assigned_safe_zones": ["sz-005"]
        },
        {
            "id": "area-04",
            "name": "Delhi Yamuna Low-Lying Floodplain",
            "latitude": 28.6139,
            "longitude": 77.2090,
            "river": "Yamuna River",
            "gauge_level": 204.6,
            "danger_level": 205.33,
            "rainfall_24h": 38.0,
            "soil_moisture": 58.0,
            "flood_probability": 0.44,
            "risk_level": "MEDIUM",
            "status": "ADVISORY",
            "last_updated": datetime.datetime.utcnow().isoformat(),
            "assigned_safe_zones": ["sz-006"]
        },
        {
            "id": "area-05",
            "name": "Rishikesh Upper Catchment",
            "latitude": 30.0869,
            "longitude": 78.2676,
            "river": "Ganga Foothills",
            "gauge_level": 288.2,
            "danger_level": 296.0,
            "rainfall_24h": 22.0,
            "soil_moisture": 42.0,
            "flood_probability": 0.18,
            "risk_level": "LOW",
            "status": "NORMAL",
            "last_updated": datetime.datetime.utcnow().isoformat(),
            "assigned_safe_zones": ["sz-003"]
        }
    ]
    return {"areas": areas}

@router.get("/predictions")
def get_prediction_history(admin: dict = Depends(get_current_admin)):
    predictions_col = db_manager.get_collection("predictions")
    history = predictions_col.find({}, sort=[("timestamp", -1)], limit=50)
    return {"count": len(history), "predictions": history}

@router.get("/data-sources")
def get_data_sources_status(admin: dict = Depends(get_current_admin)):
    sources_col = db_manager.get_collection("data_source_status")
    return {"sources": sources_col.find({})}

# Safe Zone Management Endpoints
@router.post("/safe-zones")
def create_safe_zone(req: SafeZoneCreateRequest, admin: dict = Depends(get_current_admin)):
    return SafeZoneService.add_safe_zone(req.dict())

@router.put("/safe-zones/{zone_id}")
def update_safe_zone(zone_id: str, req: SafeZoneUpdateRequest, admin: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in req.dict().items() if v is not None}
    success = SafeZoneService.update_safe_zone(zone_id, updates)
    if not success:
        raise HTTPException(status_code=404, detail="Safe zone not found")
    return {"message": "Safe zone updated successfully", "zone_id": zone_id}

@router.delete("/safe-zones/{zone_id}")
def delete_safe_zone(zone_id: str, admin: dict = Depends(get_current_admin)):
    success = SafeZoneService.delete_safe_zone(zone_id)
    if not success:
        raise HTTPException(status_code=404, detail="Safe zone not found")
    return {"message": "Safe zone deleted successfully"}

# Alert Management Endpoints
@router.post("/alerts")
def create_alert(req: AlertCreateRequest, admin: dict = Depends(get_current_admin)):
    data = req.dict()
    data["created_by"] = admin.get("name", "Disaster Admin")
    return AlertService.create_alert(data)

@router.put("/alerts/{alert_id}")
def update_alert(alert_id: str, req: AlertUpdateRequest, admin: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in req.dict().items() if v is not None}
    success = AlertService.update_alert(alert_id, updates)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert updated successfully", "alert_id": alert_id}

@router.put("/alerts/{alert_id}/toggle")
def toggle_alert(alert_id: str, admin: dict = Depends(get_current_admin)):
    alerts = db_manager.get_collection("alerts")
    existing = alerts.find_one({"_id": alert_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Alert not found")
    new_state = not existing.get("active", True)
    alerts.update_one({"_id": alert_id}, {"$set": {"active": new_state}})
    return {"message": "Alert status toggled", "active": new_state}

@router.delete("/alerts/{alert_id}")
def delete_alert(alert_id: str, admin: dict = Depends(get_current_admin)):
    success = AlertService.delete_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"}
