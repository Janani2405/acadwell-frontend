// ========== FILE 4: DeadlinesCard.jsx ==========
// frontend/src/components/ui/dashboards/student/DeadlinesCard.jsx
import React from 'react';

const DeadlinesCard = () => {
  const upcomingDeadlines = [
    { id: 1, title: 'Machine Learning Assignment', subject: 'CS201', dueDate: 'Sep 8', priority: 'high' },
    { id: 2, title: 'Calculus Problem Set', subject: 'MATH101', dueDate: 'Sep 12', priority: 'medium' },
  ];

  return (
    <div className="dashboard-card deadlines-card">
      <h3 className="card-title">Upcoming Deadlines</h3>
      <p className="card-subtitle">Stay on top of your assignments</p>
      
      <div className="deadlines-list">
        {upcomingDeadlines.map((deadline) => (
          <div key={deadline.id} className="deadline-item">
            <div className="deadline-info">
              <h4 className="deadline-title">{deadline.title}</h4>
              <p className="deadline-subject">{deadline.subject} • Due: {deadline.dueDate}</p>
            </div>
            <span className={`priority-badge ${deadline.priority}`}>
              {deadline.priority}
            </span>
          </div>
        ))}
      </div>
      
      <button className="view-all-deadlines-btn">View All Deadlines</button>
    </div>
  );
};

export default DeadlinesCard;