// frontend/src/components/ui/dashboards/teacher/TeacherDashboard.jsx
// Refactored - Clean and Modular

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import '../../../css/dashboards/teacher/TeacherDashboard.css';

// Import all components
import TeacherSidebar from './TeacherSidebar';
import TeacherTopbar from './TeacherTopbar';
import TeacherWelcomeCard from './TeacherWelcomeCard';
import MyClassesCard from './MyClassesCard';
import AssignmentsCard from './AssignmentsCard';
import StudentQueriesCard from './StudentQueriesCard';
import AnalyticsCard from './AnalyticsCard';
import AtRiskStudentsCard from './AtRiskStudentsCard';
import StudentWellnessAlertsCard from './StudentWellnessAlertsCard';
import NotificationsCard from './NotificationsCard';
import CourseResourcesCard from './CourseResourcesCard';

const TeacherDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar for mobile/tablet
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking overlay or nav items
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
    <div className="teacher-dashboard-wrapper">
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle />

      {/* Sidebar */}
      <TeacherSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main Content Area */}
      <div className="teacher-dashboard-main">
        {/* Topbar */}
        <TeacherTopbar />

        {/* Content Grid */}
        <div className="teacher-dashboard-content">
          {/* Welcome Card - Full Width */}
          <TeacherWelcomeCard />
          
          {/* Main Content Cards - 2 per row */}
          <MyClassesCard />
          <AssignmentsCard />
          <StudentQueriesCard />
          <AnalyticsCard />
          <AtRiskStudentsCard />
          <StudentWellnessAlertsCard />
          <NotificationsCard />
          <CourseResourcesCard />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;