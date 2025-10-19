// frontend/src/api/admin.api.js
/**
 * Admin API Functions
 * All API calls for admin dashboard operations
 */

import axiosInstance from './axios.instance';
import { API_CONFIG } from '../config/api.config';

export const adminApi = {
  // ==================== AUTHENTICATION ====================
  
  /**
   * Admin login
   * @param {string} username - Admin username or email
   * @param {string} password - Admin password
   * @returns {Promise} - Login response with token
   */
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.ADMIN.LOGIN, {
        username,
        password
      });
      
      // Store admin token
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      }
      
      return response.data;
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    }
  },
  
  /**
   * Get current admin info
   * @returns {Promise} - Admin user data
   */
  getMe: async () => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.ADMIN.ME);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin info:', error);
      throw error;
    }
  },
  
  /**
   * Verify admin token
   * @returns {Promise} - Token validity
   */
  verify: async () => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.ADMIN.VERIFY);
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },
  
  /**
   * Logout admin
   */
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
  },
  
  // ==================== DASHBOARD ====================
  
  /**
   * Get dashboard overview statistics
   * @returns {Promise} - Dashboard stats
   */
  getDashboardOverview: async () => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error);
      throw error;
    }
  },
  
  // ==================== USER MANAGEMENT ====================
  
  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters (page, limit, role, search)
   * @returns {Promise} - Users list
   */
  getUsers: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.ADMIN.USERS, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },
  
  /**
   * Delete a user (soft delete)
   * @param {string} userId - User ID to delete
   * @returns {Promise} - Delete confirmation
   */
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(
        API_CONFIG.ENDPOINTS.ADMIN.DELETE_USER(userId)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
  
  /**
   * Suspend or activate a user
   * @param {string} userId - User ID
   * @param {boolean} isActive - Active status
   * @returns {Promise} - Update confirmation
   */
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await axiosInstance.put(
        API_CONFIG.ENDPOINTS.ADMIN.USER_STATUS(userId),
        { is_active: isActive }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    }
  },
  
  // ==================== CONTENT MODERATION ====================
  
  /**
   * Get all posts with filters
   * @param {Object} params - Query parameters
   * @returns {Promise} - Posts list
   */
  getPosts: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.ADMIN.POSTS, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  },
  
  /**
   * Delete a post
   * @param {string} postId - Post ID to delete
   * @returns {Promise} - Delete confirmation
   */
  deletePost: async (postId) => {
    try {
      const response = await axiosInstance.delete(
        API_CONFIG.ENDPOINTS.ADMIN.DELETE_POST(postId)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  },
  
  // ==================== CONTENT MODERATION ====================
  
  /**
   * Get all posts with filters
   * @param {Object} params - Query parameters (page, limit, search, flagged)
   * @returns {Promise} - Posts list
   */
  getPosts: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/admin/content/posts', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  },
  
  /**
   * Get detailed post with all answers
   * @param {string} postId - Post ID
   * @returns {Promise} - Post details
   */
  getPostDetail: async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/content/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch post detail:', error);
      throw error;
    }
  },
  
  /**
   * Delete a post
   * @param {string} postId - Post ID to delete
   * @returns {Promise} - Delete confirmation
   */
  deletePost: async (postId) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/content/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  },
  
  /**
   * Delete an answer from a post
   * @param {string} postId - Post ID
   * @param {string} answerId - Answer ID to delete
   * @returns {Promise} - Delete confirmation
   */
  deleteAnswer: async (postId, answerId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/admin/content/posts/${postId}/answers/${answerId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete answer:', error);
      throw error;
    }
  },
  
  /**
   * Update/edit a post
   * @param {string} postId - Post ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} - Update confirmation
   */
  updatePost: async (postId, updateData) => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/content/posts/${postId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  },
  
  /**
   * Get content statistics
   * @returns {Promise} - Content stats
   */
  getContentStats: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/content/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch content stats:', error);
      throw error;
    }
  },
  
  /**
   * Get all messages with filters
   * @param {Object} params - Query parameters
   * @returns {Promise} - Messages list
   */
  getMessages: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/admin/content/messages', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  },
  
  // ==================== WELLNESS MONITORING ====================
  
  /**
   * Get wellness alerts
   * @param {Object} params - Query parameters (severity, resolved)
   * @returns {Promise} - Wellness alerts list
   */
  getWellnessAlerts: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.ENDPOINTS.ADMIN.WELLNESS_ALERTS,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wellness alerts:', error);
      throw error;
    }
  },
  
  // ==================== ACTIVITY LOGS ====================
  
  /**
   * Get admin activity logs
   * @param {Object} params - Query parameters (page, limit)
   * @returns {Promise} - Activity logs
   */
  getActivityLogs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.ENDPOINTS.ADMIN.ACTIVITY_LOGS,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      throw error;
    }
  }
};

export default adminApi;