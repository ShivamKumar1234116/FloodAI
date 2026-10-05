# FloodShield AI - System Architecture

## Overview
FloodShield AI is a full-stack AI/ML disaster decision-support platform designed to estimate localized flood risks, visualize hazardous perimeters on interactive geospatial maps, and recommend verified, suitable safe zones.

```
                              ┌────────────────────────────────────────┐
                              │           React Frontend (Vite)        │
                              │ Tailwind CSS • Leaflet • Recharts     │
                              └───────────────────┬────────────────────┘
                                                  │ HTTP / REST
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │             FastAPI Backend            │
                              │           Port 8000 (Python)           │
                              └───────────┬──────────────┬─────────────┘
                                          │              │
                    ┌─────────────────────┴───────┐      └──────────────────────────┐
                    ▼                             ▼                                 ▼
      ┌───────────────────────────┐ ┌───────────────────────────┐     ┌───────────────────────────┐
      │   External Telemetry APIs │ │   ML Inference Engine     │     │      Database Layer       │
      │ • Open-Meteo Meteorology  │ │ • RandomForestClassifier  │     │ • MongoDB / Safe Fallback │
      │ • CWC River Gauges        │ │ • 7 Hydrological Features │     │ • Users & Predictions     │
      │ • SRTM Digital Elevation  │ │ • Explainable AI Weights  │     │ • Verified Safe Zones     │
      └───────────────────────────┘ └───────────────────────────┘     └───────────────────────────┘
```

## Core Principles
1. **Separation of Scientific Concerns**:
   - The **ML Model** computes localized flood probability $P \in [0.0, 1.0]$.
   - The **Risk Engine** maps probabilities to operational threshold tiers (Low, Medium, High, Critical).
   - The **Safe-Zone Engine** searches official registries and ranks shelters based on Haversine distance, shelter capacity, and elevation. The ML model *never* fabricates safe zones.
2. **Data Freshness and Integrity**:
   - Live telemetry retains timestamps and source attribution.
   - Offline or delayed data is explicitly labeled `CACHED` or `OFFLINE` rather than presented as live.

## Component Modules
- **`app/services/geocoding_service.py`**: Nominatim OpenStreetMap geocoding with preset flood hubs.
- **`app/services/weather_service.py`**: Hourly precipitation accumulation, temperature, humidity, and soil saturation (0-7cm).
- **`app/services/river_service.py`**: River gauge stages, discharge volume (cusecs / m³/s), and danger mark breaches.
- **`app/services/elevation_service.py`**: Topographical elevation via SRTM.
- **`app/services/ml_service.py`**: RandomForest inference loaded from `ML/flood_model.pkl`.
- **`app/services/risk_service.py`**: Aggregates environmental features and generates actionable citizen/farmer checklists.
- **`app/services/safe_zone_service.py`**: Spatial distance ranking, route waypoint generation, and capacity checks.
- **`app/services/alert_service.py`**: Lifecycle management of public alerts.
- **`app/services/ai_service.py`**: Context-aware natural language emergency assistant.
