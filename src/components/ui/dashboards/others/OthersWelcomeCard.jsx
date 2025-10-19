// frontend/src/components/ui/dashboards/others/OthersWelcomeCard.jsx
import React from 'react';
import { Calendar, Share2, MessageCircle } from 'lucide-react';

const OthersWelcomeCard = ({ userName, userRole }) => {
  const getGreeting = () => {
    if (userRole === 'mentor') return `Hello Mentor ${userName}`;
    if (userRole === 'counselor') return `Hello Counselor ${userName}`;
    if (userRole === 'alumni') return `Hello Alumni ${userName}`;
    return `Hello ${userName}`;
  };

  return (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">{getGreeting()} 👋</h2>
        <p className="welcome-subtitle">Ready to make a difference today?</p>
      </div>
      
      <div className="quick-actions">
        <button className="quick-action-btn start-session">
          <Calendar className="action-icon" />
          <span>Start Session</span>
        </button>
        <button className="quick-action-btn share-resource">
          <Share2 className="action-icon" />
          <span>Share Resource</span>
        </button>
        <button className="quick-action-btn join-discussion">
          <MessageCircle className="action-icon" />
          <span>Join Discussion</span>
        </button>
      </div>
    </div>
  );
};

export default OthersWelcomeCard;