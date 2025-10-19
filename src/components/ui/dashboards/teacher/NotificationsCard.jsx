// ========== FILE 7: NotificationsCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/NotificationsCard.jsx
import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsCard = () => {
  const notifications = [
    { id: 1, text: 'New assignment submission from CS201', time: '15m ago' },
    { id: 2, text: 'Student query requires your attention', time: '1h ago' },
    { id: 3, text: 'Class CS101 scheduled in 30 minutes', time: '2h ago' },
  ];

  return (
    <div className="dashboard-card notifications-card">
      <h3 className="card-title">Notifications</h3>
      <p className="card-subtitle">Latest activities</p>
      
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <Bell className="notification-icon" />
            <div className="notification-content">
              <p className="notification-text">{notification.text}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-notifications-btn">View All</button>
    </div>
  );
};

export default NotificationsCard;