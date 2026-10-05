"""
FloodShield AI - Data Preprocessing & Validation Layer
Handles validation, normalization, missing values, and feature engineering.
"""
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd

FEATURE_COLUMNS = [
    "rainfall",
    "temperature",
    "humidity",
    "river_level",
    "soil_moisture",
    "elevation",
    "historical_flood"
]

FEATURE_DEFAULTS = {
    "rainfall": 15.0,
    "temperature": 27.0,
    "humidity": 65.0,
    "river_level": 286.0,
    "soil_moisture": 45.0,
    "elevation": 250.0,
    "historical_flood": 0
}

FEATURE_LIMITS = {
    "rainfall": (0.0, 600.0),
    "temperature": (-10.0, 60.0),
    "humidity": (0.0, 100.0),
    "river_level": (150.0, 400.0),
    "soil_moisture": (0.0, 100.0),
    "elevation": (0.0, 5000.0),
    "historical_flood": (0, 1)
}

def validate_and_normalize_features(raw_features: Dict[str, Any]) -> Tuple[List[float], Dict[str, Any]]:
    """
    Validates, clamps within reasonable bounds, and applies defaults for missing fields.
    Returns:
        (feature_vector, clean_dict)
    """
    clean: Dict[str, Any] = {}
    vector: List[float] = []

    for feat in FEATURE_COLUMNS:
        val = raw_features.get(feat)
        if val is None or val == "":
            val = FEATURE_DEFAULTS[feat]
        else:
            try:
                val = float(val)
            except (ValueError, TypeError):
                val = FEATURE_DEFAULTS[feat]

        min_val, max_val = FEATURE_LIMITS[feat]
        val = max(min_val, min(max_val, val))
        if feat == "historical_flood":
            val = int(round(val))
        clean[feat] = val
        vector.append(val)

    return vector, clean

def explain_risk_factors(clean: Dict[str, Any], flood_prob: float) -> List[Dict[str, Any]]:
    """
    Generate explainable AI risk factors with scientific explanations.
    """
    factors = []

    # 1. Rainfall
    rain = clean.get("rainfall", 0)
    if rain >= 120:
        factors.append({
            "factor": "Extreme Precipitation",
            "impact": "CRITICAL",
            "weight": 0.35,
            "observation": f"{rain:.1f} mm rainfall recorded; severe catchment runoff underway.",
            "suggestion": "Immediate evacuation from low-lying areas."
        })
    elif rain >= 65:
        factors.append({
            "factor": "Heavy Rainfall",
            "impact": "HIGH",
            "weight": 0.25,
            "observation": f"{rain:.1f} mm rainfall; water tables rising rapidly.",
            "suggestion": "Monitor drainage systems and local nullahs."
        })
    elif rain >= 25:
        factors.append({
            "factor": "Moderate Rainfall",
            "impact": "MODERATE",
            "weight": 0.12,
            "observation": f"{rain:.1f} mm rainfall recorded over the past 24-48 hours.",
            "suggestion": "Normal caution advised."
        })
    else:
        factors.append({
            "factor": "Precipitation",
            "impact": "LOW",
            "weight": 0.05,
            "observation": f"Minimal rainfall ({rain:.1f} mm).",
            "suggestion": "No immediate precipitation threat."
        })

    # 2. River Level
    river = clean.get("river_level", 285)
    if river >= 294.0:
        factors.append({
            "factor": "River Overbank Breach Warning",
            "impact": "CRITICAL",
            "weight": 0.35,
            "observation": f"River gauge at {river:.2f} m has crossed the designated Danger Level (294.0 m).",
            "suggestion": "Move to higher ground immediately; do not attempt crossing bridges or embankments."
        })
    elif river >= 292.0:
        factors.append({
            "factor": "River Level Warning Stage",
            "impact": "HIGH",
            "weight": 0.25,
            "observation": f"River gauge at {river:.2f} m is approaching critical warning stage.",
            "suggestion": "Secure livestock and prepare emergency kits."
        })
    else:
        factors.append({
            "factor": "River Stage",
            "impact": "NORMAL",
            "weight": 0.10,
            "observation": f"River level is at {river:.2f} m, safely below danger threshold.",
            "suggestion": "Streamflow within capacity."
        })

    # 3. Soil Moisture
    soil = clean.get("soil_moisture", 40)
    if soil >= 78:
        factors.append({
            "factor": "Soil Saturation",
            "impact": "HIGH",
            "weight": 0.20,
            "observation": f"Soil saturation at {soil:.1f}% indicates near zero infiltration capacity; all rainfall will convert to surface runoff.",
            "suggestion": "Risk of flash flooding and waterlogging."
        })
    elif soil >= 55:
        factors.append({
            "factor": "Soil Moisture",
            "impact": "MODERATE",
            "weight": 0.10,
            "observation": f"Soil moisture at {soil:.1f}%. Ground retains partial absorption capability.",
            "suggestion": "Watch field accumulation."
        })

    # 4. Elevation
    elevation = clean.get("elevation", 250)
    if elevation < 150:
        factors.append({
            "factor": "Topographical Vulnerability",
            "impact": "HIGH",
            "weight": 0.15,
            "observation": f"Low elevation ({elevation:.0f} m) places location inside natural river basin depression.",
            "suggestion": "Identify nearest high-ground shelters."
        })
    elif elevation > 400:
        factors.append({
            "factor": "Topographical Buffer",
            "impact": "BENEFICIAL",
            "weight": -0.15,
            "observation": f"Elevated terrain ({elevation:.0f} m) naturally resists river backwater accumulation.",
            "suggestion": "Stay on upper contours."
        })

    # 5. Historical Flood
    hist = clean.get("historical_flood", 0)
    if hist == 1:
        factors.append({
            "factor": "Historical Flood Zone",
            "impact": "HIGH",
            "weight": 0.15,
            "observation": "Location recorded major flood inundations in historical flood atlases.",
            "suggestion": "Follow historical evacuation corridors."
        })

    return factors
