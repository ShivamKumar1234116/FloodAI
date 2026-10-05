"""
FloodShield AI - Safe Zone Routes
Provides suitable verified safe zones, spatial ranking, capacity queries, and map markers.
"""
from fastapi import APIRouter, Query
from app.services.safe_zone_service import SafeZoneService

router = APIRouter(prefix="/safe-zones", tags=["Safe Zones"])

@router.get("/nearby")
def get_nearby_safe_zones(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    max_dist: float = Query(60.0, description="Max search distance in km")
):
    """
    Ranks suitable verified safe zones based on distance, capacity,
    facilities, and topological safety.
    """
    zones = SafeZoneService.get_nearby_safe_zones(lat, lng, max_distance_km=max_dist)
    return {"count": len(zones), "safe_zones": zones}

@router.get("")
def get_all_safe_zones():
    """Returns all verified safe zones for map and directory display."""
    zones = SafeZoneService.get_all_safe_zones()
    return {"count": len(zones), "safe_zones": zones}
