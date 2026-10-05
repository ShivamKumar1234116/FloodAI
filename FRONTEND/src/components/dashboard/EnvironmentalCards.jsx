import React from 'react';
import { CloudRain, Waves, Droplets, Mountain, Thermometer, Wind, Clock, CheckCircle } from 'lucide-react';

export const EnvironmentalCards = ({ environmentalData, features }) => {
  if (!environmentalData) return null;

  const weather = environmentalData.weather || {};
  const river = environmentalData.river || {};
  const elevation = environmentalData.elevation || {};

  const cards = [
    {
      title: '24h Precipitation',
      value: `${features?.rainfall ?? weather.rainfall_24h ?? 0}`,
      unit: 'mm',
      icon: CloudRain,
      iconColor: 'text-blue-400',
      bgColor: 'from-blue-950/40 to-slate-900',
      borderColor: 'border-blue-500/20',
      subtext: features?.rainfall > 100 ? 'Extreme Catchment Surge' : 'Monsoon Rainfall',
      source: weather.source || 'Open-Meteo Weather API',
      status: weather.status || 'LIVE',
      lastUpdated: weather.last_updated,
    },
    {
      title: 'River Gauge Level',
      value: `${features?.river_level ?? river.current_gauge_level ?? 286.0}`,
      unit: 'meters',
      icon: Waves,
      iconColor: river.current_gauge_level >= river.danger_threshold ? 'text-red-400' : 'text-cyan-400',
      bgColor: 'from-cyan-950/40 to-slate-900',
      borderColor: river.current_gauge_level >= river.danger_threshold ? 'border-red-500/40' : 'border-cyan-500/20',
      subtext: `Danger Threshold: ${river.danger_threshold || 294.0} m`,
      source: river.source || 'CWC Hydrological Basin Gauges',
      status: river.status || 'LIVE',
      lastUpdated: river.last_updated,
    },
    {
      title: 'Soil Moisture (0-7cm)',
      value: `${features?.soil_moisture ?? weather.soil_moisture ?? 50.0}`,
      unit: '%',
      icon: Droplets,
      iconColor: 'text-teal-400',
      bgColor: 'from-teal-950/40 to-slate-900',
      borderColor: 'border-teal-500/20',
      subtext: features?.soil_moisture > 75 ? 'Near Full Saturation (Low Absorption)' : 'Moderate Absorption Capacity',
      source: 'Open-Meteo Soil Volumetric Model',
      status: weather.status || 'LIVE',
      lastUpdated: weather.last_updated,
    },
    {
      title: 'Surface Elevation',
      value: `${features?.elevation ?? elevation.elevation ?? 250}`,
      unit: 'meters',
      icon: Mountain,
      iconColor: 'text-amber-400',
      bgColor: 'from-amber-950/40 to-slate-900',
      borderColor: 'border-amber-500/20',
      subtext: features?.elevation < 100 ? 'Low-lying River Basin Floodplain' : 'Elevated Terrain Contour',
      source: elevation.source || 'SRTM Geospatial Elevation 90m',
      status: elevation.status || 'CACHED',
      lastUpdated: elevation.last_updated || weather.last_updated,
    },
    {
      title: 'Relative Humidity',
      value: `${features?.humidity ?? weather.humidity ?? 70}`,
      unit: '%',
      icon: Wind,
      iconColor: 'text-sky-400',
      bgColor: 'from-sky-950/40 to-slate-900',
      borderColor: 'border-sky-500/20',
      subtext: 'Atmospheric Moisture Density',
      source: weather.source || 'Meteorological Telemetry',
      status: weather.status || 'LIVE',
      lastUpdated: weather.last_updated,
    },
    {
      title: 'Surface Temperature',
      value: `${features?.temperature ?? weather.temperature ?? 28}`,
      unit: '°C',
      icon: Thermometer,
      iconColor: 'text-rose-400',
      bgColor: 'from-rose-950/40 to-slate-900',
      borderColor: 'border-rose-500/20',
      subtext: weather.description || 'Monsoon Atmospheric Layer',
      source: weather.source || 'Meteorological Telemetry',
      status: weather.status || 'LIVE',
      lastUpdated: weather.last_updated,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const timeStr = card.lastUpdated
          ? new Date(card.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Just now';

        return (
          <div
            key={idx}
            className={`glass-panel rounded-xl p-4 bg-gradient-to-br ${card.bgColor} border ${card.borderColor} flex flex-col justify-between hover:border-slate-600 transition shadow-lg`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    card.status === 'LIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {card.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </span>
                <span className="text-sm font-semibold text-slate-400">{card.unit}</span>
              </div>

              <p className="text-xs text-slate-300 mt-1 font-medium">{card.subtext}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate max-w-[170px]" title={card.source}>
                {card.source}
              </span>
              <span className="flex items-center gap-1 font-mono text-slate-400 flex-shrink-0">
                <Clock className="w-3 h-3 text-slate-500" />
                {timeStr}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
