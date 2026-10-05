import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { LocationSearch } from '../components/dashboard/LocationSearch';
import { EnvironmentalCards } from '../components/dashboard/EnvironmentalCards';
import { RiskGauge } from '../components/dashboard/RiskGauge';
import { RiskExplanation } from '../components/dashboard/RiskExplanation';
import { SafeZoneList } from '../components/dashboard/SafeZoneList';
import { ActionGuidance } from '../components/dashboard/ActionGuidance';
import { FloodMap } from '../components/map/FloodMap';
import { ChatbotDrawer } from '../components/dashboard/ChatbotDrawer';
import { AlertBanner } from '../components/common/AlertBanner';
import {
  MessageSquare,
  Compass,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';

export const Dashboard = () => {
  const { selectedLocation, assessmentData, loading, error, alerts } = useFlood();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedZoneOnMap, setSelectedZoneOnMap] = useState(null);

  const riskAssessment = assessmentData?.risk_assessment;
  const environmentalData = assessmentData?.environmental_data;
  const features = assessmentData?.features_used;
  const nearbySafeZones = assessmentData?.nearby_safe_zones || [];
  const recommendedActions = assessmentData?.recommended_actions;
  const riskLevel = riskAssessment?.risk_level || 'LOW';

  const handleSelectZone = (zone) => {
    setSelectedZoneOnMap(zone);
    const mapElement = document.getElementById('interactive-map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Alert Ticker */}
      <AlertBanner alerts={alerts} />

      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Citizen Flood Intelligence Dashboard
            </h1>
            <span className="text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time weather monitoring, AI-powered flood risk assessment, and verified safe zone routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Location Search Bar */}
      <LocationSearch />

      {/* Loading Overlay or Error Alert */}
      {loading && (
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-cyan-300 text-xs flex items-center justify-center gap-2 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Fetching live weather and river data for your location...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Probability Gauge & Environmental Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskGauge prediction={riskAssessment} />
        </div>

        <div className="lg:col-span-2 flex flex-col justify-between">
          <EnvironmentalCards
            environmentalData={environmentalData}
            features={features}
          />

          <div className="glass-panel rounded-xl p-4 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Target: <strong className="text-white">{selectedLocation?.name}</strong>
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              River Basin: {selectedLocation?.river_basin || 'Catchment Area'}
            </span>
          </div>
        </div>
      </div>

      {/* Explainable AI Risk Factors */}
      <RiskExplanation factors={riskAssessment?.contributing_factors} />

      {/* Interactive React-Leaflet Map */}
      <div id="interactive-map-section" className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Interactive Flood Map & Evacuation Routes</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Radius Inundation Boundary: {riskLevel === 'CRITICAL' ? '4.5km' : '2.5km'}
          </span>
        </div>

        <FloodMap
          centerLocation={selectedLocation}
          riskLevel={riskLevel}
          safeZones={nearbySafeZones}
          activeZone={selectedZoneOnMap}
          height="520px"
        />
      </div>

      {/* Verified Safe Zones List */}
      <SafeZoneList
        safeZones={nearbySafeZones}
        onSelectZone={handleSelectZone}
      />

      {/* Action Guidance & Emergency Protocol */}
      <ActionGuidance actions={recommendedActions} />

      {/* Slide-in Emergency Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        currentLocation={selectedLocation?.name}
        riskLevel={riskLevel}
        features={features}
      />
    </div>
  );
};
