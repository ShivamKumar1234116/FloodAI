import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('floodshield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },
  getProfile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

export const locationsApi = {
  search: async (query) => {
    const res = await apiClient.get(`/locations/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
  getPresets: async () => {
    const res = await apiClient.get('/locations/presets');
    return res.data;
  },
};

export const predictionApi = {
  predictByCoords: async (latitude, longitude, locationName = 'Selected Area', historicalFlood = 0) => {
    const res = await apiClient.post('/prediction', {
      latitude,
      longitude,
      location_name: locationName,
      historical_flood: historicalFlood,
    });
    return res.data;
  },
  simulate: async (features) => {
    const res = await apiClient.post('/prediction/simulate', features);
    return res.data;
  },
};

export const weatherApi = {
  getWeather: async (lat, lng) => {
    const res = await apiClient.get(`/weather?lat=${lat}&lng=${lng}`);
    return res.data;
  },
};

export const riverApi = {
  getRiverStatus: async (lat, lng) => {
    const res = await apiClient.get(`/river?lat=${lat}&lng=${lng}`);
    return res.data;
  },
};

export const safeZonesApi = {
  getNearby: async (lat, lng, maxDist = 60) => {
    const res = await apiClient.get(`/safe-zones/nearby?lat=${lat}&lng=${lng}&max_dist=${maxDist}`);
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get('/safe-zones');
    return res.data;
  },
};

export const alertsApi = {
  getPublic: async () => {
    const res = await apiClient.get('/alerts');
    return res.data;
  },
  subscribe: async (data) => {
    const res = await apiClient.post('/alerts/subscribe', data);
    return res.data;
  },
};

export const chatbotApi = {
  sendQuery: async (message, location = 'Haridwar', riskLevel = 'LOW', features = {}) => {
    const res = await apiClient.post('/chatbot', {
      message,
      location,
      risk_level: riskLevel,
      features,
    });
    return res.data;
  },
};

export const adminApi = {
  getDashboard: async () => {
    const res = await apiClient.get('/admin/dashboard');
    return res.data;
  },
  getRiskAreas: async () => {
    const res = await apiClient.get('/admin/risk-areas');
    return res.data;
  },
  getPredictions: async () => {
    const res = await apiClient.get('/admin/predictions');
    return res.data;
  },
  getDataSources: async () => {
    const res = await apiClient.get('/admin/data-sources');
    return res.data;
  },
  createAlert: async (alertData) => {
    const res = await apiClient.post('/admin/alerts', alertData);
    return res.data;
  },
  updateAlert: async (id, alertData) => {
    const res = await apiClient.put(`/admin/alerts/${id}`, alertData);
    return res.data;
  },
  toggleAlert: async (id) => {
    const res = await apiClient.put(`/admin/alerts/${id}/toggle`);
    return res.data;
  },
  deleteAlert: async (id) => {
    const res = await apiClient.delete(`/admin/alerts/${id}`);
    return res.data;
  },
  createSafeZone: async (zoneData) => {
    const res = await apiClient.post('/admin/safe-zones', zoneData);
    return res.data;
  },
  updateSafeZone: async (id, zoneData) => {
    const res = await apiClient.put(`/admin/safe-zones/${id}`, zoneData);
    return res.data;
  },
  deleteSafeZone: async (id) => {
    const res = await apiClient.delete(`/admin/safe-zones/${id}`);
    return res.data;
  },
};

export default apiClient;
