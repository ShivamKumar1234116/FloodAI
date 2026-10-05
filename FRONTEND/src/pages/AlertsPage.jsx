import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldAlert, Radio, Filter, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { alertsApi } from '../services/api';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // ALL, OFFICIAL, AI_PREDICTION, ADMIN_OPERATIONAL

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertsApi.getPublic();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'ALL') return true;
    return a.type === filterType;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 glow-critical';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-red-400" />
            <span>Emergency Flood Warnings & Active Bulletins</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated official notices from Central Water Commission (CWC), AI predictive anomaly alerts, and district relief advisories.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-xs font-semibold self-start sm:self-auto border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
        {[
          { label: 'All Warnings', value: 'ALL' },
          { label: 'Official Authority (CWC/IMD)', value: 'OFFICIAL' },
          { label: 'AI Model Predictions', value: 'AI_PREDICTION' },
          { label: 'Admin Operational Notices', value: 'ADMIN_OPERATIONAL' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === tab.value
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert Cards Feed */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading active bulletins...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center text-slate-400">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No Active Alerts in this Category</h3>
          <p className="text-xs text-slate-500 mt-1">Monitored hydrological channels within safe standard stages.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert._id}
              className="glass-panel p-5 rounded-2xl border border-slate-800/90 shadow-xl hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${getSeverityBadge(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs bg-slate-800 text-cyan-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono">
                    {alert.source}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {alert.location}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{alert.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                {alert.message}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Origin: {alert.created_by || 'Disaster Monitoring Network'}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Broadcast Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
