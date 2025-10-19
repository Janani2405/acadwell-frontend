// frontend/src/components/ui/dashboards/others/NotificationsCard.jsx
import React, { useState, useEffect } from 'react';
import { Users, Clock, Heart, Award } from 'lucide-react';
import { apiCall } from '../../../../api/api';

const NotificationsCard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiCall('/api/notifications', { method: 'GET' });
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      // Use mock data on error
      setNotifications([
        { id: 1, text: 'New mentorship request from CS student', time: '30m ago', type: 'request' },
        { id: 2, text: 'Your career guidance session starts in 1 hour', time: '1h ago', type: 'reminder' },
        { id: 3, text: 'Community post got 5 new comments', time: '2h ago', type: 'engagement' },
        { id: 4, text: 'You earned the "Helpful Mentor" badge!', time: '1d ago', type: 'achievement' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      request: Users,
      reminder: Clock,
      engagement: Heart,
      achievement: Award
    };
    return icons[type] || Users;
  };

  if (loading) {
    return <div className="dashboard-card notifications-card loading">Loading notifications...</div>;
  }

  return (
    <div className="dashboard-card notifications-card">
      <h3 className="card-title">Notifications</h3>
      <p className="card-subtitle">Latest updates</p>
      
      <div className="notifications-list">
        {notifications.slice(0, 3).map((notification) => {
          const IconComponent = getNotificationIcon(notification.type);
          return (
            <div key={notification.id} className="notification-item">
              <div className={`notification-icon ${notification.type}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="notification-content">
                <p className="notification-text">{notification.text}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="view-all-notifications-btn">View All</button>
    </div>
  );
};

export default NotificationsCard;