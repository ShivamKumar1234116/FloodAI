import React, { createContext, useContext, useState, useEffect } from 'react';
import { predictionApi, alertsApi, locationsApi } from '../services/api';

const FloodContext = createContext(null);

export const DEFAULT_LOCATION = {
  name: 'Haridwar, Uttarakhand, India',
  latitude: 29.9457,
  longitude: 78.1642,
  river_basin: 'Ganga Basin',
  historical_flood: 1,
};

export const FloodProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [presets, setPresets] = useState([]);

  // Fetch initial alerts and presets
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [alertRes, presetRes] = await Promise.all([
          alertsApi.getPublic().catch(() => ({ alerts: [] })),
          locationsApi.getPresets().catch(() => []),
        ]);
        setAlerts(alertRes.alerts || []);
        setPresets(presetRes || []);
      } catch (err) {
        console.error('Error loading metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Run initial assessment for default location (Haridwar)
  useEffect(() => {
    assessLocation(DEFAULT_LOCATION);
  }, []);

  const assessLocation = async (loc) => {
    setLoading(true);
    setError(null);
    try {
      setSelectedLocation(loc);
      const data = await predictionApi.predictByCoords(
        loc.latitude,
        loc.longitude,
        loc.name,
        loc.historical_flood || 0
      );
      setAssessmentData(data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Unable to fetch flood risk data for this location. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FloodContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        assessmentData,
        loading,
        error,
        alerts,
        presets,
        assessLocation,
      }}
    >
      {children}
    </FloodContext.Provider>
  );
};

export const useFlood = () => {
  const context = useContext(FloodContext);
  if (!context) {
    throw new Error('useFlood must be used within a FloodProvider');
  }
  return context;
};
