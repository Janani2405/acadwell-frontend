// frontend/src/routes/AdminRoute.jsx
/**
 * Admin Route Protection Component
 * Ensures only authenticated admins can access admin routes
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminContext } from '../context/AdminContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render protected component if authenticated
  return children;
};

export default AdminRoute;