import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  Users,
  AlertTriangle,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Bell,
  Compass,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [riskAreas, setRiskAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, areasRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getRiskAreas(),
      ]);
      setData(dashRes);
      setRiskAreas(areasRes.areas || []);
      if (areasRes.areas?.length > 0) {
        setSelectedArea(areasRes.areas[0]);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const metrics = data?.metrics || {};

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30">
              DISASTER MANAGEMENT OPS
            </span>
            <span className="text-xs text-slate-400">Authenticated: {user?.name || 'Administrator'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Emergency Operations Command Center
          </h1>
        </div>

        {/* Quick Admin Navigation Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/alerts"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Alerts</span>
          </Link>
          <Link
            to="/admin/safe-zones"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safe Zones Hub</span>
          </Link>
          <Link
            to="/admin/data-sources"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry Health</span>
          </Link>
          <button
            onClick={loadDashboard}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Section 21 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-panel p-4 rounded-xl border border-red-500/30 bg-red-950/20">
          <span className="text-[11px] font-mono text-red-300 uppercase">Critical Areas</span>
          <p className="text-2xl font-black text-red-400 mt-1">{metrics.critical_areas_count ?? 1}</p>
          <span className="text-[10px] text-slate-400">Breach Imminent</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-orange-500/30 bg-orange-950/20">
          <span className="text-[11px] font-mono text-orange-300 uppercase">High Risk Sectors</span>
          <p className="text-2xl font-black text-orange-400 mt-1">{metrics.high_risk_areas_count ?? 2}</p>
          <span className="text-[10px] text-slate-400">High Inflow Stage</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-950/20">
          <span className="text-[11px] font-mono text-amber-300 uppercase">Medium Risk</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{metrics.medium_risk_areas_count ?? 3}</p>
          <span className="text-[10px] text-slate-400">Under Advisory</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Monitored Basins</span>
          <p className="text-2xl font-black text-white mt-1">{metrics.monitored_locations_count ?? 8}</p>
          <span className="text-[10px] text-slate-400">Active Sensors</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[11px] font-mono text-emerald-300 uppercase">Active Safe Zones</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{metrics.active_safe_zones_count ?? 6}</p>
          <span className="text-[10px] text-slate-400">Total Cap: {metrics.total_shelter_capacity || 11850}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
          <span className="text-[11px] font-mono text-cyan-300 uppercase">Data Pipelines</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">{metrics.data_sources_online ?? 5}/5</p>
          <span className="text-[10px] text-slate-400">100% Operational</span>
        </div>
      </div>

      {/* Master Detail Section: Risk Monitoring & Selected Area Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monitored Basins Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Monitored Flood Sectors</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Click row to inspect telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Sector & River</th>
                  <th className="p-3">Gauge Level</th>
                  <th className="p-3">24h Rain</th>
                  <th className="p-3">ML Probability</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {riskAreas.map((area) => {
                  const isSelected = selectedArea?.id === area.id;
                  const isCritical = area.risk_level === 'CRITICAL';
                  const isHigh = area.risk_level === 'HIGH';

                  return (
                    <tr
                      key={area.id}
                      onClick={() => setSelectedArea(area)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-600/15 border-l-4 border-l-cyan-400'
                          : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <td className="p-3">
                        <p className="font-bold text-white">{area.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{area.river}</p>
                      </td>
                      <td className="p-3 font-mono">
                        <span className={area.gauge_level >= area.danger_level ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {area.gauge_level}m
                        </span>{' '}
                        <span className="text-[10px] text-slate-500">/ {area.danger_level}m</span>
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {area.rainfall_24h} mm
                      </td>
                      <td className="p-3 font-mono font-bold text-white">
                        {Math.round(area.flood_probability * 100)}%
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                            isCritical
                              ? 'bg-red-500/20 text-red-400 border-red-500/40 glow-critical'
                              : isHigh
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          }`}
                        >
                          {area.risk_level}
                        </span>
                      </td>
                      <td className="p-3">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Selected Area Telemetry Diagnostic */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Diagnostic Inspector</span>
            </h4>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">
              {selectedArea?.id || 'SECTOR'}
            </span>
          </div>

          {selectedArea ? (
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[11px]">Selected Basin:</span>
                <p className="text-base font-black text-white">{selectedArea.name}</p>
                <p className="text-slate-400">{selectedArea.river}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500">Gauge Stage</span>
                  <p className="text-sm font-bold text-cyan-400">{selectedArea.gauge_level} m</p>
                  <span className="text-[9px] text-slate-400">Danger: {selectedArea.danger_level}m</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500">24h Rainfall</span>
                  <p className="text-sm font-bold text-blue-400">{selectedArea.rainfall_24h} mm</p>
                  <span className="text-[9px] text-slate-400">Catchment Runoff</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500">Soil Moisture</span>
                  <p className="text-sm font-bold text-teal-400">{selectedArea.soil_moisture}%</p>
                  <span className="text-[9px] text-slate-400">Saturation Level</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500">Model Probability</span>
                  <p className="text-sm font-bold text-rose-400">
                    {Math.round(selectedArea.flood_probability * 100)}%
                  </p>
                  <span className="text-[9px] text-slate-400">RandomForest v1.0</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Assigned Relief Stations:</span>
                <p className="text-slate-200 font-medium">
                  {selectedArea.assigned_safe_zones?.join(', ') || 'sz-001 (Bhopatwala Camp)'}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                Last Telemetry Update: {new Date(selectedArea.last_updated).toLocaleString()}
              </div>

              <Link
                to="/dashboard"
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-center block font-semibold transition shadow-md"
              >
                Inspect in Live Citizen Dashboard
              </Link>
            </div>
          ) : (
            <p className="text-slate-400">Select an area from the table.</p>
          )}
        </div>
      </div>
    </div>
  );
};
