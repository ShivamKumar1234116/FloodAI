"""
FloodShield AI - Machine Learning Inference Service
Loads RandomForestClassifier model and performs inference.
Estimates flood probability and converts it into risk classifications.
"""
import os
import sys
from typing import Dict, Any, Tuple

# Ensure ML package is accessible
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", ".."))
ML_DIR = os.path.join(PROJECT_ROOT, "ML")
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

# pyrefly: ignore [missing-import]
from preprocess import validate_and_normalize_features, explain_risk_factors
# pyrefly: ignore [missing-import]
from model_utils import load_flood_model, classify_risk, load_config
import numpy as np

class MLService:
    def __init__(self):
        self.model = None
        self.config = load_config()
        self._load_model()

    def _load_model(self):
        try:
            model_path = os.path.join(ML_DIR, "flood_model.pkl")
            if os.path.exists(model_path):
                self.model = load_flood_model(model_path)
                print(f"[MLService] Loaded trained model from {model_path}")
            else:
                print(f"[MLService] Warning: model not found at {model_path}")
        except Exception as e:
            print(f"[MLService] Error loading model: {e}")

    def predict(self, raw_features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs model prediction on environmental features.
        Returns:
            probability, risk_level, label, color, code, factors, clean_features
        """
        if self.model is None:
            self._load_model()

        feature_vector, clean_features = validate_and_normalize_features(raw_features)

        if self.model is not None:
            try:
                import pandas as pd
                df_input = pd.DataFrame([clean_features])[["rainfall", "temperature", "humidity", "river_level", "soil_moisture", "elevation", "historical_flood"]]
                proba = float(self.model.predict_proba(df_input)[0][1])
            except Exception as e:
                print(f"[MLService] Prediction execution failed ({e}), using analytical estimation.")
                proba = self._fallback_analytical_probability(clean_features)
        else:
            proba = self._fallback_analytical_probability(clean_features)

        proba = round(max(0.01, min(0.99, proba)), 4)
        risk_level, label, color, code = classify_risk(proba)
        factors = explain_risk_factors(clean_features, proba)

        return {
            "flood_probability": proba,
            "risk_percentage": round(proba * 100, 1),
            "risk_level": risk_level,
            "label": label,
            "color": color,
            "code": code,
            "features_used": clean_features,
            "contributing_factors": factors,
            "model_version": "RandomForest-v1.0",
            "disclaimer": "This is an estimated/model-based risk indicator and does not replace official emergency service directives."
        }

    def _fallback_analytical_probability(self, c: Dict[str, Any]) -> float:
        rain = c.get("rainfall", 20.0)
        river = c.get("river_level", 286.0)
        soil = c.get("soil_moisture", 45.0)
        elev = c.get("elevation", 250.0)
        hist = c.get("historical_flood", 0)

        score = (
            min(1.0, rain / 160.0) * 0.35 +
            max(0.0, min(1.0, (river - 290.0) / 6.0)) * 0.30 +
            min(1.0, soil / 90.0) * 0.15 +
            max(0.0, min(1.0, (350 - elev) / 250.0)) * 0.10 +
            (hist * 0.10)
        )
        return float(np.clip(score, 0.05, 0.95))

ml_service = MLService()
