import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Users, Navigation, Phone, Search, Building2, CheckCircle2 } from 'lucide-react';
import { safeZonesApi } from '../services/api';

export const SafeZonesPage = () => {
  const [safeZones, setSafeZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');

  useEffect(() => {
    const fetchSafeZones = async () => {
      setLoading(true);
      try {
        const data = await safeZonesApi.getAll();
        setSafeZones(data.safe_zones || []);
      } catch (err) {
        console.error('Failed to load safe zones', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSafeZones();
  }, []);

  const cities = ['ALL', ...new Set(safeZones.map((z) => z.city || 'Haridwar'))];

  const filteredZones = safeZones.filter((zone) => {
    const matchesCity = selectedCity === 'ALL' || (zone.city && zone.city.toLowerCase() === selectedCity.toLowerCase());
    const matchesQuery =
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesQuery;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>Verified Flood Relief Shelters & Safe Zones</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official high-ground evacuation shelters verified by district disaster management authorities.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search relief camp by name, address, or landmark..."
            className="w-full bg-slate-900 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
                selectedCity === city
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Safe Zones Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading verified safe zones...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredZones.map((zone) => {
            const cap = zone.capacity || 1000;
            const occ = zone.current_occupancy || 0;
            const available = Math.max(0, cap - occ);
            const occPct = Math.round((occ / cap) * 100);

            return (
              <div
                key={zone._id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED RELIEF CENTER
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Elevation: {zone.elevation || 300}m
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{zone.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{zone.address}</span>
                  </p>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(zone.facilities || []).map((f, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded font-medium border border-slate-800"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Shelter Occupancy:</span>
                    <span className="font-mono text-white font-bold">
                      {occ} / {cap} ({available} available)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${occPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${occPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {zone.contact && (
                      <a
                        href={`tel:${zone.contact}`}
                        className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-3 h-3 text-cyan-400" /> {zone.contact}
                      </a>
                    )}
                    <a
                      href={zone.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${zone.latitude},${zone.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md transition flex items-center gap-1 ml-auto"
                    >
                      <Navigation className="w-3 h-3" /> Navigation Route
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
