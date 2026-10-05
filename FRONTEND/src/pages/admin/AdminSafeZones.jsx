import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, MapPin, Users, Phone, CheckCircle2, RefreshCw } from 'lucide-react';
import { safeZonesApi, adminApi } from '../../services/api';

export const AdminSafeZones = () => {
  const [safeZones, setSafeZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('29.9880');
  const [longitude, setLongitude] = useState('78.1885');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Haridwar');
  const [capacity, setCapacity] = useState(1500);
  const [currentOccupancy, setCurrentOccupancy] = useState(0);
  const [facilities, setFacilities] = useState('Medical Care, Clean Water, Solar Power');
  const [contact, setContact] = useState('+91-1334-226601');

  const fetchZones = async () => {
    setLoading(true);
    try {
      const data = await safeZonesApi.getAll();
      setSafeZones(data.safe_zones || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createSafeZone({
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        city,
        capacity: parseInt(capacity, 10),
        current_occupancy: parseInt(currentOccupancy, 10),
        facilities: facilities.split(',').map((s) => s.trim()),
        contact,
        status: 'ACTIVE',
        verification_status: 'VERIFIED',
      });
      setShowModal(false);
      setName('');
      setAddress('');
      fetchZones();
    } catch (err) {
      alert('Error creating safe zone');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this safe zone station?')) return;
    try {
      await adminApi.deleteSafeZone(id);
      fetchZones();
    } catch (err) {
      alert('Error deleting safe zone');
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>Safe-Zone & Relief Camp Registry Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain verified shelters, verify operational elevation buffers, monitor capacity headroom, and update emergency dispatch numbers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Verified Station</span>
        </button>
      </div>

      {/* Safe Zones Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Station Name</th>
              <th className="p-3">Coordinates & City</th>
              <th className="p-3">Capacity & Headroom</th>
              <th className="p-3">Status</th>
              <th className="p-3">Contact</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {safeZones.map((zone) => {
              const cap = zone.capacity || 1000;
              const occ = zone.current_occupancy || 0;
              const avail = Math.max(0, cap - occ);

              return (
                <tr key={zone._id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <p className="font-bold text-white text-sm">{zone.name}</p>
                    <p className="text-[11px] text-slate-400">{zone.address}</p>
                  </td>
                  <td className="p-3 font-mono text-slate-300">
                    <p>{zone.city || 'Regional'}</p>
                    <p className="text-[10px] text-slate-500">
                      {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                    </p>
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-white font-bold">
                      {occ} / {cap}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {avail} slots available
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      {zone.verification_status || 'VERIFIED'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{zone.contact || 'N/A'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(zone._id)}
                      className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg transition"
                      title="Delete safe zone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Register Safe Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel-elevated p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Register Verified Safe Zone</h3>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Station / Shelter Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bhopatwala High Ground Relief Pavilion"
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City / District</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Elevated Ridge Complex, Haridwar"
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Facilities (Comma separated)</label>
                <input
                  type="text"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Emergency Dispatch Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Register Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
