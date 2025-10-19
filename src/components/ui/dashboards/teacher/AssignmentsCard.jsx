// ========== FILE 3: AssignmentsCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/AssignmentsCard.jsx
import React from 'react';

const AssignmentsCard = () => {
  const assignments = [
    { id: 1, title: 'Neural Networks Project', class: 'CS201', dueDate: 'Sep 5', submissions: 28, total: 32 },
    { id: 2, title: 'AI Ethics Essay', class: 'CS101', dueDate: 'Sep 8', submissions: 40, total: 45 },
  ];

  return (
    <div className="dashboard-card assignments-card">
      <h3 className="card-title">Assignments Overview</h3>
      <p className="card-subtitle">Track assignment progress</p>
      
      <div className="assignments-list">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-item">
            <div className="assignment-info">
              <h4 className="assignment-title">{assignment.title}</h4>
              <p className="assignment-meta">{assignment.class} • Due: {assignment.dueDate}</p>
            </div>
            <div className="assignment-progress">
              <div className="progress-circle">
                <span className="progress-text">{assignment.submissions}/{assignment.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="manage-btn">Manage Assignments</button>
    </div>
  );
};

export default AssignmentsCard;