// frontend/src/api/wellnessApi.js
import { apiCall } from './api';

/**
 * Wellness API Functions
 * All API calls related to mental health and wellness
 */

// ==================== MOOD LOGGING ====================

/**
 * Log a mood entry
 * @param {Object} moodData - { mood, emoji, note }
 * @returns {Promise}
 */
export const logMood = async (moodData) => {
  return await apiCall('/api/wellness/mood', {
    method: 'POST',
    body: JSON.stringify(moodData)
  });
};

/**
 * Get mood history
 * @param {number} days - Number of days to retrieve (default: 30)
 * @returns {Promise}
 */
export const getMoodHistory = async (days = 30) => {
  return await apiCall(`/api/wellness/mood/history?days=${days}`, {
    method: 'GET'
  });
};

// ==================== STUDENT DASHBOARD ====================

/**
 * Get student wellness dashboard data
 * @returns {Promise}
 */
export const getStudentWellnessDashboard = async () => {
  return await apiCall('/api/wellness/dashboard/student', {
    method: 'GET'
  });
};

/**
 * Get wellness resources
 * @returns {Promise}
 */
export const getWellnessResources = async () => {
  return await apiCall('/api/wellness/resources', {
    method: 'GET'
  });
};

// ==================== TEACHER DASHBOARD ====================

/**
 * Get teacher wellness overview
 * @returns {Promise}
 */
export const getTeacherWellnessOverview = async () => {
  return await apiCall('/api/wellness/dashboard/teacher', {
    method: 'GET'
  });
};

/**
 * Get student wellness details
 * @param {string} studentId - Student ID
 * @returns {Promise}
 */
export const getStudentWellnessDetails = async (studentId) => {
  return await apiCall(`/api/wellness/student/${studentId}/details`, {
    method: 'GET'
  });
};

/**
 * Add counselor note
 * @param {string} studentId - Student ID
 * @param {string} note - Counselor note
 * @returns {Promise}
 */
export const addCounselorNote = async (studentId, note) => {
  return await apiCall(`/api/wellness/student/${studentId}/note`, {
    method: 'POST',
    body: JSON.stringify({ note })
  });
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get mood emoji for display
 * @param {string} mood - Mood name
 * @returns {string} Emoji
 */
export const getMoodEmoji = (mood) => {
  const emojis = {
    'happy': '😊',
    'great': '😄',
    'okay': '😐',
    'neutral': '😶',
    'stressed': '😰',
    'worried': '😟',
    'sad': '😢',
    'down': '😔',
    'anxious': '😨',
    'overwhelmed': '😫',
    'depressed': '😞'
  };
  return emojis[mood?.toLowerCase()] || '😐';
};

/**
 * Get level color class
 * @param {string} level - Wellness level (green, yellow, orange, red)
 * @returns {string} Tailwind color class
 */
export const getLevelColor = (level) => {
  const colors = {
    'green': 'text-green-500',
    'yellow': 'text-yellow-500',
    'orange': 'text-orange-500',
    'red': 'text-red-500'
  };
  return colors[level] || 'text-gray-500';
};

/**
 * Get level background color
 * @param {string} level - Wellness level
 * @returns {string} Tailwind background class
 */
export const getLevelBgColor = (level) => {
  const colors = {
    'green': 'bg-green-500/20',
    'yellow': 'bg-yellow-500/20',
    'orange': 'bg-orange-500/20',
    'red': 'bg-red-500/20'
  };
  return colors[level] || 'bg-gray-500/20';
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};