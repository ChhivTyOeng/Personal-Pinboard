import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    if (localStorage.getItem('pinboard_logged_out') === 'true') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
