"""
FloodShield AI - ML Model Training Pipeline
Trains a RandomForestClassifier using environmental & hydrological features.
Saves model to flood_model.pkl and exports evaluation metrics.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "datasets", "flood_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "flood_model.pkl")
CONFIG_PATH = os.path.join(BASE_DIR, "feature_config.json")

def train():
    print(f"Loading dataset from: {DATA_PATH}")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}. Run generate_dataset.py first.")

    data = pd.read_csv(DATA_PATH)
    print(f"Dataset shape: {data.shape}")
    print("Class distribution:\n", data["flood"].value_counts())

    features = [
        "rainfall",
        "temperature",
        "humidity",
        "river_level",
        "soil_moisture",
        "elevation",
        "historical_flood"
    ]

    X = data[features]
    y = data["flood"]

    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training samples: {len(X_train)}, Testing samples: {len(X_test)}")

    # Model definition with balanced class weights
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    print("Training RandomForestClassifier...")
    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)

    print("\n" + "=" * 50)
    print("MODEL EVALUATION RESULTS")
    print("=" * 50)
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print(f"ROC AUC:   {auc:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # Feature Importance
    importances = model.feature_importances_
    print("Feature Importances:")
    for feat, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True):
        print(f"  - {feat:18s}: {imp:.4f}")

    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved successfully to: {MODEL_PATH}")

    return model, {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "roc_auc": auc
    }

if __name__ == "__main__":
    train()