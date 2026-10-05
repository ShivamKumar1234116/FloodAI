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
