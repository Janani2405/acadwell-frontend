// frontend/src/api.js
// Complete API configuration with token handling and FormData support

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_APP_API_URL) {
    return import.meta.env.VITE_APP_API_URL;
  }

  const currentHost = window.location.hostname;
  
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000';
  } else {
    return `http://${currentHost}:5000`;
  }
};

const getSocketUrl = () => {
  if (import.meta.env.VITE_APP_SOCKET_URL) {
    return import.meta.env.VITE_APP_SOCKET_URL;
  }

  const currentHost = window.location.hostname;
  
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000';
  } else {
    return `http://${currentHost}:5000`;
  }
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getSocketUrl();

console.log('API Configuration:', {
  apiUrl: API_BASE_URL,
  socketUrl: SOCKET_URL,
  currentHost: window.location.hostname,
  envApiUrl: import.meta.env.VITE_APP_API_URL,
  nodeEnv: import.meta.env.MODE
});

// Helper function to get token from multiple possible storage locations
const getToken = () => {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('studentToken') ||
    sessionStorage.getItem('studentToken') ||
    localStorage.getItem('teacherToken') ||
    sessionStorage.getItem('teacherToken') ||
    ''
  );
};

// Main API call function with proper FormData and token handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {},
  };

  // Only add Content-Type if body is NOT FormData
  if (options.body && !(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  // Add custom headers if provided
  if (options.headers) {
    Object.assign(defaultOptions.headers, options.headers);
  }

  // Get token and add to Authorization header
  const token = getToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
    console.log('Token found and added to request');
  } else {
    console.warn('No token found - request will be unauthorized');
  }

  try {
    console.log(`API Call: ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// ==================== GRADES API ====================
export const gradesApi = {
  // Student: Fetch my grades
  fetchMyGrades: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      return await apiCall('/api/student/my_grades', {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw error;
    }
  },

  // Teacher: Upload grades from file
  uploadGrades: async (file, date, semester, department, testType) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!file) {
        throw new Error('File is required');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('date', date);
      formData.append('semester', semester);
      formData.append('department', department);
      formData.append('testType', testType);

      return await apiCall('/api/teacher/upload_grades', {
        method: 'POST',
        body: formData
        // Do NOT set Content-Type header - browser will set it with boundary
      });
    } catch (error) {
      console.error('Error uploading grades:', error);
      throw error;
    }
  },

  // Teacher: Fetch upload history
  fetchUploadHistory: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      return await apiCall('/api/teacher/my_uploads', {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching upload history:', error);
      throw error;
    }
  }
};

// ==================== WELLNESS API ====================
export const wellnessApi = {
  // Get wellness dashboard data
  getDashboard: async () => {
    return apiCall('/api/wellness/dashboard', {
      method: 'GET'
    });
  },

  // Log mood
  logMood: async (moodData) => {
    return apiCall('/api/wellness/log-mood', {
      method: 'POST',
      body: JSON.stringify(moodData)
    });
  },

  // Get mood history
  getMoodHistory: async () => {
    return apiCall('/api/wellness/mood-history', {
      method: 'GET'
    });
  }
};

// ==================== COMMUNITY API ====================
export const communityApi = {
  // Get feed posts
  getFeed: async () => {
    return apiCall('/api/community/feed', {
      method: 'GET'
    });
  },

  // Create post
  createPost: async (postData) => {
    return apiCall('/api/community/post', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  // Get post detail
  getPost: async (postId) => {
    return apiCall(`/api/community/post/${postId}`, {
      method: 'GET'
    });
  },

  // Add answer to post
  addAnswer: async (postId, answerData) => {
    return apiCall(`/api/community/post/${postId}/answer`, {
      method: 'POST',
      body: JSON.stringify(answerData)
    });
  }
};

// ==================== MESSAGES API ====================
export const messagesApi = {
  // Get conversations
  getConversations: async () => {
    return apiCall('/api/messages/conversations', {
      method: 'GET'
    });
  },

  // Get chat history
  getChatHistory: async (conversationId) => {
    return apiCall(`/api/messages/chat/${conversationId}`, {
      method: 'GET'
    });
  },

  // Send message
  sendMessage: async (conversationId, messageData) => {
    return apiCall(`/api/messages/send/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }
};

// ==================== PROFILE API ====================
export const profileApi = {
  // Get current user profile
  getProfile: async () => {
    return apiCall('/api/profile/me', {
      method: 'GET'
    });
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiCall('/api/profile/update', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Get other user profile
  getUserProfile: async (userId) => {
    return apiCall(`/api/profile/user/${userId}`, {
      method: 'GET'
    });
  }
};

// ==================== AUTH API ====================
export const authApi = {
  // Login
  login: async (email, password) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Register student
  registerStudent: async (studentData) => {
    return apiCall('/api/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  // Register teacher
  registerTeacher: async (teacherData) => {
    return apiCall('/api/auth/register/teacher', {
      method: 'POST',
      body: JSON.stringify(teacherData)
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiCall('/api/auth/me', {
      method: 'GET'
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('studentToken');
    sessionStorage.removeItem('studentToken');
    localStorage.removeItem('teacherToken');
    sessionStorage.removeItem('teacherToken');
  }
};

// ==================== GROUPS API ====================
export const groupsApi = {
  // Create new study group
  createGroup: async (name, description = '', isPrivate = false) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!name || name.trim().length === 0) {
        throw new Error('Group name is required');
      }

      const response = await apiCall('/api/groups/create', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          isPrivate: Boolean(isPrivate)
        })
      });

      console.log('Group created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  // Get all my study groups
  getMyGroups: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiCall('/api/groups/my', {
        method: 'GET'
      });

      console.log('My groups fetched:', response);
      return response;
    } catch (error) {
      console.error('Error fetching my groups:', error);
      throw error;
    }
  },

  // Get suggested public groups
  getSuggestedGroups: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiCall('/api/groups/suggestions', {
        method: 'GET'
      });

      console.log('Suggested groups fetched:', response);
      return response;
    } catch (error) {
      console.error('Error fetching suggested groups:', error);
      throw error;
    }
  },

  // Join a study group
  joinGroup: async (groupId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!groupId) {
        throw new Error('Group ID is required');
      }

      const response = await apiCall(`/api/groups/${groupId}/join`, {
        method: 'POST'
      });

      console.log('Joined group:', response);
      return response;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  },

  // Leave a study group
  leaveGroup: async (groupId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!groupId) {
        throw new Error('Group ID is required');
      }

      const response = await apiCall(`/api/groups/${groupId}/leave`, {
        method: 'POST'
      });

      console.log('Left group:', response);
      return response;
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  },

  // Get detailed information about a specific group
  getGroupDetails: async (groupId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!groupId) {
        throw new Error('Group ID is required');
      }

      const response = await apiCall(`/api/groups/${groupId}`, {
        method: 'GET'
      });

      console.log('Group details fetched:', response);
      return response;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    }
  },

  // Get all messages in a group
  getGroupMessages: async (groupId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!groupId) {
        throw new Error('Group ID is required');
      }

      const response = await apiCall(`/api/groups/${groupId}/messages`, {
        method: 'GET'
      });

      console.log('Group messages fetched:', response);
      return response;
    } catch (error) {
      console.error('Error fetching group messages:', error);
      throw error;
    }
  },

  // Send a message to a group
  sendGroupMessage: async (groupId, messageText) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!groupId) {
        throw new Error('Group ID is required');
      }

      if (!messageText || messageText.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      const response = await apiCall(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          message: messageText.trim()
        })
      });

      console.log('Message sent to group:', response);
      return response;
    } catch (error) {
      console.error('Error sending group message:', error);
      throw error;
    }
  }
};