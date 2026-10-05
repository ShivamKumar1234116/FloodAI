"""
FloodShield AI - Model Utilities
Handles model persistence, probability calculation, and threshold classification.
"""
import os
import json
import joblib
from typing import Dict, Any, Tuple

DEFAULT_MODEL_PATH = os.path.join(os.path.dirname(__file__), "flood_model.pkl")
DEFAULT_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "feature_config.json")

def load_config(config_path: str = DEFAULT_CONFIG_PATH) -> Dict[str, Any]:
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "thresholds": {
            "LOW": {"min": 0.0, "max": 0.30, "label": "Low Risk", "color": "#10B981", "code": "GREEN"},
            "MEDIUM": {"min": 0.30, "max": 0.60, "label": "Medium Risk", "color": "#F59E0B", "code": "YELLOW"},
            "HIGH": {"min": 0.60, "max": 0.80, "label": "High Risk", "color": "#F97316", "code": "ORANGE"},
            "CRITICAL": {"min": 0.80, "max": 1.00, "label": "Critical Risk", "color": "#EF4444", "code": "RED"}
        }
    }

def classify_risk(probability: float, thresholds: Dict[str, Any] = None) -> Tuple[str, str, str, str]:
    """
    Returns (risk_level, label, color, code)
    0–30% LOW, 30–60% MEDIUM, 60–80% HIGH, 80–100% CRITICAL
    """
    p = max(0.0, min(1.0, float(probability)))
    if p < 0.30:
        return "LOW", "Low Risk", "#10B981", "GREEN"
    elif p < 0.60:
        return "MEDIUM", "Medium Risk", "#F59E0B", "YELLOW"
    elif p < 0.80:
        return "HIGH", "High Risk", "#F97316", "ORANGE"
    else:
        return "CRITICAL", "Critical Risk", "#EF4444", "RED"

def load_flood_model(model_path: str = DEFAULT_MODEL_PATH):
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}. Please run train.py first.")
    return joblib.load(model_path)
