import React from 'react';

export const MapLegend = () => {
  return (
    <div className="bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 shadow-2xl text-xs space-y-2 max-w-[220px]">
      <h4 className="font-bold text-white text-[11px] uppercase tracking-wider border-b border-slate-800 pb-1.5">
        Map Indicators
      </h4>

      {/* Risk Levels */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-slate-300">LOW (0–30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span className="text-slate-300">MEDIUM (30–60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
          <span className="text-slate-300">HIGH (60–80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
          <span className="text-slate-300 font-bold">CRITICAL (80–100%)</span>
        </div>
      </div>

      {/* Entity Icons */}
      <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
          <span className="text-slate-300">User / Monitored Site</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-300" />
          <span className="text-slate-300">Verified Safe Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-cyan-400 border-t border-dashed" />
          <span className="text-slate-300">Evacuation Route</span>
        </div>
      </div>
    </div>
  );
};
