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
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Student Routes - Public (No login needed) */}
        <Route path="/student-register" element={<StudentRegisterPage />} />
        <Route path="/download-certificate" element={<DownloadCertificatePage />} />

        {/* Admin Dashboard - Protected (Login required) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['University']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Company Dashboard - Protected (Login required) */}
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute allowedRoles={['Company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Default route - redirect to student register */}
        <Route path="/" element={<Navigate to="/student-register" />} />
      </Routes>
    </Router>
  );
}

export default App;