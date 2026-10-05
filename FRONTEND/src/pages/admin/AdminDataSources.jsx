import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, RefreshCw, Server, Zap, Database } from 'lucide-react';
import { adminApi } from '../../services/api';

export const AdminDataSources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDataSources();
      setSources(res.sources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-cyan-400" />
            <span>Telemetry Pipeline & Data Source Health</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heartbeat monitoring of external meteorological endpoints, hydrological gauge feeds, and inference workers.
          </p>
        </div>

        <button
          onClick={fetchSources}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-xs font-semibold border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Ping All Services</span>
        </button>
      </div>

      {/* Grid of Data Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((src) => {
          const isOnline = src.status === 'ONLINE';

          return (
            <div
              key={src.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {src.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isOnline
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {src.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{src.name}</h3>
                <p className="text-xs font-mono text-slate-400 truncate mb-4 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  {src.endpoint}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Latency:</span>
                  <span className="text-cyan-400 font-bold">{src.latency_ms} ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Uptime / Success:</span>
                  <span className="text-emerald-400 font-bold">{src.success_rate}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-800/50">
                  <span>Last Sync:</span>
                  <span>{new Date(src.last_sync).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
