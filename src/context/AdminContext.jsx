// frontend/src/context/AdminContext.jsx
/**
 * Admin Context for Global Admin State Management
 * Provides admin authentication state and functions throughout the app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/admin.api';

// Create Admin Context
const AdminContext = createContext(null);

// Admin Context Provider Component
export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if admin is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if admin token exists and is valid
   */
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const storedAdmin = localStorage.getItem('adminUser');

      if (token && storedAdmin) {
        // Verify token with backend
        const response = await adminApi.verify();
        
        if (response.valid) {
          setAdmin(JSON.parse(storedAdmin));
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Admin login
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @returns {Promise<boolean>} - Success status
   */
  const login = async (username, password) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await adminApi.login(username, password);
      
      if (response.token && response.admin) {
        setAdmin(response.admin);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Admin logout
   */
  const logout = () => {
    adminApi.logout();
    clearAuthData();
  };

  /**
   * Clear authentication data
   */
  const clearAuthData = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    setError(null);
  };

  /**
   * Refresh admin data
   */
  const refreshAdminData = async () => {
    try {
      const response = await adminApi.getMe();
      setAdmin(response);
      localStorage.setItem('adminUser', JSON.stringify(response));
    } catch (error) {
      console.error('Failed to refresh admin data:', error);
    }
  };

  // Context value
  const value = {
    admin,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAdminData,
    setError
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use Admin Context
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  
  return context;
};

export default AdminContext;