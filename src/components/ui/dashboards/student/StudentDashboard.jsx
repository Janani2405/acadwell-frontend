// frontend/src/components/ui/dashboards/student/StudentDashboard.jsx
// Refactored - Clean and Modular

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import '../../../css/dashboards/student/StudentDashboard.css';

// Import all components
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import WelcomeCard from './WelcomeCard';
import QuestionsFeedCard from './QuestionsFeedCard';
import WellnessCard from './WellnessCard';
import ProgressCard from './ProgressCard';
import StudyStatsCard from './StudyStatsCard';
import StudyGroupsCard from './StudyGroupsCard';
import NotificationsCard from './NotificationsCard';

const StudentDashboard = () => {
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName("Student");
    }
  }, []);

  // Toggle sidebar for mobile/tablet
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking overlay
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Mobile Menu Toggle Button
  const MobileMenuToggle = () => (
    <button 
      className="mobile-menu-toggle"
      onClick={toggleSidebar}
      aria-label="Toggle menu"
    >
      {isSidebarOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
    </button>
  );

  return (
    <div className="student-dashboard-wrapper">
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle />

      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main Content Area */}
      <div className="student-dashboard-main">
        {/* Topbar */}
        <Topbar userName={userName} />

        {/* Content Grid */}
        <div className="student-dashboard-content">
          {/* Welcome Card - Full Width */}
          <WelcomeCard userName={userName} />
          
          {/* Main Content Cards - 2 per row */}
          <QuestionsFeedCard />
          <WellnessCard />
          <ProgressCard />
          <StudyStatsCard />
          <StudyGroupsCard />
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;