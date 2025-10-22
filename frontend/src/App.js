// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import DownloadCertificatePage from './pages/DownloadCertificatePage';
import AdminDashboard from './pages/AdminDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import VerifyPage from './pages/VerifyPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes (Login required) */}
        <Route path="/student-register" element={<ProtectedRoute><StudentRegisterPage /></ProtectedRoute>} />
        <Route path="/download-certificate" element={<ProtectedRoute><DownloadCertificatePage /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><VerifyPage /></ProtectedRoute>} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['University']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute allowedRoles={['Company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;