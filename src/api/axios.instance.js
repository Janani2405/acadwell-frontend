// frontend/src/api/axios.instance.js
/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors for authentication and error handling
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to get token from storage
const getToken = () => {
  // ✅ CRITICAL: Check admin token FIRST
  return (
    localStorage.getItem('adminToken') ||
    sessionStorage.getItem('adminToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('studentToken') ||
    sessionStorage.getItem('studentToken') ||
    localStorage.getItem('teacherToken') ||
    sessionStorage.getItem('teacherToken') ||
    ''
  );
};

// Request interceptor - Add authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error ${status}:`, data);
      
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear tokens and redirect to login
          console.warn('⚠️ Unauthorized - clearing tokens');
          localStorage.clear();
          sessionStorage.clear();
          
          // Don't redirect if already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.warn('⚠️ Forbidden - insufficient permissions');
          break;
          
        case 404:
          // Not found
          console.warn('⚠️ Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('❌ Server error - please try again later');
          break;
          
        default:
          console.error(`❌ Unexpected error: ${status}`);
      }
      
      // Return structured error
      return Promise.reject({
        status,
        message: data.error || data.message || 'An error occurred',
        data
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ No response from server:', error.request);
      return Promise.reject({
        status: 0,
        message: 'No response from server. Please check your connection.',
        data: null
      });
    } else {
      // Something else happened
      console.error('❌ Request setup error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'Request failed',
        data: null
      });
    }
  }
);

export default axiosInstance;