"""
FloodShield AI - User Profile & Saved Preferences Route
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.routes.auth import get_current_user
from app.database.mongodb import db_manager

router = APIRouter(prefix="/user", tags=["User"])

class SaveLocationRequest(BaseModel):
    name: str
    latitude: float
    longitude: float

@router.get("/profile")
def get_user_profile(user: dict = Depends(get_current_user)):
    return {
        "id": user.get("_id"),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role", "USER"),
        "saved_locations": user.get("saved_locations", [
            {"name": "Haridwar Home Basin", "latitude": 29.9457, "longitude": 78.1642}
        ])
    }

@router.post("/saved-locations")
def add_saved_location(req: SaveLocationRequest, user: dict = Depends(get_current_user)):
    users = db_manager.get_collection("users")
    saved = user.get("saved_locations", [])
    saved.append({"name": req.name, "latitude": req.latitude, "longitude": req.longitude})
    users.update_one({"_id": user["_id"]}, {"$set": {"saved_locations": saved}})
    return {"message": "Location saved successfully", "saved_locations": saved}
