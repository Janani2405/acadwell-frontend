// ============================================================
// FILE 2: frontend/src/components/ui/dashboards/student/tabs/BasicInfoTab.jsx
// ============================================================
import React, { useState } from 'react';
import { Edit3, Mail, Phone, MapPin, Calendar, GraduationCap, User, Shield, Camera, Save, X, Loader, Zap } from 'lucide-react';
import { apiCall } from '../../../../../api/api';

const BasicInfoTab = ({ studentData, setStudentData, pointsData, fetchProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setEditedData({
      fullName: studentData.fullName,
      phone: studentData.phone,
      location: studentData.location,
      email: studentData.email,
      profilePicture: studentData.profilePicture,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiCall('/api/profile/profile/basic', {
        method: 'PUT',
        body: JSON.stringify({
          name: editedData.fullName,
          phone: editedData.phone,
          location: editedData.location,
          email: editedData.email
        })
      });
      setStudentData(prev => ({...prev, ...editedData}));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const currentData = isEditing ? editedData : studentData;

  return (
    <div className="profile-tab-content">
      <form onSubmit={(e) => e.preventDefault()}>
        {pointsData && (
          <div className="profile-section-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="section-title" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap className="w-6 h-6" />
                  Community Points
                </h3>
                <div style={{ fontSize: '48px', fontWeight: 'bold', marginTop: '10px' }}>
                  {pointsData.total_points}
                </div>
                <p style={{ opacity: 0.9, marginTop: '8px' }}>Points earned from community activity</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {pointsData.badges && pointsData.badges.slice(0, 3).map((badge, idx) => (
                  <div key={idx} style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                    {badge.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="profile-header-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {currentData.profilePicture ? (
                <img src={currentData.profilePicture} alt="Profile" />
              ) : (
                <span className="avatar-initials">{getInitials(currentData.fullName)}</span>
              )}
              {isEditing && (
                <button type="button" className="avatar-edit-btn">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="profile-header-info">
              <h2 className="profile-name">{currentData.fullName}</h2>
              <p className="profile-reg">{studentData.registrationNumber}</p>
              <p className="profile-dept">{studentData.department} • {studentData.yearOfStudy}</p>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button type="button" onClick={handleEdit} className="edit-profile-btn">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="edit-actions">
                <button type="button" onClick={handleSave} className="save-btn" disabled={saving}>
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn" disabled={saving}>
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section-card">
          <h3 className="section-title">Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <div className="info-value">{studentData.fullName}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <div className="info-value">{studentData.phone || 'Not provided'}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <div className="info-value">{studentData.location || 'Not provided'}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <Shield className="w-4 h-4" />
                <span>Registration Number</span>
              </div>
              <div className="info-value">{studentData.registrationNumber}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
              <div className="info-value">{studentData.email}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <GraduationCap className="w-4 h-4" />
                <span>Department</span>
              </div>
              <div className="info-value">{studentData.department}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Calendar className="w-4 h-4" />
                <span>Year of Study</span>
              </div>
              <div className="info-value">{studentData.yearOfStudy}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Calendar className="w-4 h-4" />
                <span>Joined</span>
              </div>
              <div className="info-value">{studentData.joinDate}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoTab;