// ========== FILE 2: ProgressCard.jsx ==========
// frontend/src/components/ui/dashboards/student/ProgressCard.jsx
import React from 'react';
import { BarChart2 } from 'lucide-react';

const ProgressCard = () => {
  const progress = 72;
  const studyStats = {
    hoursThisWeek: 28,
    studyStreak: 5,
  };

  return (
    <div className="dashboard-card progress-card">
      <h3 className="card-title">Learning Progress</h3>
      <p className="card-subtitle">Your academic journey overview</p>

      <div className="progress-wrapper">
        <div className="progress-info">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="study-stats-mini">
        <div className="mini-stat">
          <span className="mini-stat-number">{studyStats.hoursThisWeek}</span>
          <span className="mini-stat-label">Hours</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-number">{studyStats.studyStreak}</span>
          <span className="mini-stat-label">Streak</span>
        </div>
      </div>

      <button className="details-btn">
        <BarChart2 className="btn-icon" />
        <span>View Analytics</span>
      </button>
    </div>
  );
};

export default ProgressCard;