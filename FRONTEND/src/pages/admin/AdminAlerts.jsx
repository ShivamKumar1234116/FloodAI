import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Power, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { adminApi, alertsApi } from '../../services/api';

export const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Alert Form state
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('Admin Operational');
  const [type, setType] = useState('ADMIN_OPERATIONAL');
  const [severity, setSeverity] = useState('MEDIUM');
  const [location, setLocation] = useState('Haridwar Sector #2');
  const [message, setMessage] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertsApi.getPublic();
      setAlerts(res.alerts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createAlert({
        title,
        source,
        type,
        severity,
        location,
        message,
        active: true,
      });
      setShowCreateModal(false);
      setTitle('');
      setMessage('');
      fetchAlerts();
    } catch (err) {
      alert('Failed to publish alert');
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminApi.toggleAlert(id);
      fetchAlerts();
    } catch (err) {
      alert('Error toggling alert');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently archive/delete this alert?')) return;
    try {
      await adminApi.deleteAlert(id);
      fetchAlerts();
    } catch (err) {
      alert('Error deleting alert');
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-amber-400" />
            <span>Alert & Operational Advisory Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author and broadcast official warnings, review AI model predictions, and control public tickers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Advisory</span>
        </button>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Status</th>
              <th className="p-3">Title & Summary</th>
              <th className="p-3">Source Origin</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {alerts.map((alert) => (
              <tr key={alert._id} className="hover:bg-slate-800/40 transition">
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      alert.active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${alert.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    {alert.active ? 'ACTIVE' : 'ARCHIVED'}
                  </span>
                </td>
                <td className="p-3 max-w-sm">
                  <p className="font-bold text-white text-sm">{alert.title}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{alert.message}</p>
                </td>
                <td className="p-3">
                  <span className="text-[11px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    {alert.source}
                  </span>
                </td>
                <td className="p-3">
                  <span className="font-mono text-xs font-bold text-white">{alert.severity}</span>
                </td>
                <td className="p-3 text-slate-300 font-medium">{alert.location}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleToggle(alert._id)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                    title={alert.active ? 'Deactivate alert' : 'Activate alert'}
                  >
                    <Power className={`w-3.5 h-3.5 ${alert.active ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(alert._id)}
                    className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg transition"
                    title="Delete alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel-elevated p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Broadcast Emergency Advisory</h3>

            <form onSubmit={handleCreateAlert} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Advisory Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Upper Ganga Catchment Flash Inflow Notice"
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Source Origin</label>
                  <select
                    value={source}
                    onChange={(e) => {
                      setSource(e.target.value);
                      setType(
                        e.target.value.includes('Official')
                          ? 'OFFICIAL'
                          : e.target.value.includes('AI')
                          ? 'AI_PREDICTION'
                          : 'ADMIN_OPERATIONAL'
                      );
                    }}
                    className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none"
                  >
                    <option value="Admin Operational">Admin Operational</option>
                    <option value="Official Authority (CWC/SEOC)">Official Authority (CWC/SEOC)</option>
                    <option value="AI Model Prediction">AI Model Prediction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity Tier</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="ADVISORY">ADVISORY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Location / Sector</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bulletin Message</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter detailed directives, danger marks, and shelter instructions..."
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Publish Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
