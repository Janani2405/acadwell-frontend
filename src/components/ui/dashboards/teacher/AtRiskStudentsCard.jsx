// ========== FILE 6: AtRiskStudentsCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/AtRiskStudentsCard.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AtRiskStudentsCard = () => {
  const atRiskStudents = [
    { name: 'John D.', class: 'CS101', issue: 'Low participation', severity: 'medium' },
    { name: 'Anonymous', class: 'CS201', issue: 'Missing assignments', severity: 'high' },
    { name: 'Mike R.', class: 'CS301', issue: 'Declining grades', severity: 'low' },
  ];

  return (
    <div className="dashboard-card at-risk-card">
      <h3 className="card-title">At-Risk Students</h3>
      <p className="card-subtitle">Students needing attention</p>
      
      <div className="at-risk-list">
        {atRiskStudents.map((student, index) => (
          <div key={index} className="at-risk-item">
            <div className="student-info">
              <span className="student-name">{student.name}</span>
              <span className="student-issue">{student.issue}</span>
            </div>
            <span className={`severity-badge ${student.severity}`}>
              <AlertTriangle className="w-3 h-3" />
              {student.severity}
            </span>
          </div>
        ))}
      </div>
      
      <button className="view-all-risk-btn">View All Alerts</button>
    </div>
  );
};

export default AtRiskStudentsCard;