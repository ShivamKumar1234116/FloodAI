"""
FloodShield AI - Risk Engine Service
Integrates environmental pipelines, coordinates ML predictions,
classifies risk categories, and generates localized citizen/farmer actions.
"""
from typing import Dict, Any
from app.services.weather_service import WeatherService
from app.services.river_service import RiverService
from app.services.elevation_service import ElevationService
from app.services.ml_service import ml_service
from app.services.safe_zone_service import SafeZoneService

class RiskService:
    @staticmethod
    def assess_location_risk(
        latitude: float,
        longitude: float,
        location_name: str = "Target Area",
        historical_flood: int = 0
    ) -> Dict[str, Any]:
        # 1. Fetch live environmental metrics
        weather = WeatherService.get_weather_data(latitude, longitude)
        river = RiverService.get_river_data(latitude, longitude)
        elev = ElevationService.get_elevation(latitude, longitude)

        # 2. Build feature vector
        features = {
            "rainfall": weather.get("rainfall_24h", 25.0),
            "temperature": weather.get("temperature", 28.0),
            "humidity": weather.get("humidity", 70.0),
            "river_level": river.get("current_gauge_level", 286.0),
            "soil_moisture": weather.get("soil_moisture", 50.0),
            "elevation": elev.get("elevation", 250.0),
            "historical_flood": historical_flood
        }

        # 3. ML Inference
        prediction = ml_service.predict(features)
        risk_level = prediction["risk_level"]

        # 4. Action & Safety guidance
        actions = RiskService._generate_recommended_actions(risk_level, features, river)

        # 5. Nearby Safe Zones
        safe_zones = SafeZoneService.get_nearby_safe_zones(
            user_lat=latitude,
            user_lng=longitude,
            user_risk_level=risk_level
        )

        return {
            "location": {
                "name": location_name,
                "latitude": latitude,
                "longitude": longitude
            },
            "risk_assessment": prediction,
            "environmental_data": {
                "weather": weather,
                "river": river,
                "elevation": elev
            },
            "features_used": features,
            "recommended_actions": actions,
            "nearby_safe_zones": safe_zones[:4]
        }

    @staticmethod
    def _generate_recommended_actions(risk_level: str, features: Dict[str, Any], river: Dict[str, Any]) -> Dict[str, Any]:
        if risk_level == "CRITICAL":
            return {
                "urgency": "IMMEDIATE EVACUATION RECOMMENDED",
                "badge_color": "red",
                "citizen_steps": [
                    "Evacuate immediately to verified designated high-ground safe zones.",
                    "Switch off main electrical breakers and gas cylinders before departure.",
                    "Do not drive or walk through moving water; 15cm of flowing water can knock you down.",
                    "Carry emergency grab-bag: identification, essential medications, flashlights, power bank, and 72h rations."
                ],
                "farmer_steps": [
                    "Immediately unchain livestock and herd them to designated upper contour relief camps.",
                    "Disconnect electric submersible irrigation pump motors and secure equipment onto high platforms.",
                    "Close drainage bund sluices to prevent reverse river inundation into crop paddies."
                ],
                "emergency_contacts": [
                    {"label": "National Disaster Response Force (NDRF)", "number": "1078"},
                    {"label": "State Emergency Operations Center (SEOC)", "number": "1070"},
                    {"label": "District Flood Control Room", "number": "01334-226601"}
                ]
            }
        elif risk_level == "HIGH":
            return {
                "urgency": "HIGH ALERT & PREPAREDNESS",
                "badge_color": "orange",
                "citizen_steps": [
                    "Pack emergency essential bags and identify primary & alternate evacuation routes.",
                    "Move valuable electronics and important documents to upper building floors.",
                    "Keep mobile phones and emergency power banks fully charged.",
                    "Avoid traveling near riverbanks, culverts, and low-lying underpasses."
                ],
                "farmer_steps": [
                    "Inspect and reinforce earthen field embankments.",
                    "Ensure dry fodder stocks are stored on elevated racks protected from ground moisture.",
                    "Keep emergency transport/tractors fueled and ready on higher ground."
                ],
                "emergency_contacts": [
                    {"label": "Disaster Helpline", "number": "1077"},
                    {"label": "Fire & Rescue Services", "number": "101"}
                ]
            }
        elif risk_level == "MEDIUM":
            return {
                "urgency": "CAUTION & MONITORING",
                "badge_color": "yellow",
                "citizen_steps": [
                    "Monitor continuous weather updates and local administration bulletins.",
                    "Clear street drains and inspect home drainage for blockages.",
                    "Verify location of nearest designated community shelter."
                ],
                "farmer_steps": [
                    "Ensure adequate drainage furrows in standing crops to prevent waterlogging.",
                    "Inspect grain storage godowns for roof leaks or moisture ingress."
                ],
                "emergency_contacts": [
                    {"label": "Local Civic Helpline", "number": "1916"}
                ]
            }
        else:
            return {
                "urgency": "NORMAL CONDITIONS",
                "badge_color": "green",
                "citizen_steps": [
                    "Conditions are currently safe. Maintain standard seasonal awareness.",
                    "Store adequate clean drinking water and inspect household drainage."
                ],
                "farmer_steps": [
                    "Routine farm operations; maintain standard bund drainage upkeep."
                ],
                "emergency_contacts": [
                    {"label": "General Citizen Helpline", "number": "112"}
                ]
            }
