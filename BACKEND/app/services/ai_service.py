"""
FloodShield AI - Emergency AI Assistant Service
Provides contextualized flood guidance, safety checklists, evacuation instructions,
and explanation of environmental risk factors for citizens and farmers.
"""
from typing import Dict, Any, List

KNOWLEDGE_BASE = {
    "evacuation": (
        "🚨 **Emergency Evacuation Steps**:\n"
        "1. Prioritize immediate life safety: grab your emergency kit (documents, medications, flashlight, power bank).\n"
        "2. Disconnect electricity and gas mains before leaving.\n"
        "3. Follow verified high-ground evacuation routes highlighted in the FloodShield Map.\n"
        "4. **Never walk or drive through floodwaters**: 15 cm of moving water can sweep an adult, 30 cm can float a small car.\n"
        "5. Head to your nearest verified safe zone (e.g. Haridwar Bhopatwala Relief Shelter)."
    ),
    "farmer": (
        "🌾 **Farmer & Rural Flood Preparedness**:\n"
        "1. **Livestock**: Untie all cattle and move them to designated high-ground mounds or community shelters immediately.\n"
        "2. **Pumps & Motors**: Unmount electric submersible pumps and raise equipment onto elevated masonry platforms.\n"
        "3. **Fodder**: Move dry fodder and bagged fertilizers off the ground onto overhead lofts.\n"
        "4. **Field Drainage**: Open perimeter ditches to relieve standing ponding and prevent root rot in paddy fields."
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
        msg = user_message.lower().strip()
        features = features or {}

        # Context-aware dynamic responses
        response_text = ""

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
            river = features.get("river_level", 292.5)
            soil = features.get("soil_moisture", 65)
            response_text = (
                f"📊 **FloodShield Risk Diagnostic for {current_location}**:\n"
                f"- **Assessed Risk Level**: **{risk_level}**\n"
                f"- **24h Rainfall**: {rain:.1f} mm\n"
                f"- **River Gauge Stage**: {river:.2f} m (Danger Mark: 294.0 m)\n"
                f"- **Soil Saturation**: {soil:.1f}%\n\n"
                f"Our RandomForest AI model analyzes these hydrological telemetry parameters against historical inundation records. "
                f"When soil moisture exceeds 75% and rainfall crosses 80mm, soil absorption plummets, causing immediate dangerous surface runoff."
            )
        else:
            response_text = (
                f"Hello! I am **FloodShield AI Assistant**, trained to support disaster preparedness and localized flood response.\n\n"
                f"For your current monitored area (**{current_location}**, Status: **{risk_level}**), you can ask me about:\n"
                f"1. **Evacuation Routes & Procedures**\n"
                f"2. **Farmer & Livestock Protection Protocols**\n"
                f"3. **Safe Drinking Water & Sanitation**\n"
                f"4. **Emergency 72-Hour Grab-Bag Checklist**\n"
                f"5. **Detailed Explanation of Current Risk Factors**\n\n"
                f"How can I assist your safety right now?"
            )

        return {
            "reply": response_text,
            "disclaimer": "AI guidance is for informational preparedness. Always follow official National Disaster Management Authority (NDMA) & Police instructions in active emergencies.",
            "source": "FloodShield AI Disaster Knowledge Model"
        }
