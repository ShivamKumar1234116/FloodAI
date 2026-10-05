import React from 'react';
import { ShieldCheck, MapPin, Users, Compass, ExternalLink, Navigation, Phone, CheckCircle2 } from 'lucide-react';

export const SafeZoneList = ({ safeZones = [], onSelectZone }) => {
  if (!safeZones || safeZones.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center text-slate-400">
        <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p>No verified relief shelters identified within the immediate search perimeter.</p>
        <p className="text-xs text-slate-500 mt-1">Expanding search radius or contacting local flood control cell...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Recommended Verified Safe Zones</h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          Ranked by Proximity & Capacity
        </span>
      </div>

      <div className="space-y-3.5">
        {safeZones.map((zone, idx) => {
          const cap = zone.capacity || 1000;
          const occ = zone.current_occupancy || 0;
          const available = zone.available_capacity ?? (cap - occ);
          const occPct = Math.round((occ / cap) * 100);

          return (
            <div
              key={zone._id || idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 transition group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="h-5 px-2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-300 transition">
                      {zone.name}
                    </h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      {zone.city || 'Verified Shelter'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{zone.address}</span>
                  </p>

                  {/* Facilities Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(zone.facilities || ['Medical', 'Potable Water', 'Power Backup']).map((f, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] bg-slate-800/80 text-cyan-300/90 px-2 py-0.5 rounded font-medium border border-slate-700"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Distance & Action Column */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-lg font-black text-white font-mono">
                      {zone.distance_km !== undefined ? `${zone.distance_km} km` : 'Near'}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {available} slots open ({occPct}% full)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onSelectZone && (
                      <button
                        onClick={() => onSelectZone(zone)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition border border-slate-600 flex items-center gap-1"
                      >
                        <Compass className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Map View</span>
                      </button>
                    )}
                    <a
                      href={zone.google_maps_url || zone.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${zone.latitude},${zone.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-500/20 transition flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Occupancy */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex-1 mr-4">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${occPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${occPct}%` }}
                    />
                  </div>
                </div>
                {zone.contact && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-300 font-mono flex-shrink-0">
                    <Phone className="w-3 h-3 text-cyan-400" /> {zone.contact}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
