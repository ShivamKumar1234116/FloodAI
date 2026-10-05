"""
FloodShield AI - Chatbot & AI Assistant Route
Responds to citizen questions regarding flood risk, evacuation, and safety protocols.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import AIService

router = APIRouter(prefix="/chatbot", tags=["AI Assistant"])

class ChatRequest(BaseModel):
    message: str
    location: Optional[str] = "Haridwar"
    risk_level: Optional[str] = "UNKNOWN"
    features: Optional[Dict[str, Any]] = None

@router.post("")
def chat_with_assistant(req: ChatRequest):
    return AIService.answer_query(
        user_message=req.message,
        current_location=req.location,
        risk_level=req.risk_level,
        features=req.features
    )
