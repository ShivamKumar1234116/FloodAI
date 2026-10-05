# FloodShield AI - Complete Citizen & User Flow

## Citizen Journey
```
[User Arrives at Platform]
         │
         ▼
[Selects / Searches Location, e.g. "Haridwar"]
         │
         ▼
[Geocoded to Coordinates: 29.9457° N, 78.1642° E]
         │
         ▼
[FastAPI Telemetry Aggregator queries:]
  • Open-Meteo Meteorology (Rainfall, Temp, Humidity, Soil Moisture)
  • CWC Hydrological Basin Gauges (Bhimgoda Barrage Level)
  • SRTM Digital Elevation (314m)
         │
         ▼
[Validation & Normalization Layer (preprocess.py)]
         │
         ▼
[RandomForestClassifier Inference Engine]
         │
         ▼
[Flood Probability (e.g. 0.82) → Risk Category (CRITICAL)]
         │
         ▼
[Citizen Dashboard Displays:]
  1. Risk Probability Gauge with category color theme
  2. 6 Environmental Telemetry Cards with "LIVE" badges and timestamps
  3. Explainable Risk Factors (heavy rain + overbank gauge + saturated soil)
  4. Interactive Leaflet Map with user marker & colored risk circle
  5. Top Recommended Verified Safe Zones (ranked by proximity & available capacity)
  6. Citizen & Farmer Action Checklists + Immediate Helpline Numbers
         │
         ▼
[User Clicks "Get Directions"] ──► Opens Navigation Route to nearest elevated relief camp
         │
         ▼
[User Clicks "Ask AI Assistant"] ──► Interactive emergency assistance for grab-bags, drinking water, and farm cattle safety
```
