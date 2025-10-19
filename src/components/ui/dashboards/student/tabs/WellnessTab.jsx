// ============================================================
// FILE 4: frontend/src/components/ui/dashboards/student/tabs/WellnessTab.jsx
// ============================================================
import React from 'react';
import { HelpCircle, MessageSquare, CheckCircle, Star, Target } from 'lucide-react';

const WellnessTab = ({ studentData }) => {
  return (
    <div className="profile-tab-content">
      <div className="profile-section-card">
        <h3 className="section-title">Recent Mood Logs</h3>
        {studentData.recentMoods.length > 0 ? (
          <div className="mood-timeline">
            {studentData.recentMoods.map((mood, index) => (
              <div key={index} className="mood-entry">
                <div className="mood-date">{mood.date}</div>
                <div className="mood-indicator">{mood.mood}</div>
                <div className="mood-note">{mood.note}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No mood logs yet. Start tracking your wellness!</p>
        )}
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Community Participation</h3>
        <div className="activity-stats">
          <div className="activity-item">
            <div className="activity-icon questions">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.questionsAsked}</span>
              <span className="activity-label">Questions Asked</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon answers">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.answersGiven}</span>
              <span className="activity-label">Answers Given</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon accepted">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.acceptedAnswers || 0}</span>
              <span className="activity-label">Accepted Answers</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon votes">
              <Star className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.helpfulVotes}</span>
              <span className="activity-label">Helpful Votes</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon groups">
              <Target className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.studyGroupsJoined}</span>
              <span className="activity-label">Study Groups</span>
            </div>
          </div>
        </div>
      </div>

      {studentData.badges.length > 0 && (
        <div className="profile-section-card">
          <h3 className="section-title">Earned Badges</h3>
          <div className="badges-grid">
            {studentData.badges.map((badge, idx) => (
              <div key={idx} className="badge-item">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <h4 className="badge-name">{badge.name}</h4>
                  <p className="badge-description">{badge.description}</p>
                  <span className="badge-date">Earned: {new Date(badge.earned).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessTab;