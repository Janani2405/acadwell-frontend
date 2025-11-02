// ============================================================================
// FILE 4: Sidebar.jsx (UPDATED VERSION)
// Location: frontend/src/components/ui/dashboards/student/Sidebar.jsx
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  HelpCircle, 
  Users, 
  Activity, 
  BarChart, 
  Settings,
  MessageSquare,
  MessagesSquare,
  BarChart3,
  Shield  // NEW - Added for moderation
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : 'hidden'}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`student-sidebar ${isSidebarOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">AcadWell</h2>
          <div className="student-badge">Student Portal</div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active" onClick={closeSidebar}>
              <Link to="/dashboard/student" className="flex items-center space-x-3 w-full">
              <Home className="nav-icon" />
              <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/community/askquestion" className="flex items-center space-x-3 w-full">
                <HelpCircle className="nav-icon" />
                <span>Questions</span>
              </Link>  
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/messages" className="flex items-center space-x-3 w-full">
                <Users className="nav-icon" />
                <span>Study Groups</span>
              </Link>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/wellness/dashboard" className="flex items-center space-x-3 w-full">
                <Activity className="nav-icon" />
                <span>Wellness</span>
              </Link>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/dashboard/student/grades" className="flex items-center space-x-3 w-full">
                <BarChart3 className="nav-icon" />
                <span>Grades</span>
              </Link>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/dashboard/student/statistics" className="flex items-center space-x-3 w-full">
                <BarChart className="nav-icon" />
                <span>Analytics</span>
              </Link>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/community" className="flex items-center space-x-3 w-full">
                <MessagesSquare className="nav-icon" />
                <span>Community</span>
              </Link>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/messages" className="flex items-center space-x-3 w-full">
                <MessageSquare className="nav-icon" />
                <span>Messages</span>
              </Link>
            </li>
            
            {/* NEW - Moderation link for Teachers/Counselors only */}
            {(localStorage.getItem('role') === 'teacher' || localStorage.getItem('role') === 'counselor') && (
              <li className="nav-item" onClick={closeSidebar}>
                <Link to="/community/moderation" className="flex items-center space-x-3 w-full">
                  <Shield className="nav-icon" />
                  <span>Moderation</span>
                </Link>
              </li>
            )}
            
            <li className="nav-item" onClick={closeSidebar}>
              <Settings className="nav-icon" />
              <span>Settings</span>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;