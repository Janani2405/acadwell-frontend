// ============================================================
// FILE: frontend/src/components/ui/dashboards/teacher/tabs/TeacherSettingsTab.jsx
// ============================================================
import React from 'react';
import { apiCall } from '../../../../../api/api';

const TeacherSettingsTab = ({ teacherData, setTeacherData }) => {
  const handlePrivacyToggle = async (field) => {
    try {
      const newPrivacy = {
        ...teacherData.privacy,
        [field]: !teacherData.privacy[field]
      };
      
      await apiCall('/api/teacher_profile/profile/privacy', {
        method: 'PUT',
        body: JSON.stringify(newPrivacy)
      });
      
      setTeacherData(prev => ({
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
        ...teacherData.notifications,
        [field]: !teacherData.notifications[field]
      };
      
      await apiCall('/api/teacher_profile/profile/notifications', {
        method: 'PUT',
        body: JSON.stringify(newNotifications)
      });
      
      setTeacherData(prev => ({
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
              <p className="setting-description">Display your full name to students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.showFullName}
                onChange={() => handlePrivacyToggle('showFullName')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Email</h4>
              <p className="setting-description">Make email visible to students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.showEmail}
                onChange={() => handlePrivacyToggle('showEmail')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Phone Number</h4>
              <p className="setting-description">Display phone number to students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.showPhone || false}
                onChange={() => handlePrivacyToggle('showPhone')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Office Location</h4>
              <p className="setting-description">Display office location for students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.showOfficeLocation}
                onChange={() => handlePrivacyToggle('showOfficeLocation')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Allow Student Contact</h4>
              <p className="setting-description">Allow students to send direct messages</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.allowStudentContact}
                onChange={() => handlePrivacyToggle('allowStudentContact')}
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
              <h4 className="setting-name">Assignment Submissions</h4>
              <p className="setting-description">Get notified about new submissions</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.assignmentSubmissions}
                onChange={() => handleNotificationToggle('assignmentSubmissions')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Student Queries</h4>
              <p className="setting-description">Notifications for student questions</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.studentQueries}
                onChange={() => handleNotificationToggle('studentQueries')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Peer Activity</h4>
              <p className="setting-description">Updates from fellow teachers</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.peerActivity}
                onChange={() => handleNotificationToggle('peerActivity')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">System Updates</h4>
              <p className="setting-description">Important system announcements</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.systemUpdates || false}
                onChange={() => handleNotificationToggle('systemUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Grade Reminders</h4>
              <p className="setting-description">Reminders to grade assignments</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.gradeReminders}
                onChange={() => handleNotificationToggle('gradeReminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Account Information</h3>
        <div style={{
          background: '#0f172a',
          padding: '20px',
          borderRadius: '12px',
          borderLeft: '4px solid #667eea'
        }}>
          <p style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '14px' }}>
            Account Settings
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#e2e8f0' }}>Email:</span>
            <span style={{ color: '#94a3b8' }}>{teacherData.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#e2e8f0' }}>Employee ID:</span>
            <span style={{ color: '#94a3b8' }}>{teacherData.employeeId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#e2e8f0' }}>Member Since:</span>
            <span style={{ color: '#94a3b8' }}>{teacherData.joinDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettingsTab;