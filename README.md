# 🌊 FloodShield AI

**FloodShield AI** is a full-stack AI/ML disaster response and decision-support web platform. It estimates localized flood probabilities using live meteorological telemetry, hydrological river basin gauges, digital elevation models, and historical flood atlas data, visualizes peril perimeters on interactive geospatial maps, and recommends verified high-ground relief safe zones.

---

## 🚀 Live Demo Quickstart

### 1. Backend (FastAPI + Python ML)
```bash
# Navigate to BACKEND directory
cd BACKEND

# Install required dependencies
python -m pip install fastapi uvicorn pydantic python-multipart pyjwt bcrypt pymongo requests httpx scikit-learn pandas numpy joblib

# Start the FastAPI server on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)

### 2. Frontend (React 19 + Vite + Tailwind CSS + Leaflet)
```bash
# In a separate terminal, navigate to FRONTEND directory
cd FRONTEND

# Install npm dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```
Open in browser: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 🔑 Demo Login Credentials

- **Citizen Demo:**
  - Email: `citizen@floodshield.ai`
  - Password: `Citizen@123`
- **Admin Emergency Ops Demo:**
  - Email: `admin@floodshield.ai`
  - Password: `Admin@12345`

*(Quick-fill buttons are provided on both login screens for one-click demo access).*

---

## 🎯 Core Features

1. **Location Geocoding & Search:**
   - Converts regional queries (e.g. *"Haridwar"*, *"Patna"*, *"Guwahati"*, *"Delhi"*) into geographic coordinates using OpenStreetMap Nominatim with cached presets.
2. **Multi-Source Environmental Telemetry:**
   - Live 24-hour rainfall accumulation (mm) via Open-Meteo API.
   - Real-time river gauge levels (m) relative to designated Danger Marks (e.g., Haridwar 294.0m).
   - Volumetric soil moisture saturation (0–7cm layer).
   - Digital elevation models (DEM) via SRTM.
3. **Machine Learning Predictive Core:**
   - Scikit-Learn `RandomForestClassifier` trained on physical hydrological parameters.
   - Evaluated at **95.8% accuracy** and **0.9925 ROC AUC**.
4. **Explainable AI Diagnostics:**
   - Decomposes flood risk into weighted contributing factors (precipitation intensity, overbank river stage, ground saturation, low elevation).
5. **Interactive Geospatial Map (React-Leaflet):**
   - Renders live user location pins, color-coded flood inundation zones (Green, Yellow, Orange, Red), verified safe-zone markers, and polyline evacuation routes.
6. **Verified Safe-Zone Recommendation Engine:**
   - Filters out high-risk zones, calculates Haversine distances, verifies headroom capacity, and generates one-click directions.
7. **Disaster AI Assistant (`/assistant`):**
   - Context-aware chatbot trained on NDMA safety guidelines, grab-bag essentials, and livestock protection.
8. **Admin Operations Command Center (`/admin/dashboard`):**
   - Real-time risk area monitoring, emergency alert broadcasting (Official / AI / Admin), and data source latency heartbeats.

---

## 📁 Repository Structure

```
FloodShield-AI/
├── FRONTEND/                  # React + Vite + Tailwind CSS UI
│   ├── src/
│   │   ├── components/common/ # Navbar, Footer, RiskBadge, AlertBanner
│   │   ├── components/dashboard/ # LocationSearch, RiskGauge, EnvironmentalCards, SafeZoneList
│   │   ├── components/map/    # FloodMap, MapLegend
│   │   ├── pages/             # Home, Dashboard, RiskMapPage, AlertsPage, SafeZonesPage, AssistantPage
│   │   ├── pages/admin/       # AdminLogin, AdminDashboard, AdminAlerts, AdminSafeZones, AdminDataSources
│   │   ├── context/           # AuthContext, FloodContext
│   │   └── services/api.js    # Axios backend integration
│   ├── vite.config.js         # Tailwind v4 plugin + API proxy
│   └── package.json
├── BACKEND/                   # FastAPI Python server
│   ├── app/
│   │   ├── main.py            # FastAPI entrypoint & router mounts
│   │   ├── config.py          # App settings & JWT configuration
│   │   ├── database/          # MongoDB connection with zero-config resilient fallback
│   │   ├── routes/            # auth, prediction, locations, weather, river, safe_zones, alerts, chatbot, admin
│   │   └── services/          # ml_service, weather_service, river_service, geocoding_service, safe_zone_service, etc.
│   └── app/
├── ML/                        # Machine Learning Pipeline
│   ├── datasets/flood_data.csv # Scientifically generated hydrological dataset (2500 samples)
│   ├── flood_model.pkl        # Trained RandomForestClassifier
│   ├── feature_config.json    # Feature specs & risk classification thresholds
│   ├── train.py               # Model training script
│   ├── evaluate.py            # Multi-metric evaluation script
│   ├── preprocess.py          # Validation & explainable AI factors
│   └── model_utils.py         # Model loader & risk classifier
└── docs/                      # Architectural & API Documentation
    ├── architecture.md
    ├── api.md
    ├── ml.md
    ├── user-flow.md
    └── admin-flow.md
```

---

## 🛡️ Hackathon Demo Scenario (Haridwar)

1. Launch Dashboard (`/dashboard`) → System defaults to **Haridwar (Upper Ganga Basin)**.
2. Observe coordinates `29.9457° N, 78.1642° E` retrieved via Geocoding.
3. Live environmental telemetry populates (24h Rainfall, River Level at Bhimgoda Gauge, Soil Saturation, Elevation).
4. RandomForest model runs inference, predicting probability and categorizing risk.
5. Explainable AI breakdown shows contributing physical causes.
6. React-Leaflet map visualizes the sector and verified high-ground relief camps (e.g. *Bhopatwala Relief Shelter*).
7. Polyline route highlights the recommended navigation corridor.
8. Switch to `/admin/dashboard` with `admin@floodshield.ai` to demonstrate emergency ops monitoring and alert broadcasting.

---

© 2026 FloodShield AI Disaster Response System.
