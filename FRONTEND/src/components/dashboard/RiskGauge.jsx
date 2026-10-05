import React from 'react';
import { RiskBadge } from '../common/RiskBadge';
import { AlertCircle, HelpCircle } from 'lucide-react';

export const RiskGauge = ({ prediction }) => {
  if (!prediction) return null;

  const prob = prediction.flood_probability ?? 0.05;
  const pct = Math.round(prob * 100);
  const level = prediction.risk_level || 'LOW';

  // Svg circular parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prob * circumference);

  const levelColor = {
    LOW: '#10B981',      // Emerald Green
    MEDIUM: '#F59E0B',   // Amber Yellow
    HIGH: '#F97316',     // Safety Orange
    CRITICAL: '#EF4444', // Crimson Red
  }[level] || '#10B981';

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center justify-between">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Estimated Flood Probability</h3>
          <p className="text-xs text-slate-400">RandomForest Ensemble Model Inference</p>
        </div>
        <RiskBadge level={level} size="md" />
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 200 200">
          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#1e293b"
            strokeWidth="16"
            fill="transparent"
          />
          {/* Active Probability Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={levelColor}
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-white tracking-tight">
            {pct}%
          </span>
          <span className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: levelColor }}>
            {prediction.label || `${level} RISK`}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            P = {prob.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Threshold Legend Bar */}
      <div className="w-full mt-2 space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>0%</span>
          <span className="text-emerald-400">30% (Low)</span>
          <span className="text-amber-400">60% (Med)</span>
          <span className="text-orange-400">80% (High)</span>
          <span className="text-red-400">100%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="w-[30%] bg-emerald-500/80" title="Low Risk (0-30%)" />
          <div className="w-[30%] bg-amber-500/80" title="Medium Risk (30-60%)" />
          <div className="w-[20%] bg-orange-500/80" title="High Risk (60-80%)" />
          <div className="w-[20%] bg-red-500/80" title="Critical Breach (80-100%)" />
        </div>
      </div>

      {/* Official Disclaimer */}
      <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {prediction.disclaimer || 'Estimated model prediction. Does not guarantee flood behavior or replace official disaster authorities.'}
        </p>
      </div>
    </div>
  );
};
