import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapLegend } from './MapLegend';
import { ShieldCheck, Navigation, Phone, MapPin } from 'lucide-react';

// Center updater helper component
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 12, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Custom DivIcons to prevent broken png icon issues in Vite
const createUserIcon = () =>
  L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 26px; height: 26px; border-radius: 9999px; background: rgba(6, 182, 212, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="width: 16px; height: 16px; border-radius: 9999px; background: #06b6d4; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

const createSafeZoneIcon = () =>
  L.divIcon({
    className: 'custom-safezone-icon',
    html: `
      <div style="width: 32px; height: 32px; background: #10b981; border: 2px solid #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

export const FloodMap = ({
  centerLocation,
  riskLevel = 'LOW',
  safeZones = [],
  activeZone = null,
  height = '500px',
}) => {
  const centerLat = centerLocation?.latitude || 29.9457;
  const centerLng = centerLocation?.longitude || 78.1642;
  const locationName = centerLocation?.name || 'Monitored Target Location';

  const riskColors = {
    LOW: { stroke: '#10B981', fill: '#10B981', opacity: 0.15 },
    MEDIUM: { stroke: '#F59E0B', fill: '#F59E0B', opacity: 0.25 },
    HIGH: { stroke: '#F97316', fill: '#F97316', opacity: 0.35 },
    CRITICAL: { stroke: '#EF4444', fill: '#EF4444', opacity: 0.45 },
  }[riskLevel] || { stroke: '#10B981', fill: '#10B981', opacity: 0.2 };

  // Determine evacuation route line
  // If activeZone is provided or default to nearest safe zone
  const targetSafeZone = activeZone || (safeZones && safeZones[0]);
  const routeCoords = targetSafeZone?.route_coordinates || (
    targetSafeZone
      ? [
          [centerLat, centerLng],
          [(centerLat + targetSafeZone.latitude) / 2 + 0.002, (centerLng + targetSafeZone.longitude) / 2 - 0.002],
          [targetSafeZone.latitude, targetSafeZone.longitude],
        ]
      : null
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapViewUpdater center={[centerLat, centerLng]} zoom={12} />

        {/* Clean OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Risk Perimeter Inundation Circle */}
        <Circle
          center={[centerLat, centerLng]}
          radius={riskLevel === 'CRITICAL' ? 4500 : riskLevel === 'HIGH' ? 3500 : 2500}
          pathOptions={{
            color: riskColors.stroke,
            fillColor: riskColors.fill,
            fillOpacity: riskColors.opacity,
            weight: 2,
            dashArray: riskLevel === 'CRITICAL' ? '6, 6' : undefined,
          }}
        />

        {/* User Location Marker */}
        <Marker position={[centerLat, centerLng]} icon={createUserIcon()}>
          <Popup>
            <div className="p-1 text-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-sm mb-1 text-cyan-400">
                <MapPin className="w-4 h-4" />
                <span>{locationName}</span>
              </div>
              <p className="text-xs text-slate-300">
                Current Assessed Risk: <strong className="uppercase" style={{ color: riskColors.stroke }}>{riskLevel}</strong>
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Lat: {centerLat.toFixed(4)}, Lng: {centerLng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Verified Safe Zone Markers */}
        {safeZones.map((zone) => {
          const zLat = zone.latitude;
          const zLng = zone.longitude;
          if (!zLat || !zLng) return null;

          return (
            <Marker key={zone._id || `${zLat}-${zLng}`} position={[zLat, zLng]} icon={createSafeZoneIcon()}>
              <Popup>
                <div className="p-1 max-w-[240px] text-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-400 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{zone.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-1">{zone.address}</p>
                  <div className="text-[11px] text-slate-400 space-y-0.5 mb-2 font-mono">
                    <p>Capacity: {zone.capacity} (Avail: {zone.available_capacity ?? (zone.capacity - (zone.current_occupancy || 0))})</p>
                    {zone.distance_km !== undefined && <p>Distance: {zone.distance_km} km</p>}
                    {zone.contact && <p>Contact: {zone.contact}</p>}
                  </div>
                  <a
                    href={zone.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${zLat},${zLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                  >
                    <Navigation className="w-3 h-3" /> Navigate Here
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Evacuation Route Polyline */}
        {routeCoords && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#06b6d4',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8',
            }}
          />
        )}
      </MapContainer>

      {/* Floating Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto">
        <MapLegend />
      </div>
    </div>
  );
};
