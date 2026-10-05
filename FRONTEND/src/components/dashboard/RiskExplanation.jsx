import React from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, Layers } from 'lucide-react';

export const RiskExplanation = ({ factors = [] }) => {
  if (!factors || factors.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center text-slate-400">
        No anomalous environmental risk factors detected for this sector.
      </div>
    );
  }

  const impactStyles = {
    CRITICAL: {
      border: 'border-red-500/40 bg-red-950/20 text-red-300',
      badge: 'bg-red-500/20 text-red-400 border-red-500/30',
      barColor: 'bg-red-500',
    },
    HIGH: {
      border: 'border-orange-500/40 bg-orange-950/20 text-orange-300',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      barColor: 'bg-orange-500',
    },
    MODERATE: {
      border: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      barColor: 'bg-amber-500',
    },
    BENEFICIAL: {
      border: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      barColor: 'bg-emerald-500',
    },
    NORMAL: {
      border: 'border-slate-700/60 bg-slate-900/40 text-slate-300',
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
      barColor: 'bg-slate-600',
    },
    LOW: {
      border: 'border-slate-700/60 bg-slate-900/40 text-slate-300',
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
      barColor: 'bg-slate-600',
    },
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Explainable AI: Contributing Risk Factors</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          Hydrological Diagnostic
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Our multi-factor inference engine analyzes local telemetry to determine exactly what physical
        mechanisms drive flood vulnerability:
      </p>

      <div className="space-y-3">
        {factors.map((item, idx) => {
          const style = impactStyles[item.impact] || impactStyles.NORMAL;
          const weightPercent = Math.min(100, Math.max(10, Math.round(Math.abs(item.weight || 0.1) * 100)));

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${style.border} transition hover:bg-opacity-40`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.factor}</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${style.badge}`}>
                    {item.impact}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Weight:</span>
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${style.barColor}`}
                      style={{ width: `${weightPercent}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">{weightPercent}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 mb-1.5 leading-relaxed">
                {item.observation}
              </p>

              {item.suggestion && (
                <div className="text-[11px] text-cyan-300 font-medium flex items-center gap-1.5 pt-1 border-t border-white/5">
                  <span className="text-slate-400">Recommended Action:</span>
                  <span>{item.suggestion}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
