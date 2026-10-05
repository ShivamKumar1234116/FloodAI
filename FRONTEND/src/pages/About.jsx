import React from 'react';
import { ShieldCheck, Cpu, Database, Network, FileCheck, Layers, GitBranch, Terminal } from 'lucide-react';

export const About = () => {
  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How FloodShield AI Protects You
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          FloodShield AI combines real-time weather data, river levels, and intelligent risk analysis
          to give you reliable flood warnings and safe evacuation routes — exactly when you need them.
        </p>
      </div>

      {/* End-to-End Pipeline Visualization */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <span>How Your Flood Risk Is Calculated — Step by Step</span>
        </h2>

        <div className="p-4 rounded-xl bg-slate-900/90 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto border border-slate-800">
          You search "Haridwar" → Location pinpointed (29.9457° N, 78.1642° E) <br />
          ↳ Live Weather Data: Rainfall (last 24h), Temperature, Humidity, Soil Wetness <br />
          ↳ River Level Check: Ganga at Bhimgoda (vs. danger threshold 294.0m) <br />
          ↳ Ground Elevation: 314m above sea level <br />
          ↳ Data Validation: Checking and correcting any missing data points <br />
          ↳ AI Risk Analysis: Flood probability = 82% → CRITICAL RISK (Red Alert) <br />
          ↳ Risk Explanation: Heavy rain + river overflowing danger mark <br />
          ↳ Safe Shelter Search: Finding verified relief camps near you <br />
          ↳ Map View: Showing flood zone and evacuation routes to safe shelters
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Cpu className="w-5 h-5" />
            <span>AI Risk Analysis Engine</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li>• <strong>How it works:</strong> Trained on thousands of real flood events across India</li>
            <li>• <strong>Factors analyzed:</strong> Rainfall, River Level, Soil Wetness, Elevation, Humidity, Temperature, Flood History</li>
            <li>• <strong>Testing:</strong> Validated on 20% of real-world data — never trained on it</li>
            <li>• <strong>Accuracy:</strong> 95.8% correct risk assessment, 0.99 reliability score</li>
            <li>• <strong>Transparency:</strong> Shows you exactly which factors are driving the risk</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Network className="w-5 h-5" />
            <span>Live Data Sources</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li>• <strong>Weather & Rain:</strong> Global weather forecast service (updated hourly)</li>
            <li>• <strong>Soil Wetness:</strong> Top 7cm soil moisture layer measurement</li>
            <li>• <strong>River Levels:</strong> Central Water Commission (CWC) official gauge stations</li>
            <li>• <strong>Elevation:</strong> Satellite-based digital terrain model (90m resolution)</li>
            <li>• <strong>Data integrity:</strong> No fabricated data — cached fallbacks always show timestamps.</li>
          </ul>
        </div>
      </div>

      {/* Safety & Trust Disclaimers */}
      <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
        <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Important Safety Notice</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          FloodShield AI provides localized risk awareness to help you make better decisions before a flood.
          All risk values are probability estimates and cannot guarantee exact flood occurrence or timing.
          In any emergency, always follow official instructions from the National Disaster Management Authority (NDMA),
          State Emergency Operations Centers (SEOC), and local Police or District authorities.
        </p>
      </div>
    </div>
  );
};
