// ============================================================================
// FILE 2: NotificationsCard.jsx
// Location: frontend/src/components/ui/dashboards/student/NotificationsCard.jsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import { MessageSquare, Bell, Users, Trophy, Flag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../../api/api'; // ADJUST THIS PATH IF NEEDED

const NotificationsCard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/community/notifications', {
        method: 'GET'
      });
      // Get only the 3 most recent notifications
      setNotifications(data.notifications?.slice(0, 3) || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      // Fallback to mock data if API fails
      setNotifications([
        { 
          notification_id: '1', 
          title: 'Community Activity',
          message: 'Check out the community for new discussions', 
          time_ago: '2h ago', 
          type: 'reply',
          read: false 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="w-4 h-4" />;
      case 'accepted_answer':
        return <Trophy className="w-4 h-4" />;
      case 'moderation':
        return <Flag className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    try {
      await apiCall(`/api/community/notifications/${notification.notification_id}/read`, {
        method: 'PUT'
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }

    // Navigate to related content or notifications page
    if (notification.related_id) {
      navigate(`/community/post/${notification.related_id}`);
    } else {
      navigate('/community/notifications');
    }
  };

  const handleViewAll = () => {
    navigate('/community/notifications');
  };

  if (loading) {
    return (
      <div className="dashboard-card notifications-card">
        <h3 className="card-title">Notifications</h3>
        <p className="card-subtitle">Stay updated with activities</p>
        <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card notifications-card">
      <h3 className="card-title">Notifications</h3>
      <p className="card-subtitle">Stay updated with activities</p>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            opacity: 0.6,
            fontSize: '14px' 
          }}>
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.notification_id} 
              className="notification-item"
              onClick={() => handleNotificationClick(n)}
              style={{ 
                cursor: 'pointer',
                opacity: n.read ? 0.7 : 1,
                position: 'relative'
              }}
            >
              {!n.read && (
                <div style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '6px',
                  height: '6px',
                  background: '#3b82f6',
                  borderRadius: '50%'
                }} />
              )}
              
              <div className={`notification-icon ${n.type}`}>
                {getNotificationIcon(n.type)}
              </div>
              
              <div className="notification-content">
                <p className="notification-text" style={{ 
                  fontWeight: n.read ? 'normal' : 'bold' 
                }}>
                  {n.message}
                </p>
                <span className="notification-time">{n.time_ago}</span>
              </div>
              
              <ChevronRight 
                className="w-4 h-4" 
                style={{ 
                  opacity: 0.4, 
                  marginLeft: 'auto',
                  flexShrink: 0 
                }} 
              />
            </div>
          ))
        )}
      </div>

      <button 
        className="view-all-notifications-btn"
        onClick={handleViewAll}
      >
        View All Notifications
      </button>
    </div>
  );
};

export default NotificationsCard;