# FloodShield AI - Machine Learning Pipeline Documentation

## Model Overview
- **Model Architecture:** `RandomForestClassifier` (Scikit-Learn)
- **Estimators:** 150 Decision Trees
- **Class Balancing:** Balanced class weighting to handle rare extreme disaster occurrences
- **Target Variable:** `flood` (0 = Normal, 1 = Inundation Breach)

## Feature Vector Specification
The model consumes 7 physical telemetry and geographical inputs:

| Feature Name | Type | Unit | Range | Danger Mark / Benchmark | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `rainfall` | Float | mm | 0.0 – 500.0 | > 100.0 mm | Accumulated precipitation volume over past 24–72 hours |
| `river_level` | Float | m | 150.0 – 400.0 | 294.0 m (Haridwar) | River gauge stage relative to datum |
| `elevation` | Float | m | 0.0 – 2500.0 | < 100.0 m | Surface topography elevation above sea level |
| `soil_moisture`| Float | % | 0.0 – 100.0 | > 75.0% | Volumetric moisture ratio (0–7cm layer) |
| `humidity` | Float | % | 10.0 – 100.0 | > 85.0% | Relative atmospheric humidity |
| `temperature` | Float | °C | 5.0 – 50.0 | N/A | Ambient surface air temperature |
| `historical_flood` | Int | Flag | 0 or 1 | 1 | Known historical floodplain / basin flood record |

## Feature Importance Distribution
Calculated from Gini impurity reduction over 150 trees:
1. **Rainfall:** 31.3%
2. **River Level:** 28.1%
3. **Elevation:** 16.1%
4. **Soil Moisture:** 11.3%
5. **Humidity:** 6.4%
6. **Temperature:** 5.7%
7. **Historical Inundation:** 1.1%

## Model Performance & Evaluation
- **Evaluation Accuracy:** **95.8%**
- **ROC AUC Score:** **0.9925**
- **Precision (Flood Class):** 0.87
- **Recall (Flood Class):** 0.95
- **F1-Score:** 0.91

## Risk Classification Thresholds
Stored centrally in `ML/feature_config.json`:
- **0% – 30%:** `LOW` (Code: Green, Label: Low Risk)
- **30% – 60%:** `MEDIUM` (Code: Yellow, Label: Medium Risk Advisory)
- **60% – 80%:** `HIGH` (Code: Orange, Label: High Risk Warning)
- **80% – 100%:** `CRITICAL` (Code: Red, Label: Critical Inundation Breach)
