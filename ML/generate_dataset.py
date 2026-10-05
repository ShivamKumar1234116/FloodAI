import pandas as pd
import numpy as np

np.random.seed(42)
n_samples = 2500

# Features:
# rainfall: mm in last 24-72 hours (0 to 450 mm)
# temperature: Celsius (12 to 42 C)
# humidity: % (25 to 100%)
# river_level: meters relative to gauge / danger mark (e.g., 200m to 320m, or normalized/realistic gauge levels)
# Let's use 200 - 320 meters as gauge level (Haridwar danger level is ~294m)
# soil_moisture: % saturation (10% to 100%)
# elevation: meters above sea level (15m to 850m)
# historical_flood: 0 (no past frequent floods) or 1 (historically flood-prone basin)

rainfall = np.random.uniform(5, 380, n_samples)
temperature = np.random.uniform(16, 38, n_samples)
humidity = np.random.uniform(35, 99, n_samples)
river_level = np.random.uniform(280.0, 298.5, n_samples) # e.g. 294 is danger level
soil_moisture = np.random.uniform(20, 98, n_samples)
elevation = np.random.uniform(30, 650, n_samples)
historical_flood = np.random.choice([0, 1], size=n_samples, p=[0.45, 0.55])

# Calculate flood probability based on physical hydrology factors
# 1. Heavy rainfall > 100mm significantly increases risk
rain_factor = np.clip((rainfall - 60) / 180.0, 0, 1.5)

# 2. River level near or above danger mark (294.0m)
river_factor = np.clip((river_level - 291.5) / 4.0, 0, 1.6)

# 3. High soil moisture saturation means low absorption
soil_factor = np.clip((soil_moisture - 50) / 45.0, 0, 1.2)

# 4. Low elevation accumulates water from upstream
elevation_factor = np.clip((350 - elevation) / 250.0, -0.5, 1.2)

# 5. High humidity correlates with continued monsoon precipitation
hum_factor = np.clip((humidity - 65) / 30.0, 0, 0.8)

# 6. Historical flood propensity
hist_factor = historical_flood * 0.45

# Composite score with noise
flood_score = (
    0.35 * rain_factor +
    0.30 * river_factor +
    0.20 * soil_factor +
    0.15 * elevation_factor +
    0.10 * hum_factor +
    0.15 * hist_factor +
    np.random.normal(0, 0.12, n_samples)
)

# Convert to binary flood target with realistic threshold
prob = 1 / (1 + np.exp(-(flood_score - 0.75) * 4.5))
flood = (prob > 0.48).astype(int)

df = pd.DataFrame({
    "rainfall": np.round(rainfall, 1),
    "temperature": np.round(temperature, 1),
    "humidity": np.round(humidity, 1),
    "river_level": np.round(river_level, 2),
    "soil_moisture": np.round(soil_moisture, 1),
    "elevation": np.round(elevation, 1),
    "historical_flood": historical_flood,
    "flood": flood
})

df.to_csv("c:/Users/DELL-IN/Desktop/FloodShield_AI/ML/datasets/flood_data.csv", index=False)
print(f"Generated {len(df)} samples in datasets/flood_data.csv")
print(f"Flood balance:\n{df['flood'].value_counts(normalize=True)}")
