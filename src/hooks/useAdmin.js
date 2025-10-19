// frontend/src/hooks/useAdmin.js
/**
 * Custom Hook for Admin Operations
 * Provides convenient access to admin API functions with state management
 */

import { useState, useCallback } from 'react';
import { adminApi } from '../api/admin.api';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch dashboard overview statistics
   */
  const fetchDashboardOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardOverview();
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch users with filters
   */
  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getUsers(params);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a user
   */
  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.deleteUser(userId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Toggle user status (suspend/activate)
   */
  const toggleUserStatus = useCallback(async (userId, isActive) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.toggleUserStatus(userId, isActive);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update user status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch posts for moderation
   */
  const fetchPosts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getPosts(params);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a post
   */
  const deletePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.deletePost(postId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch wellness alerts
   */
  const fetchWellnessAlerts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getWellnessAlerts(params);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch wellness alerts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch activity logs
   */
  const fetchActivityLogs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getActivityLogs(params);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch activity logs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    fetchDashboardOverview,
    fetchUsers,
    deleteUser,
    toggleUserStatus,
    fetchPosts,
    deletePost,
    fetchWellnessAlerts,
    fetchActivityLogs
  };
};

export default useAdmin;