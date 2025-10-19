// frontend/src/config/api.config.js
/**
 * API Configuration for AcadWell
 * Handles environment-based API URLs for development and production
 */

const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_APP_API_URL) {
    return import.meta.env.VITE_APP_API_URL;
  }

  // Get current host
  const currentHost = window.location.hostname;
  
  // Development URLs
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // Production URL (Render)
  if (import.meta.env.PROD) {
    return 'https://acadwell-backend.onrender.com'; // Replace with your actual Render URL
  }
  
  // Fallback to LAN IP for local network
  return `http://${currentHost}:5000`;
};

const getSocketUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_APP_SOCKET_URL) {
    return import.meta.env.VITE_APP_SOCKET_URL;
  }

  // Get current host
  const currentHost = window.location.hostname;
  
  // Development URLs
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // Production URL (Render)
  if (import.meta.env.PROD) {
    return 'https://acadwell-backend.onrender.com'; // Replace with your actual Render URL
  }
  
  // Fallback to LAN IP for local network
  return `http://${currentHost}:5000`;
};

// Export configuration
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  SOCKET_URL: getSocketUrl(),
  TIMEOUT: 30000, // 30 seconds
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER_STUDENT: '/api/auth/register/student',
      REGISTER_TEACHER: '/api/auth/register/teacher',
      REGISTER_OTHERS: '/api/auth/register/others',
      ME: '/api/auth/me',
      UPDATE_PROFILE: '/api/auth/update-profile',
      CHANGE_PASSWORD: '/api/auth/change-password'
    },
    
    // Admin
    ADMIN: {
      LOGIN: '/api/admin/login',
      ME: '/api/admin/me',
      VERIFY: '/api/admin/verify',
      DASHBOARD: '/api/admin/dashboard/overview',
      USERS: '/api/admin/users',
      USER_STATUS: (userId) => `/api/admin/users/${userId}/status`,
      DELETE_USER: (userId) => `/api/admin/users/${userId}`,
      ACTIVITY_LOGS: '/api/admin/activity-logs',
      POSTS: '/api/admin/posts',
      DELETE_POST: (postId) => `/api/admin/posts/${postId}`,
      MESSAGES: '/api/admin/messages',
      WELLNESS_ALERTS: '/api/admin/wellness/alerts'
    },
    
    // Community
    COMMUNITY: {
      FEED: '/api/community/feed',
      POST: '/api/community/post',
      POST_DETAIL: (postId) => `/api/community/post/${postId}`,
      ADD_ANSWER: (postId) => `/api/community/post/${postId}/answer`
    },
    
    // Wellness
    WELLNESS: {
      DASHBOARD: '/api/wellness/dashboard',
      LOG_MOOD: '/api/wellness/log-mood',
      MOOD_HISTORY: '/api/wellness/mood-history'
    },
    
    // Messages
    MESSAGES: {
      CONVERSATIONS: '/api/messages/conversations',
      CHAT_HISTORY: (convId) => `/api/messages/chat/${convId}`,
      SEND: (convId) => `/api/messages/send/${convId}`
    },
    
    // Grades
    GRADES: {
      MY_GRADES: '/api/student/my_grades',
      UPLOAD_GRADES: '/api/teacher/upload_grades',
      UPLOAD_HISTORY: '/api/teacher/my_uploads'
    },
    
    // Groups
    GROUPS: {
      CREATE: '/api/groups/create',
      MY_GROUPS: '/api/groups/my',
      SUGGESTIONS: '/api/groups/suggestions',
      JOIN: (groupId) => `/api/groups/${groupId}/join`,
      LEAVE: (groupId) => `/api/groups/${groupId}/leave`,
      DETAILS: (groupId) => `/api/groups/${groupId}`,
      MESSAGES: (groupId) => `/api/groups/${groupId}/messages`
    }
  }
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    socketUrl: API_CONFIG.SOCKET_URL,
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
  });
}

export default API_CONFIG;