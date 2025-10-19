// ============================================================================
// FILE 1: Topbar.jsx
// Location: frontend/src/components/ui/dashboards/student/Topbar.jsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, UserCircle } from 'lucide-react';
import { apiCall } from '../../../../api/api'; // ADJUST THIS PATH IF NEEDED

const Topbar = ({ userName }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await apiCall('/api/community/notifications', {
        method: 'GET'
      });
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error('Error fetching notification count:', err);
      // Don't show error to user, just fail silently
    }
  };

  return (
    <header className="student-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search questions, resources, study groups..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <Link to='/community/notifications' style={{ textDecoration: 'none' }}>
          <button className="icon-btn notification-btn">
            <Bell className="icon" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
        </Link>
        
        <Link to='/dashboard/profile'>
          <button className="profile-btn">
            <UserCircle className="profile-icon" />
            <span className="profile-text">{userName}</span>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;