"""
FloodShield AI - ML Model Evaluation Script
"""
import os
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "datasets", "flood_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "flood_model.pkl")

def evaluate():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    model = joblib.load(MODEL_PATH)
    df = pd.read_csv(DATA_PATH)

    features = [
        "rainfall",
        "temperature",
        "humidity",
        "river_level",
        "soil_moisture",
        "elevation",
        "historical_flood"
    ]

    X = df[features]
    y = df["flood"]

    predictions = model.predict(X)
    probabilities = model.predict_proba(X)[:, 1]

    acc = accuracy_score(y, predictions)
    auc = roc_auc_score(y, probabilities)
    cm = confusion_matrix(y, predictions)

    print("=" * 45)
    print("FLOODSHIELD AI MODEL EVALUATION")
    print("=" * 45)
    print(f"Overall Accuracy: {acc:.4f}")
    print(f"ROC AUC Score:    {auc:.4f}")
    print("\nConfusion Matrix:")
    print(cm)
    print("\nDetailed Classification Report:")
    print(classification_report(y, predictions, target_names=["No Flood", "Flood"]))

if __name__ == "__main__":
    evaluate()
