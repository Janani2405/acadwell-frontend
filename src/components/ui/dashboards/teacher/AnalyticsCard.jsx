// ========== FILE 5: AnalyticsCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/AnalyticsCard.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const AnalyticsCard = () => {
  const participationData = [
    { class: 'CS101', participation: 78 },
    { class: 'CS201', participation: 85 },
    { class: 'CS301', participation: 92 },
  ];

  return (
    <div className="dashboard-card analytics-card">
      <h3 className="card-title">Class Participation</h3>
      <p className="card-subtitle">Student engagement overview</p>
      
      <div className="analytics-content">
        {participationData.map((data) => (
          <div key={data.class} className="participation-item">
            <div className="participation-info">
              <span className="class-name">{data.class}</span>
              <span className="participation-rate">{data.participation}%</span>
            </div>
            <div className="participation-bar">
              <div 
                className="participation-fill" 
                style={{ width: `${data.participation}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="detailed-analytics-btn">
        <TrendingUp className="w-4 h-4" />
        Detailed Analytics
      </button>
    </div>
  );
};

export default AnalyticsCard;