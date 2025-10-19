// frontend/src/api/communityApi.js
import { apiCall } from './api';

/**
 * Community API Functions
 * All API calls related to community posts, replies, and discussions
 */

// ==================== POSTS ====================

/**
 * Get all community posts
 * @returns {Promise}
 */
export const getPosts = async () => {
  return await apiCall('/api/community/posts', {
    method: 'GET'
  });
};

/**
 * Get detailed post with replies
 * @param {string} postId - Post ID
 * @returns {Promise}
 */
export const getPostDetail = async (postId) => {
  return await apiCall(`/api/community/posts/${postId}`, {
    method: 'GET'
  });
};

/**
 * Create a new community post
 * @param {Object} postData - { title, description, category, tags, is_anonymous }
 * @returns {Promise}
 */
export const createPost = async (postData) => {
  return await apiCall('/api/community/posts', {
    method: 'POST',
    body: JSON.stringify(postData)
  });
};

/**
 * Update an existing post
 * @param {string} postId - Post ID
 * @param {Object} postData - { title, description, tags }
 * @returns {Promise}
 */
export const updatePost = async (postId, postData) => {
  return await apiCall(`/api/community/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(postData)
  });
};

/**
 * Delete a post
 * @param {string} postId - Post ID
 * @returns {Promise}
 */
export const deletePost = async (postId) => {
  return await apiCall(`/api/community/posts/${postId}`, {
    method: 'DELETE'
  });
};

/**
 * Like a post
 * @param {string} postId - Post ID
 * @returns {Promise}
 */
export const likePost = async (postId) => {
  return await apiCall(`/api/community/posts/${postId}/like`, {
    method: 'POST'
  });
};

/**
 * Report a post
 * @param {string} postId - Post ID
 * @param {Object} reportData - { reason, description }
 * @returns {Promise}
 */
export const reportPost = async (postId, reportData) => {
  return await apiCall(`/api/community/posts/${postId}/report`, {
    method: 'POST',
    body: JSON.stringify(reportData)
  });
};

/**
 * Share a post
 * @param {string} postId - Post ID
 * @returns {Promise}
 */
export const sharePost = async (postId) => {
  return await apiCall(`/api/community/posts/${postId}/share`, {
    method: 'POST'
  });
};

// ==================== REPLIES ====================

/**
 * Create a reply to a post
 * @param {string} postId - Post ID
 * @param {Object} replyData - { content, is_anonymous, parent_reply_id (optional) }
 * @returns {Promise}
 */
export const createReply = async (postId, replyData) => {
  return await apiCall(`/api/community/posts/${postId}/replies`, {
    method: 'POST',
    body: JSON.stringify(replyData)
  });
};

/**
 * Update a reply
 * @param {string} replyId - Reply ID
 * @param {Object} replyData - { content }
 * @returns {Promise}
 */
export const updateReply = async (replyId, replyData) => {
  return await apiCall(`/api/community/replies/${replyId}`, {
    method: 'PUT',
    body: JSON.stringify(replyData)
  });
};

/**
 * Delete a reply
 * @param {string} replyId - Reply ID
 * @returns {Promise}
 */
export const deleteReply = async (replyId) => {
  return await apiCall(`/api/community/replies/${replyId}`, {
    method: 'DELETE'
  });
};

/**
 * Like a reply
 * @param {string} replyId - Reply ID
 * @returns {Promise}
 */
export const likeReply = async (replyId) => {
  return await apiCall(`/api/community/replies/${replyId}/like`, {
    method: 'POST'
  });
};

/**
 * Dislike a reply
 * @param {string} replyId - Reply ID
 * @returns {Promise}
 */
export const dislikeReply = async (replyId) => {
  return await apiCall(`/api/community/replies/${replyId}/dislike`, {
    method: 'POST'
  });
};

/**
 * Accept a reply as the answer
 * @param {string} replyId - Reply ID
 * @returns {Promise}
 */
export const acceptReply = async (replyId) => {
  return await apiCall(`/api/community/replies/${replyId}/accept`, {
    method: 'POST'
  });
};

/**
 * Report a reply
 * @param {string} replyId - Reply ID
 * @param {Object} reportData - { reason, description }
 * @returns {Promise}
 */
export const reportReply = async (replyId, reportData) => {
  return await apiCall(`/api/community/replies/${replyId}/report`, {
    method: 'POST',
    body: JSON.stringify(reportData)
  });
};

// ==================== NOTIFICATIONS ====================

/**
 * Get user notifications
 * @returns {Promise}
 */
export const getNotifications = async () => {
  return await apiCall('/api/community/notifications', {
    method: 'GET'
  });
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise}
 */
export const markNotificationRead = async (notificationId) => {
  return await apiCall(`/api/community/notifications/${notificationId}/read`, {
    method: 'PUT'
  });
};

// ==================== MODERATION ====================

/**
 * Get reports (counselors/teachers only)
 * @returns {Promise}
 */
export const getReports = async () => {
  return await apiCall('/api/community/moderation/reports', {
    method: 'GET'
  });
};

/**
 * Resolve a report (counselors/teachers only)
 * @param {string} reportId - Report ID
 * @param {Object} resolveData - { action: 'dismiss' | 'delete_content' | 'warn_user' }
 * @returns {Promise}
 */
export const resolveReport = async (reportId, resolveData) => {
  return await apiCall(`/api/community/moderation/reports/${reportId}/resolve`, {
    method: 'PUT',
    body: JSON.stringify(resolveData)
  });
};