import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FloodProvider } from './context/FloodContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { RiskMapPage } from './pages/RiskMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { SafeZonesPage } from './pages/SafeZonesPage';
import { AssistantPage } from './pages/AssistantPage';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAlerts } from './pages/admin/AdminAlerts';
import { AdminSafeZones } from './pages/admin/AdminSafeZones';
import { AdminDataSources } from './pages/admin/AdminDataSources';

// Protected Admin Route Guard
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FloodProvider>
          <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                {/* Public Citizen & Information Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/risk-map" element={<RiskMapPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/safe-zones" element={<SafeZonesPage />} />
                <Route path="/assistant" element={<AssistantPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Disaster Admin Operations Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/risk-map"
                  element={
                    <AdminRoute>
                      <RiskMapPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/alerts"
                  element={
                    <AdminRoute>
                      <AdminAlerts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/safe-zones"
                  element={
                    <AdminRoute>
                      <AdminSafeZones />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/data-sources"
                  element={
                    <AdminRoute>
                      <AdminDataSources />
                    </AdminRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </FloodProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
