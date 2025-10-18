// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// UPDATE: The component now accepts a list of allowed roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If roles are specified and the user's role is not in the list, redirect
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect non-admins to the verify page
    return <Navigate to="/verify" />;
  }

  return children;
};

export default ProtectedRoute;