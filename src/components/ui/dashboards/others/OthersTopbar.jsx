// frontend/src/components/ui/dashboards/others/OthersTopbar.jsx
import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';

const OthersTopbar = ({ userName }) => {
  return (
    <header className="others-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search mentorship, community, resources..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="notification-badge">4</span>
        </button>
        <button className="profile-btn">
          <UserCircle className="profile-icon" />
          <span className="profile-text">{userName}</span>
        </button>
      </div>
    </header>
  );
};

export default OthersTopbar;