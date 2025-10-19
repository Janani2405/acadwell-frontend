// ============================================================
// FILE: frontend/src/components/ui/dashboards/teacher/tabs/TeacherEngagementTab.jsx
// ============================================================
import React from 'react';
import { HelpCircle, Users, MessageSquare, Send, Trophy } from 'lucide-react';

const TeacherEngagementTab = ({ teacherData }) => {
  return (
    <div className="profile-tab-content">
      <div className="profile-section-card">
        <h3 className="section-title">Student Interaction</h3>
        <div className="interaction-stats">
          <div className="interaction-item">
            <div className="interaction-icon queries">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.queriesResponded}</span>
              <span className="interaction-label">Queries Responded</span>
            </div>
          </div>
          <div className="interaction-item">
            <div className="interaction-icon sessions">
              <Users className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.mentorshipSessions}</span>
              <span className="interaction-label">Mentorship Sessions</span>
            </div>
          </div>
          <div className="interaction-item">
            <div className="interaction-icon contributions">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.communityContributions}</span>
              <span className="interaction-label">Community Posts</span>
            </div>
          </div>
          <div className="interaction-item">
            <div className="interaction-icon response">
              <Send className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.averageResponseTime}</span>
              <span className="interaction-label">Avg Response Time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Achievement Badges</h3>
        {teacherData.systemBadges.length > 0 ? (
          <div className="badges-grid">
            {teacherData.systemBadges.map(badge => (
              <div key={badge.id} className="badge-item">
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
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No badges earned yet.</p>
        )}
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Teaching Awards & Recognition</h3>
        {teacherData.teachingAwards.length > 0 ? (
          <div className="awards-list">
            {teacherData.teachingAwards.map(award => (
              <div key={award.id} className="award-item">
                <div className="award-icon">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="award-info">
                  <h4 className="award-name">{award.name}</h4>
                  <p className="award-issuer">Issued by {award.issuer}</p>
                  <span className="award-year">{award.year}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No awards yet.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherEngagementTab;