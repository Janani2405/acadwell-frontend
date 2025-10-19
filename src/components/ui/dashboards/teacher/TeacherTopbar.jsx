// frontend/src/components/ui/dashboards/teacher/TeacherTopbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, UserCircle } from 'lucide-react';

const TeacherTopbar = () => {
  return (
    <header className="teacher-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search classes, students, assignments..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="notification-badge">4</span>
        </button>
        <Link to='/dashboard/tprofile'>
          <button className="profile-btn">
            <UserCircle className="profile-icon" />
            <span className="profile-text">Prof. Geetha</span>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default TeacherTopbar;