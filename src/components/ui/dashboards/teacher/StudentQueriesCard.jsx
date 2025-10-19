// ========== FILE 4: StudentQueriesCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/StudentQueriesCard.jsx
import React from 'react';
import { Send, CheckCircle, Clock } from 'lucide-react';

const StudentQueriesCard = () => {
  const studentQueries = [
    { id: 1, student: 'Anonymous', class: 'CS101', question: 'Can you explain supervised vs unsupervised learning?', time: '2h ago', status: 'pending' },
    { id: 2, student: 'Sarah M.', class: 'CS201', question: 'Having trouble with gradient descent optimization.', time: '4h ago', status: 'replied' },
  ];

  return (
    <div className="dashboard-card queries-card">
      <h3 className="card-title">Student Queries</h3>
      <p className="card-subtitle">Recent questions from students</p>
      
      <div className="queries-list">
        {studentQueries.map((query) => (
          <div key={query.id} className="query-item">
            <div className="query-header">
              <span className="query-student">{query.student}</span>
              <span className="query-class">{query.class}</span>
            </div>
            <p className="query-text">{query.question}</p>
            <div className="query-actions">
              <button className="reply-btn">
                <Send className="w-3 h-3" />
                Reply
              </button>
              <span className={`status-indicator ${query.status}`}>
                {query.status === 'replied' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-queries-btn">View All Queries</button>
    </div>
  );
};

export default StudentQueriesCard;