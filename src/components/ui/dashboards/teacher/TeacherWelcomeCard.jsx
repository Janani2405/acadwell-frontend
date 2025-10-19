// ========== FILE 1: TeacherWelcomeCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/TeacherWelcomeCard.jsx
import React from 'react';
import { Plus, Upload, MessageSquare } from 'lucide-react';

const TeacherWelcomeCard = () => {
  return (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">Hello Professor 👋</h2>
        <p className="welcome-subtitle">Ready to inspire and educate today?</p>
      </div>
      
      <div className="quick-actions">
        <button className="quick-action-btn create-class">
          <Plus className="action-icon" />
          <span>New Class</span>
        </button>
        <button className="quick-action-btn post-assignment">
          <Upload className="action-icon" />
          <span>Post Assignment</span>
        </button>
        <button className="quick-action-btn check-queries">
          <MessageSquare className="action-icon" />
          <span>Check Queries</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherWelcomeCard;

