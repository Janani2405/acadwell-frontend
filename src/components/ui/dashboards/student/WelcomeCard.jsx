// ============================================================================
// FILE 3: WelcomeCard.jsx
// Location: frontend/src/components/ui/dashboards/student/WelcomeCard.jsx
// ============================================================================

import React from 'react';
import { HelpCircle, Users, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeCard = ({ userName }) => {
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    navigate('/community/askquestion');
  };

  const handleJoinGroup = () => {
    // Navigate to community and filter by study-groups
    navigate('/community?filter=study-groups');
  };

  const handleStartStudy = () => {
    // Navigate to community feed
    navigate('/community');
  };

  return (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">Welcome Back, {userName} 👋</h2>
        <p className="welcome-subtitle">Ready to continue your learning journey?</p>
      </div>
      
      <div className="quick-actions">
        <button 
          className="quick-action-btn ask-question"
          onClick={handleAskQuestion}
        >
          <HelpCircle className="action-icon" />
          <span>Ask Question</span>
        </button>
        
        <button 
          className="quick-action-btn join-group"
          onClick={handleJoinGroup}
        >
          <Users className="action-icon" />
          <span>Join Group</span>
        </button>
        
        <button 
          className="quick-action-btn start-study"
          onClick={handleStartStudy}
        >
          <Rocket className="action-icon" />
          <span>Start Study</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeCard;