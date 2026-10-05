import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { FloodMap } from '../components/map/FloodMap';
import { LocationSearch } from '../components/dashboard/LocationSearch';
import { Compass, Filter, ShieldCheck, AlertTriangle, Layers, Radio } from 'lucide-react';

export const RiskMapPage = () => {
  const { selectedLocation, assessmentData, presets, assessLocation } = useFlood();
  const [filterLevel, setFilterLevel] = useState('ALL');

  const riskLevel = assessmentData?.risk_assessment?.risk_level || 'LOW';
  const safeZones = assessmentData?.nearby_safe_zones || [];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Compass className="w-7 h-7 text-cyan-400" />
            <span>Regional Flood Inundation & Safe Zone Map</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View flood risk zones, nearby safe shelters, and river levels on an interactive map.
          </p>
        </div>

        {/* Hotspot Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {presets.slice(0, 4).map((p) => (
            <button
              key={p.name}
              onClick={() => assessLocation(p)}
              className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                selectedLocation?.name === p.name
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      <LocationSearch />

      {/* Map Container */}
      <div className="space-y-4">
        <FloodMap
          centerLocation={selectedLocation}
          riskLevel={riskLevel}
          safeZones={safeZones}
          height="650px"
        />
      </div>

      {/* Map Telemetry Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono">Current Sector</span>
            <p className="text-sm font-bold text-white truncate max-w-[220px]">
              {selectedLocation?.name}
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono">Verified Shelters Mapped</span>
            <p className="text-sm font-bold text-white">
              {safeZones.length} Active Stations
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono">Risk Status</span>
            <p className="text-sm font-bold text-white uppercase">
              {riskLevel} Inundation Risk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
