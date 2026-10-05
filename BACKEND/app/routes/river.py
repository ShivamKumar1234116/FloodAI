"""
FloodShield AI - River Routes
Returns hydrological gauge levels, discharge volume, and river basin danger stages.
"""
from fastapi import APIRouter, Query
from app.services.river_service import RiverService

router = APIRouter(prefix="/river", tags=["River"])

@router.get("")
def get_river_status(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude")
):
    return RiverService.get_river_data(lat, lng)
