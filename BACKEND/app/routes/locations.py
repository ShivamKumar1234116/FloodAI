"""
FloodShield AI - Locations & Geocoding Endpoints
Searches locations, retrieves coordinates, and provides monitored flood points.
"""
from fastapi import APIRouter, Query
from app.services.geocoding_service import GeocodingService, PRESET_LOCATIONS

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("/search")
def search_locations(q: str = Query(..., min_length=1, description="Location search query, e.g. Haridwar")):
    """
    Geocodes text string to geographic coordinates (latitude & longitude)
    so subsequent environmental telemetry can be accurately collected.
    """
    results = GeocodingService.search(q)
    return {"query": q, "count": len(results), "locations": results}

@router.get("/presets")
def get_monitored_presets():
    """Returns curated high-risk Indian river basin monitoring hotspots."""
    return list(PRESET_LOCATIONS.values())
