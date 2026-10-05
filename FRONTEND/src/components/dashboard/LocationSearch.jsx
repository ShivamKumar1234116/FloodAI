import React, { useState } from 'react';
import { Search, MapPin, Navigation, RefreshCw, CheckCircle2 } from 'lucide-react';
import { locationsApi } from '../../services/api';
import { useFlood } from '../../context/FloodContext';

export const LocationSearch = () => {
  const { selectedLocation, assessLocation, loading, presets } = useFlood();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await locationsApi.search(query.trim());
      setSearchResults(res.locations || []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Location search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (loc) => {
    setShowDropdown(false);
    setQuery('');
    assessLocation(loc);
  };

  const handleRefresh = () => {
    if (selectedLocation) {
      assessLocation(selectedLocation);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, district, or river basin (e.g. Haridwar, Patna, Guwahati)..."
                className="w-full bg-slate-900/90 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span>Geocode & Predict</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectLocation(item)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/80 flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {item.latitude.toFixed(4)}° N, {item.longitude.toFixed(4)}° E • {item.state || 'India'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-cyan-400 font-medium">Select & Analyze →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Coordinates & Quick Refresh */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-3.5 py-2 rounded-xl text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span className="font-semibold text-white truncate max-w-[200px]">
              {selectedLocation?.name?.split(',')[0]}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              ({selectedLocation?.latitude?.toFixed(4)}, {selectedLocation?.longitude?.toFixed(4)})
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition border border-slate-700 flex-shrink-0"
            title="Refresh environmental telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Preset Quick Select Pills */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
          Demo Basins:
        </span>
        {presets.slice(0, 6).map((preset) => {
          const isSelected = selectedLocation?.name === preset.name;
          return (
            <button
              key={preset.name}
              onClick={() => assessLocation(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {isSelected && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
              <span>{preset.name.split(',')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
