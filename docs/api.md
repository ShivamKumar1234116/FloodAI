# FloodShield AI - API Specification

Base URL: `http://localhost:8000/api` (or proxied via Vite at `http://localhost:5173/api`)

## Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register`: Register new citizen or admin account.
- `POST /api/auth/login`: Authenticate with email/password; returns JWT bearer token.
- `GET /api/auth/me`: Retrieve current user profile (requires `Bearer <token>`).

## Locations & Geocoding (`/api/locations`)
- `GET /api/locations/search?q={query}`: Geocodes text query to latitude, longitude, and elevation.
- `GET /api/locations/presets`: Returns high-risk monitored Indian river basins (Haridwar, Patna, Guwahati, Mumbai, Delhi, Rishikesh).

## Prediction & Risk Assessment (`/api/prediction`)
- `POST /api/prediction`: Primary pipeline endpoint.
  ```json
  {
    "latitude": 29.9457,
    "longitude": 78.1642,
    "location_name": "Haridwar",
    "historical_flood": 1
  }
  ```
  Returns:
  - `flood_probability`: float between 0.0 and 1.0
  - `risk_level`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
  - `contributing_factors`: List of explainable AI weights and observations
  - `environmental_data`: Weather, river stage, elevation
  - `nearby_safe_zones`: Top verified shelters ranked by distance
  - `recommended_actions`: Checklists for citizens and farmers

- `POST /api/prediction/simulate`: Direct ML inference on custom 7-feature vectors for scenario testing.

## Safe Zones (`/api/safe-zones`)
- `GET /api/safe-zones/nearby?lat={lat}&lng={lng}&max_dist={km}`: Ranks verified shelters by distance and remaining capacity.
- `GET /api/safe-zones`: Returns all verified shelter locations.

## Public Alerts (`/api/alerts`)
- `GET /api/alerts`: Returns active emergency bulletins with labeled origins (`OFFICIAL`, `AI_PREDICTION`, `ADMIN_OPERATIONAL`).

## Emergency AI Assistant (`/api/chatbot`)
- `POST /api/chatbot`:
  ```json
  {
    "message": "What should farmers do with cattle?",
    "location": "Haridwar",
    "risk_level": "CRITICAL"
  }
  ```

## Admin Management (`/api/admin`) *(Requires Admin JWT)*
- `GET /api/admin/dashboard`: Executive KPI counts and system health.
- `GET /api/admin/risk-areas`: Monitored river sectors with telemetry and status.
- `GET /api/admin/data-sources`: Heartbeat, latency, and success metrics for all 5 external data feeds.
- `POST / PUT / DELETE /api/admin/alerts`: Create, edit, toggle, or delete alerts.
- `POST / PUT / DELETE /api/admin/safe-zones`: Registry CRUD for relief shelters.
