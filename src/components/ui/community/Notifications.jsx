import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, CheckCircle, Trophy, Flag, X, Check } from 'lucide-react';
import { apiCall } from '../../../api/api';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId, relatedId) => {
    try {
      await apiCall(`/api/community/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      setNotifications(prev => 
        prev.map(n => 
          n.notification_id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (relatedId) {
        navigate(`/community/post/${relatedId}`);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'accepted_answer':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'moderation':
        return <Flag className="w-5 h-5 text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'reply':
        return 'rgba(59, 130, 246, 0.2)';
      case 'accepted_answer':
        return 'rgba(234, 179, 8, 0.2)';
      case 'moderation':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(148, 163, 184, 0.2)';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell className="w-8 h-8 text-blue-400" />
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
                Notifications
              </h1>
              <p style={{ opacity: 0.8 }}>
                Stay updated with your community activity
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}>
              {unreadCount} New
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <Bell className="w-16 h-16 mb-4 mx-auto opacity-50" />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              No Notifications Yet
            </h2>
            <p style={{ opacity: 0.7 }}>
              You'll see notifications here when people interact with your posts
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {notifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => markAsRead(notification.notification_id, notification.related_id)}
                style={{
                  background: notification.read 
                    ? 'rgba(30, 41, 59, 0.3)' 
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: notification.read 
                    ? '1px solid rgba(148, 163, 184, 0.2)' 
                    : '1px solid rgba(59, 130, 246, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {!notification.read && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)'
                  }} />
                )}
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <div style={{
                    padding: '12px',
                    background: getNotificationColor(notification.type),
                    borderRadius: '12px',
                    flexShrink: 0
                  }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          background: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0,
                          marginLeft: '8px'
                        }} />
                      )}
                    </div>
                    
                    <p style={{
                      opacity: 0.8,
                      lineHeight: '1.6',
                      marginBottom: '8px'
                    }}>
                      {notification.message}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '14px',
                        opacity: 0.6
                      }}>
                        {notification.time_ago}
                      </span>
                      
                      {notification.read ? (
                        <span style={{
                          fontSize: '12px',
                          color: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Check className="w-3 h-3" />
                          Read
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '12px',
                          color: '#3b82f6',
                          fontWeight: 'bold'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;