// ============================================================
// FILE 6: frontend/src/components/ui/dashboards/student/tabs/SettingsTab.jsx
// ============================================================
import React from 'react';
import { apiCall } from '../../../../../api/api';

const SettingsTab = ({ studentData, setStudentData }) => {
  const handlePrivacyToggle = async (field) => {
    try {
      const newPrivacy = {
        ...studentData.privacy,
        [field]: !studentData.privacy[field]
      };
      
      await apiCall('/api/profile/profile/privacy', {
        method: 'PUT',
        body: JSON.stringify(newPrivacy)
      });
      
      setStudentData(prev => ({
        ...prev,
        privacy: newPrivacy
      }));
    } catch (err) {
      console.error('Error updating privacy:', err);
      alert('Failed to update privacy settings.');
    }
  };

  const handleNotificationToggle = async (field) => {
    try {
      const newNotifications = {
        ...studentData.notifications,
        [field]: !studentData.notifications[field]
      };
      
      await apiCall('/api/profile/profile/notifications', {
        method: 'PUT',
        body: JSON.stringify(newNotifications)
      });
      
      setStudentData(prev => ({
        ...prev,
        notifications: newNotifications
      }));
    } catch (err) {
      console.error('Error updating notifications:', err);
      alert('Failed to update notification settings.');
    }
  };

  return (
    <div className="profile-tab-content">
      <div className="profile-section-card">
        <h3 className="section-title">Privacy Settings</h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Full Name</h4>
              <p className="setting-description">Display your full name in community</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.privacy.showFullName}
                onChange={() => handlePrivacyToggle('showFullName')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Email</h4>
              <p className="setting-description">Make email visible to other students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.privacy.showEmail}
                onChange={() => handlePrivacyToggle('showEmail')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Anonymous Mode</h4>
              <p className="setting-description">Show as "Anonymous Learner" in community</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.privacy.anonymousMode}
                onChange={() => handlePrivacyToggle('anonymousMode')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Notification Preferences</h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Assignment Reminders</h4>
              <p className="setting-description">Get notified about upcoming deadlines</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.assignmentReminders}
                onChange={() => handleNotificationToggle('assignmentReminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Wellness Nudges</h4>
              <p className="setting-description">Daily mood logging reminders</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.wellnessNudges}
                onChange={() => handleNotificationToggle('wellnessNudges')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Peer Messages</h4>
              <p className="setting-description">Notifications from study group members</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.peerMessages}
                onChange={() => handleNotificationToggle('peerMessages')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Grade Updates</h4>
              <p className="setting-description">Get notified when grades are posted</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.gradeUpdates}
                onChange={() => handleNotificationToggle('gradeUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
