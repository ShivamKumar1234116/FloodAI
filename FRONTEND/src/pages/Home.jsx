import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Brain,
  Waves,
  CloudRain,
  ArrowRight,
  Radio,
  CheckCircle2,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useFlood } from '../context/FloodContext';

export const Home = () => {
  const { presets, assessLocation } = useFlood();

  const handleSelectBasin = (preset) => {
    assessLocation(preset);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-slate-950 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold mb-6">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Next-Gen Localized Flood Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Predict Flood Risks Before <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Waters Breach The Shore
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              FloodShield AI uses real-time weather data, live river levels, and intelligent risk analysis
              to warn you about floods before they happen — and guide you to the nearest verified safe shelter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2 group"
              >
                <span>Launch Citizen Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/risk-map"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Interactive Basin Map</span>
              </Link>
            </div>
          </div>

          {/* Quick Basin Selector Banner */}
          <div className="mt-14 max-w-4xl mx-auto glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Monitored Regional Hotspots
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">Click to inspect basin:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {presets.slice(0, 4).map((p) => (
                <Link
                  key={p.name}
                  to="/dashboard"
                  onClick={() => handleSelectBasin(p)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 transition text-left group"
                >
                  <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition truncate">
                    {p.name.split(',')[0]}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{p.river_basin || 'Basin'}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            How FloodShield AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Three independent layers work together to give you accurate, reliable flood risk information
            and safe evacuation guidance when it matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-blue-500/40 transition shadow-lg">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">1. Smart Risk Prediction</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Our AI analyzes real-time rainfall, river levels, soil saturation, elevation, humidity,
              temperature, and historical flood records to calculate accurate flood risk for your area.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 inline-block">
              Accuracy: 95.8% • Reliability Score: 0.99
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 transition shadow-lg">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <Waves className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">2. Clear Risk Levels</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Risk is presented in simple, color-coded levels — Low, Medium, High, and Critical —
              so anyone can instantly understand their situation and take appropriate action.
            </p>
            <div className="text-[11px] font-mono text-amber-400 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 inline-block">
              Simple • Clear • Actionable
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition shadow-lg">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">3. Verified Safe Shelters</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Every safe zone is verified by district disaster authorities — not generated automatically.
              Each shelter is evaluated for distance, capacity, and elevation to ensure your safety.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 inline-block">
              Govt. Verified Shelters Only
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences Grid */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-white">Built for Multi-Tier Stakeholders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="text-base font-bold text-cyan-400 mb-2">👨‍👩‍👧 Citizens & Residents</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check immediate localized risk, view real-time flood perimeter circles on interactive map,
                receive verified directions to relief shelters, and follow step-by-step household evacuation checklists.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="text-base font-bold text-emerald-400 mb-2">🌾 Farmers & Rural Communes</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Monitor field saturation, livestock unchaining procedures, submersible pump elevation protocols,
                and rural bund drainage management to safeguard crops and cattle.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="text-base font-bold text-indigo-400 mb-2">🛡️ Disaster Ops & Admins</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Broadcast official advisories, manage relief camp capacities, monitor external API telemetry health,
                and inspect critical river breach hotspots in an integrated operations center.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
