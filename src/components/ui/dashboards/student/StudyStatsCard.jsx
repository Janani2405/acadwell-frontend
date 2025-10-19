// ========== FILE 3: StudyStatsCard.jsx ==========
// frontend/src/components/ui/dashboards/student/StudyStatsCard.jsx
import React from 'react';
import { Clock, CheckCircle, TrendingUp, Target, BarChart } from 'lucide-react';

const StudyStatsCard = () => {
  const studyStats = {
    hoursThisWeek: 28,
    assignmentsCompleted: 12,
    studyStreak: 5,
    averageScore: 87
  };

  return (
    <div className="dashboard-card study-stats-card">
      <h3 className="card-title">Study Statistics</h3>
      <p className="card-subtitle">Your learning metrics</p>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon hours">
            <Clock className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.hoursThisWeek}</span>
            <span className="stat-label">Hours This Week</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon assignments">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.assignmentsCompleted}</span>
            <span className="stat-label">Assignments Done</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon score">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.averageScore}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon streak">
            <Target className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.studyStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      </div>
      
      <button className="detailed-stats-btn">
        <BarChart className="w-4 h-4" />
        Detailed Statistics
      </button>
    </div>
  );
};

export default StudyStatsCard;