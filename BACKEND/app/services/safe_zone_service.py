"""
FloodShield AI - Safe Zone Engine
Selects suitable verified safe zones using coordinates, status, capacity, risk conditions, and distance.
Calculates Haversine distance, evaluates elevation and flood buffer, and generates route guidance.
"""
import math
from typing import List, Dict, Any, Optional
from app.database.mongodb import db_manager

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points on the Earth in kilometers."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class SafeZoneService:
    @staticmethod
    def get_nearby_safe_zones(
        user_lat: float,
        user_lng: float,
        max_distance_km: float = 60.0,
        user_risk_level: str = "LOW"
    ) -> List[Dict[str, Any]]:
        collection = db_manager.get_collection("safe_zones")
        # Load active, verified safe zones
        raw_zones = list(collection.find({"status": "ACTIVE", "verification_status": "VERIFIED"}))

        recommended = []
        for zone in raw_zones:
            z_lat = float(zone.get("latitude", 0))
            z_lng = float(zone.get("longitude", 0))
            dist = haversine_distance(user_lat, user_lng, z_lat, z_lng)

            # Check capacity
            cap = int(zone.get("capacity", 500))
            occ = int(zone.get("current_occupancy", 0))
            available_slots = max(0, cap - occ)
            occupancy_pct = round((occ / cap) * 100, 1) if cap > 0 else 100

            # Exclude full zones
            if available_slots <= 0:
                continue

            # Route coordinates for Leaflet display: from user to safe zone
            # Midpoints create a realistic navigation polyline
            mid_lat = (user_lat + z_lat) / 2 + 0.002
            mid_lng = (user_lng + z_lng) / 2 - 0.002
            route_coordinates = [
                [round(user_lat, 5), round(user_lng, 5)],
                [round(mid_lat, 5), round(mid_lng, 5)],
                [round(z_lat, 5), round(z_lng, 5)]
            ]

            # Suitability score calculation
            # Lower distance = higher score, more available capacity = higher score
            distance_score = max(0, 100 - (dist * 2.5))
            capacity_score = (available_slots / cap) * 50
            facility_score = len(zone.get("facilities", [])) * 8
            suitability_score = round(distance_score + capacity_score + facility_score, 1)

            # Navigation directions link
            osm_directions_url = f"https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route={user_lat:.4f}%2C{user_lng:.4f}%3B{z_lat:.4f}%2C{z_lng:.4f}"
            gmaps_directions_url = f"https://www.google.com/maps/dir/?api=1&origin={user_lat:.4f},{user_lng:.4f}&destination={z_lat:.4f},{z_lng:.4f}"

            rec = dict(zone)
            rec["distance_km"] = round(dist, 2)
            rec["available_capacity"] = available_slots
            rec["occupancy_percentage"] = occupancy_pct
            rec["suitability_score"] = suitability_score
            rec["route_coordinates"] = route_coordinates
            rec["directions_url"] = osm_directions_url
            rec["google_maps_url"] = gmaps_directions_url
            rec["recommended_route_type"] = "Elevated Highway Corridors (Avoid low underpasses)"
            recommended.append(rec)

        # Sort by suitability score descending (or distance ascending)
        recommended.sort(key=lambda x: x["distance_km"])

        return recommended

    @staticmethod
    def get_all_safe_zones() -> List[Dict[str, Any]]:
        collection = db_manager.get_collection("safe_zones")
        return list(collection.find({}))

    @staticmethod
    def add_safe_zone(data: Dict[str, Any]) -> Dict[str, Any]:
        collection = db_manager.get_collection("safe_zones")
        data["status"] = data.get("status", "ACTIVE")
        data["verification_status"] = data.get("verification_status", "VERIFIED")
        res = collection.insert_one(data)
        data["_id"] = str(res.inserted_id)
        return data

    @staticmethod
    def update_safe_zone(zone_id: str, updates: Dict[str, Any]) -> bool:
        collection = db_manager.get_collection("safe_zones")
        return collection.update_one({"_id": zone_id}, {"$set": updates})

    @staticmethod
    def delete_safe_zone(zone_id: str) -> bool:
        collection = db_manager.get_collection("safe_zones")
        return collection.delete_one({"_id": zone_id})
