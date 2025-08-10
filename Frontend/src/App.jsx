import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import SubmitBid from './pages/vendor/SubmitBid';
import CreateTender from './pages/institute/CreateTender';

// Institute Pages
import InstituteDashboard from './pages/institute/InstituteDashboard';
import TenderBids from './pages/institute/TenderBids';

import { USER_ROLES } from './utils/constants';

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    return user?.role === USER_ROLES.VENDOR ? '/vendor/dashboard' : '/institute/dashboard';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Register />} 
      />
      
      {/* Vendor Routes */}
      <Route 
        path="/vendor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]}>
            <VendorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendor/submit-bid" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]}>
            <SubmitBid />
          </ProtectedRoute>
        } 
      />
      
      {/* Institute Routes */}
      <Route 
        path="/institute/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.INSTITUTE]}>
            <InstituteDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/institute/tender/:tenderId/bids" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.INSTITUTE]}>
            <TenderBids />
          </ProtectedRoute>
        } 
      />
      <Route path="/institute/create" element={<CreateTender />} />
      
      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;