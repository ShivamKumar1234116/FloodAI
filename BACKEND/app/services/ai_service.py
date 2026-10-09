"""
FloodShield AI - Emergency AI Assistant Service
Provides contextualized flood guidance using Groq API (Llama-3) with fallback to rule-based system.
"""
import os
from groq import Groq
from typing import Dict, Any

# Fallback Knowledge Base
KNOWLEDGE_BASE = {
    "evacuation": (
        "🚨 **Emergency Evacuation Steps**:\n"
        "1. Prioritize immediate life safety: grab your emergency kit (documents, medications, flashlight, power bank).\n"
        "2. Disconnect electricity and gas mains before leaving.\n"
        "3. Follow verified high-ground evacuation routes highlighted in the FloodShield Map.\n"
        "4. **Never walk or drive through floodwaters**: 15 cm of moving water can sweep an adult, 30 cm can float a small car.\n"
        "5. Head to your nearest verified safe zone."
    ),
    "farmer": (
        "🌾 **Farmer & Rural Flood Preparedness**:\n"
        "1. **Livestock**: Untie all cattle and move them to designated high-ground mounds or community shelters immediately.\n"
        "2. **Pumps & Motors**: Unmount electric submersible pumps and raise equipment onto elevated masonry platforms.\n"
        "3. **Fodder**: Move dry fodder and bagged fertilizers off the ground onto overhead lofts.\n"
        "4. **Field Drainage**: Open perimeter ditches to relieve standing ponding."
    ),
    "drinking water": (
        "💧 **Drinking Water & Sanitation Protocol**:\n"
        "1. Municipal tap water and shallow borewells are heavily prone to contamination during flood surges.\n"
        "2. Boil water vigorously for at least 1-2 minutes before consumption.\n"
        "3. Alternatively, use chlorine water purification tablets (1 tablet per 20 liters).\n"
        "4. Avoid consuming food that has come into contact with floodwaters."
    ),
    "haridwar": (
        "📍 **Haridwar Flood Vulnerability Profile**:\n"
        "- The designated Danger Level at Haridwar (Bhimgoda Barrage) is **294.00 meters**.\n"
        "- Low-lying riverside localities: Kangra Mandir Ghat, Chandighat, and Bhopatwala riverfront.\n"
        "- Primary high-elevation refuge: Bhopatwala Elevated Relief Camp (Elevation 315m)."
    ),
    "kit": (
        "🎒 **72-Hour Flood Grab-Bag Essentials**:\n"
        "- 3 liters of potable water per person per day\n"
        "- Non-perishable energy foods (dry fruits, roasted grams, energy bars)\n"
        "- Waterproof pouch with Aadhaar, property papers, insurance, bank passbooks\n"
        "- First-aid kit with antiseptic, ORS sachets, personal prescription medicines\n"
        "- Heavy-duty LED torch, spare batteries, whistle, waterproof matches, and power bank."
    )
}

class AIService:
    @staticmethod
    def answer_query(
        user_message: str,
        current_location: str = "Haridwar",
        risk_level: str = "UNKNOWN",
        features: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        features = features or {}
        msg = user_message.lower().strip()
        
        API_KEY = os.getenv("GROQ_API_KEY", "")
        
        if API_KEY:
            try:
                client = Groq(api_key=API_KEY)
                system_instruction = (
                    f"You are FloodShield AI, a highly professional and empathetic disaster management assistant. "
                    f"User Location: {current_location}. Flood Risk Level: {risk_level}. Environment: {features}. "
                    f"CRITICAL RULES: "
                    f"1. ALWAYS begin your response with a warm, polite welcome message, for example: 'Welcome to FloodShield AI! I am here to help you.' "
                    f"2. Only answer questions related to floods, weather, evacuation, disaster preparedness, and safety. "
                    f"3. Format your response beautifully using clean, short paragraphs and bullet points for readability. "
                    f"4. Never hallucinate emergency contact numbers."
                )
                
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": user_message}
                    ],
                    model="qwen/qwen3.8-27b",
                    temperature=0.3,
                )
                
                return {
                    "reply": chat_completion.choices[0].message.content,
                    "disclaimer": "AI guidance is for informational preparedness. Always follow official NDMA instructions.",
                    "source": "Groq Qwen-3.8-27B (Real-Time)"
                }
            except Exception as e:
                # Catch ALL Groq API errors and display them so the user knows what's wrong
                error_str = str(e).lower()
                if "api_key" in error_str or "authentication" in error_str or "401" in error_str:
                    return {
                        "reply": f"⚠️ **Real-Time API Error:** Aapki Groq API Key invalid hai.\n\nPlease check if your GROQ_API_KEY in `.env` is correct. Restart the backend server after changing the key.",
                        "disclaimer": "Configuration Error",
                        "source": "System"
                    }
                elif "400" in error_str or "decommissioned" in error_str or "invalid" in error_str:
                    return {
                        "reply": f"⚠️ **Groq API Error:** {str(e)}\n\nPlease ensure you are using a supported model like `llama-3.1-8b-instant`.",
                        "disclaimer": "API Error",
                        "source": "System"
                    }
                else:
                    print(f"Groq Error: {e}")

        # Fast Offline Rule-based System (Fallback)
        if any(w in msg for w in ["evacuat", "leave", "escape", "run", "where to go"]):
            response_text = KNOWLEDGE_BASE["evacuation"]
        elif any(w in msg for w in ["farm", "crop", "cattle", "cow", "animal", "livestock", "field"]):
            response_text = KNOWLEDGE_BASE["farmer"]
        elif any(w in msg for w in ["water", "drink", "boil", "contaminat", "clean"]):
            response_text = KNOWLEDGE_BASE["drinking water"]
        elif any(w in msg for w in ["kit", "bag", "pack", "prepare", "supplies", "torch"]):
            response_text = KNOWLEDGE_BASE["kit"]
        elif "haridwar" in msg:
            response_text = KNOWLEDGE_BASE["haridwar"]
        elif any(w in msg for w in ["risk", "level", "probability", "why", "model", "danger"]):
            rain = features.get("rainfall", 45)
            response_text = (f"📊 **FloodShield Risk Diagnostic for {current_location}**:\n"
                             f"- Assessed Risk Level: **{risk_level}**\n- 24h Rainfall: {rain:.1f} mm\n"
                             f"Take necessary precautions immediately.")
        else:
            response_text = (
                f"Hello! I am **FloodShield AI Assistant**.\n\n"
                f"⚠️ *Note: Real-time generative mode is currently OFF because a valid GROQ_API_KEY was not found.* \n\n"
                f"For your current monitored area (**{current_location}**, Status: **{risk_level}**), you can ask me about:\n"
                f"1. **Evacuation Routes & Procedures**\n"
                f"2. **Farmer & Livestock Protection Protocols**\n"
                f"3. **Safe Drinking Water & Sanitation**\n"
                f"4. **Emergency 72-Hour Grab-Bag Checklist**\n"
            )

        return {
            "reply": response_text,
            "disclaimer": "Offline rule-based guidance. Follow official NDMA instructions.",
            "source": "FloodShield Offline Knowledge Base"
        }

