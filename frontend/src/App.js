// frontend/src/App.js - REDIRECT TO LOGIN BY DEFAULT
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import ViewCertificatePage from './pages/ViewCertificatePage';
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
        {/* 🔹 DEFAULT ROUTE - REDIRECT TO LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        {/* 🔹 STUDENT REGISTER - PUBLIC (No login needed) */}
        <Route path="/student-register" element={<StudentRegisterPage />} />
        
        {/* 🔹 VIEW CERTIFICATE - PUBLIC (No login needed) */}
        <Route path="/view-certificate" element={<ViewCertificatePage />} />

        {/* 🔹 ADMIN DASHBOARD - Protected (University only) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['University']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔹 COMPANY DASHBOARD - Protected (Company only) */}
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute allowedRoles={['Company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔹 FALLBACK - Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;