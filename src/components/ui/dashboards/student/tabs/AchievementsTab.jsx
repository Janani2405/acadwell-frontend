// ============================================================
// FILE 5: frontend/src/components/ui/dashboards/student/tabs/AchievementsTab.jsx
// ============================================================
import React, { useState } from 'react';
import { Award, Trophy, Zap, Plus, FileText } from 'lucide-react';
import { apiCall } from '../../../../../api/api';
import CertificateModal from '../modals/CertificateModal';

const AchievementsTab = ({ studentData, pointsData, fetchProfile }) => {
  const [showCertModal, setShowCertModal] = useState(false);

  return (
    <div className="profile-tab-content">
      {pointsData && (
        <div className="profile-section-card">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap className="w-5 h-5 text-yellow-400" />
            Points Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{pointsData.total_points}</div>
              <div style={{ opacity: 0.9, marginTop: '8px' }}>Total Points</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '20px', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{pointsData.community_activity?.acceptedAnswers || 0}</div>
              <div style={{ opacity: 0.9, marginTop: '8px' }}>Accepted Answers</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '20px', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{pointsData.badges?.length || 0}</div>
              <div style={{ opacity: 0.9, marginTop: '8px' }}>Badges Earned</div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-section-card">
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy className="w-5 h-5 text-yellow-400" />
          All Badges
        </h3>
        {studentData.badges.length > 0 ? (
          <div className="badges-grid">
            {studentData.badges.map((badge, idx) => (
              <div key={idx} className="badge-item" style={{ 
                border: '2px solid #10b981', 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                  ✓ Earned
                </div>
                <div className="badge-icon" style={{ fontSize: '48px' }}>{badge.icon}</div>
                <div className="badge-info">
                  <h4 className="badge-name">{badge.name}</h4>
                  <p className="badge-description">{badge.description}</p>
                  <span className="badge-date">Earned: {new Date(badge.earned).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No badges earned yet. Keep learning and contributing!</p>
        )}
      </div>

      {pointsData?.points_history && pointsData.points_history.length > 0 && (
        <div className="profile-section-card">
          <h3 className="section-title">Recent Activity</h3>
          <div style={{ marginTop: '16px' }}>
            {pointsData.points_history.map((event, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{event.reason}</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
                    {new Date(event.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: event.points > 0 ? '#10b981' : '#ef4444'
                }}>
                  {event.points > 0 ? '+' : ''}{event.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="profile-section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="section-title">Certificates & Recognition</h3>
          <button 
            type="button"
            onClick={() => setShowCertModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <Plus className="w-4 h-4" />
            Upload Certificate
          </button>
        </div>
        
        {studentData.certificates.length > 0 ? (
          <div className="certificates-list">
            {studentData.certificates.map(cert => (
              <CertificateItem key={cert.id} cert={cert} fetchProfile={fetchProfile} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
            No certificates yet. Upload your first one!
          </p>
        )}
      </div>

      {showCertModal && (
        <CertificateModal 
          onClose={() => setShowCertModal(false)} 
          fetchProfile={fetchProfile}
        />
      )}

      <div className="profile-section-card">
        <h3 className="section-title">Milestones Achieved</h3>
        {studentData.milestones.length > 0 ? (
          <div className="milestones-list">
            {studentData.milestones.map(milestone => (
              <div key={milestone.id} className="milestone-item">
                <div className="milestone-icon">{milestone.icon}</div>
                <div className="milestone-info">
                  <h4 className="milestone-title">{milestone.title}</h4>
                  <span className="milestone-date">{milestone.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
            No milestones achieved yet. Keep up the great work!
          </p>
        )}
      </div>
    </div>
  );
};

const CertificateItem = ({ cert, fetchProfile }) => {
  const handleDeleteCert = async (certId) => {
    if (!window.confirm('Delete this certificate?')) return;
    
    try {
      await apiCall(`/api/profile/certificates/${certId}`, {
        method: 'DELETE'
      });
      fetchProfile();
    } catch (err) {
      alert('Failed to delete certificate');
    }
  };

  return (
    <div className="certificate-item" style={{ position: 'relative' }}>
      <div className="cert-icon">
        <Award className="w-8 h-8" />
      </div>
      <div className="cert-info">
        <h4 className="cert-name">{cert.name}</h4>
        <p className="cert-issuer">Issued by {cert.issuer}</p>
        <span className="cert-date">{cert.date}</span>
        {cert.file_url && (
          <a 
            href={cert.file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#667eea', fontSize: '14px', marginTop: '4px', display: 'block' }}
          >
            📄 View Certificate
          </a>
        )}
      </div>
      <button
        onClick={() => handleDeleteCert(cert.id)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
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
  );
};

export default AchievementsTab;