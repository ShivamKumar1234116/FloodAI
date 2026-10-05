# FloodShield AI - Admin & Disaster Management Flow

## Overview
Disaster Management authorities access the restricted Admin Portal to maintain operational oversight, broadcast official bulletins, and track relief station headroom.

## Operational Flow
```
[Admin Signs In via /admin/login]
         │
         ▼
[JWT Verification & ADMIN Role Authorization]
         │
         ▼
[Emergency Operations Command Center (/admin/dashboard)]
         │
         ├───► Executive KPI Monitoring:
         │       • Critical Breach Areas Count
         │       • High-Risk Sectors Count
         │       • Active Safe Zones & Shelter Capacity Headroom
         │       • Data Source Health (5/5 Online)
         │
         ├───► Risk Monitoring Inspector:
         │       • Click any basin row (Haridwar, Patna, Guwahati, Delhi, etc.)
         │       • Inspect live gauge level, danger threshold, and 24h rainfall
         │       • Review assigned relief safe zones
         │
         ├───► Alert Management (/admin/alerts):
         │       • Author & broadcast official emergency bulletins
         │       • Label origin (Official CWC/IMD, AI Prediction, Admin Operational)
         │       • Toggle active status or permanently archive alerts
         │
         ├───► Safe-Zone Registry (/admin/safe-zones):
         │       • Add new verified relief camp coordinates & capacity
         │       • Update occupancy rates and emergency dispatch numbers
         │       • Verify elevation safety buffers
         │
         └───► Data Pipeline Telemetry (/admin/data-sources):
                 • Monitor API latency (ms) and success rates for Open-Meteo, CWC, and ML workers
```
