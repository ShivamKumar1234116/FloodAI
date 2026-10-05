"""
FloodShield AI - Alert Management Service
Handles alerts originating from:
1. AI/Model Predictions (AI_PREDICTION)
2. Official Authority Information (OFFICIAL)
3. Admin Operational Messages (ADMIN_OPERATIONAL)
"""
import uuid
import datetime
from typing import List, Dict, Any, Optional
from app.database.mongodb import db_manager

class AlertService:
    @staticmethod
    def get_all_alerts(active_only: bool = True) -> List[Dict[str, Any]]:
        collection = db_manager.get_collection("alerts")
        query = {"active": True} if active_only else {}
        alerts = collection.find(query)
        # Sort latest first
        alerts.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return alerts

    @staticmethod
    def create_alert(alert_data: Dict[str, Any]) -> Dict[str, Any]:
        collection = db_manager.get_collection("alerts")
        alert = {
            "_id": f"alert-{uuid.uuid4().hex[:8]}",
            "title": alert_data.get("title", "Flood Advisory"),
            "source": alert_data.get("source", "Official Authority"),
            "type": alert_data.get("type", "OFFICIAL"),
            "severity": alert_data.get("severity", "MEDIUM"),
            "location": alert_data.get("location", "Monitored Region"),
            "message": alert_data.get("message", ""),
            "active": alert_data.get("active", True),
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "created_by": alert_data.get("created_by", "Admin")
        }
        collection.insert_one(alert)
        return alert

    @staticmethod
    def update_alert(alert_id: str, updates: Dict[str, Any]) -> bool:
        collection = db_manager.get_collection("alerts")
        return collection.update_one({"_id": alert_id}, {"$set": updates})

    @staticmethod
    def toggle_alert_status(alert_id: str, active: bool) -> bool:
        collection = db_manager.get_collection("alerts")
        return collection.update_one({"_id": alert_id}, {"$set": {"active": active}})

    @staticmethod
    def delete_alert(alert_id: str) -> bool:
        collection = db_manager.get_collection("alerts")
        return collection.delete_one({"_id": alert_id})
