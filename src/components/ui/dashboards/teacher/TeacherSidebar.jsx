// frontend/src/components/ui/dashboards/teacher/TeacherSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  HelpCircle, 
  BarChart3, 
  Settings,
  Users,
  MessagesSquare,
  BookMarked,
  HeartPulse
} from 'lucide-react';

const TeacherSidebar = ({ isSidebarOpen, closeSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : 'hidden'}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`teacher-sidebar ${isSidebarOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">AcadWell</h2>
          <div className="teacher-badge">Teacher Portal</div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {/* Dashboard */}
            <li className="nav-item active" onClick={closeSidebar}>
              <Home className="nav-icon" />
              <span>Dashboard</span>
            </li>

            {/* My Classes */}
            <li className="nav-item" onClick={closeSidebar}>
              <BookOpen className="nav-icon" />
              <span>My Classes</span>
            </li>

            {/* Assignments */}
            <li className="nav-item" onClick={closeSidebar}>
              <ClipboardList className="nav-icon" />
              <span>Assignments</span>
            </li>

            {/* Student Queries */}
            <li className="nav-item" onClick={closeSidebar}>
              <HelpCircle className="nav-icon" />
              <span>Student Queries</span>
            </li>

            {/* Student Wellness - ✨ NEW */}
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/wellness/students-overview" className="flex items-center space-x-3 w-full">
                <HeartPulse className="nav-icon" />
                <span>Student Wellness</span>
              </Link>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/dashboard/teacher/grades" className="flex items-center space-x-3 w-full">
                <BookMarked className="nav-icon" />
                <span>Grade Upload</span>
              </Link>
            </li>
            {/* Analytics */}
            <li className="nav-item" onClick={closeSidebar}>
              <BarChart3 className="nav-icon" />
              <span>Analytics</span>
            </li>

            {/* Community */}
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/community" className="flex items-center space-x-3 w-full">
                <Users className="nav-icon" />
                <span>Community</span>
              </Link>
            </li>

            {/* Messages */}
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/messages" className="flex items-center space-x-3 w-full">
                <MessagesSquare className="nav-icon" />
                <span>Messages</span>
              </Link>
            </li>

            {/* Settings */}
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

export default TeacherSidebar;