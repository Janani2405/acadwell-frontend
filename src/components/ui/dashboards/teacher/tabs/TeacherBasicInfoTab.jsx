
// ============================================================
// FILE 2: frontend/src/components/ui/dashboards/teacher/tabs/TeacherBasicInfoTab.jsx
// ============================================================
import React, { useState } from 'react';
import { Edit3, Mail, Phone, MapPin, Calendar, Briefcase, Building, User, Shield, Camera, Save, X, Loader, FileText } from 'lucide-react';
import { apiCall } from '../../../../../api/api';

const TeacherBasicInfoTab = ({ teacherData, setTeacherData, fetchTeacherProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPubModal, setShowPubModal] = useState(false);
  const [pubFormData, setPubFormData] = useState({ title: '', journal: '', year: '' });
  const [addingPub, setAddingPub] = useState(false);

  const handleEdit = () => {
    setEditedData({
      fullName: teacherData.fullName,
      phone: teacherData.phone,
      officeLocation: teacherData.officeLocation,
      email: teacherData.email
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiCall('/api/teacher_profile/profile/basic', {
        method: 'PUT',
        body: JSON.stringify({
          name: editedData.fullName,
          phone: editedData.phone,
          officeLocation: editedData.officeLocation,
          email: editedData.email
        })
      });
      setTeacherData(prev => ({...prev, ...editedData}));
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

  const handleAddPublication = async () => {
    if (!pubFormData.title || !pubFormData.journal || !pubFormData.year) {
      alert('Please fill all fields');
      return;
    }
    
    try {
      setAddingPub(true);
      await apiCall('/api/teacher_profile/profile/publications', {
        method: 'POST',
        body: JSON.stringify(pubFormData)
      });
      setPubFormData({ title: '', journal: '', year: '' });
      setShowPubModal(false);
      fetchTeacherProfile();
      alert('Publication added successfully!');
    } catch (err) {
      console.error('Error adding publication:', err);
      alert('Failed to add publication');
    } finally {
      setAddingPub(false);
    }
  };

  const handleDeletePublication = async (pubId) => {
    if (!window.confirm('Delete this publication?')) return;
    
    try {
      await apiCall(`/api/teacher_profile/profile/publications/${pubId}`, {
        method: 'DELETE'
      });
      fetchTeacherProfile();
      alert('Publication deleted successfully!');
    } catch (err) {
      console.error('Error deleting publication:', err);
      alert('Failed to delete publication');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const currentData = isEditing ? editedData : teacherData;

  return (
    <div className="profile-tab-content">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="profile-header-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar teacher-avatar">
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
              <p className="profile-designation">{teacherData.designation}</p>
              <p className="profile-dept">{teacherData.department} Department</p>
              <p className="profile-id">{teacherData.employeeId}</p>
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
          <h3 className="section-title">Professional Information</h3>
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
                <div className="info-value">{teacherData.fullName}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <Shield className="w-4 h-4" />
                <span>Employee ID</span>
              </div>
              <div className="info-value">{teacherData.employeeId}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Briefcase className="w-4 h-4" />
                <span>Designation</span>
              </div>
              <div className="info-value">{teacherData.designation}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Building className="w-4 h-4" />
                <span>Department</span>
              </div>
              <div className="info-value">{teacherData.department}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </div>
              <div className="info-value">{teacherData.email}</div>
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
                <div className="info-value">{teacherData.phone || 'Not provided'}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <MapPin className="w-4 h-4" />
                <span>Office Location</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.officeLocation}
                  onChange={(e) => handleInputChange('officeLocation', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <div className="info-value">{teacherData.officeLocation || 'Not provided'}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <Calendar className="w-4 h-4" />
                <span>Joined</span>
              </div>
              <div className="info-value">{teacherData.joinDate}</div>
            </div>
          </div>
        </div>
      </form>

      <div className="profile-section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="section-title">Research & Publications</h3>
          <button
            type="button"
            onClick={() => setShowPubModal(true)}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            + Add Publication
          </button>
        </div>
        <div className="publications-list">
          {teacherData.researchPublications.length > 0 ? (
            teacherData.researchPublications.map(pub => (
              <div key={pub.id} className="publication-item">
                <div className="pub-icon">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="pub-info">
                  <h4 className="pub-title">{pub.title}</h4>
                  <p className="pub-details">{pub.journal} • {pub.year}</p>
                </div>
                <button
                  onClick={() => handleDeletePublication(pub.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No publications yet.</p>
          )}
        </div>
      </div>

      {showPubModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPubModal(false);
          }}
        >
          <div
            style={{
              background: '#1e293b',
              padding: '32px',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '500px',
              color: 'white'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '20px', fontSize: '24px' }}>Add Publication</h3>
            
            <input
              type="text"
              placeholder="Publication Title *"
              value={pubFormData.title}
              onChange={(e) => setPubFormData({...pubFormData, title: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: 'white',
                boxSizing: 'border-box'
              }}
            />
            
            <input
              type="text"
              placeholder="Journal/Conference Name *"
              value={pubFormData.journal}
              onChange={(e) => setPubFormData({...pubFormData, journal: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: 'white',
                boxSizing: 'border-box'
              }}
            />
            
            <input
              type="text"
              placeholder="Year (e.g., 2024) *"
              value={pubFormData.year}
              onChange={(e) => setPubFormData({...pubFormData, year: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: 'white',
                boxSizing: 'border-box'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleAddPublication}
                disabled={addingPub}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: addingPub ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: addingPub ? 0.6 : 1
                }}
              >
                {addingPub ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setShowPubModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#475569',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherBasicInfoTab;