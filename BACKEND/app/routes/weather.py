"""
FloodShield AI - Weather Routes
Returns meteorological observations and forecasts.
"""
from fastapi import APIRouter, Query
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("")
def get_weather(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude")
):
    return WeatherService.get_weather_data(lat, lng)
