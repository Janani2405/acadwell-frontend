// OthersSidebarMobile.jsx - Mobile-friendly Sidebar with Toggle
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Share2, 
  BarChart3, 
  Settings,
  MessagesSquare
} from 'lucide-react';

const OthersSidebar = ({ userRole, isSidebarOpen, closeSidebar }) => {
  const getRoleBadge = () => {
    if (userRole === 'mentor') return 'Mentor Portal';
    if (userRole === 'contributor') return 'Contributor Hub';
    if (userRole === 'alumni') return 'Alumni Network';
    if (userRole === 'counselor') return 'Counselor Portal';
    return 'Others Portal';
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : 'hidden'}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`others-sidebar ${isSidebarOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">AcadWell</h2>
          <div className="role-badge">
            {getRoleBadge()}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active" onClick={closeSidebar}>
              <Home className="nav-icon" />
              <span>Dashboard</span>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Users className="nav-icon" />
              <span>Mentorship</span>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <MessageCircle className="nav-icon" />
              <span>Community</span>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <Share2 className="nav-icon" />
              <span>Contributions</span>
            </li>
            <li className="nav-item" onClick={closeSidebar}>
              <BarChart3 className="nav-icon" />
              <span>Analytics</span>
            </li>
            
            {/* Community Link */}
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/community" className="flex items-center space-x-3 w-full">
                <Users className="nav-icon" />
                <span>Community</span>
              </Link>
            </li>

            {/* Messages Link */}
            <li className="nav-item" onClick={closeSidebar}>
              <Link to="/messages" className="flex items-center space-x-3 w-full">
                <MessagesSquare className="nav-icon" />
                <span>Messages</span>
              </Link>
            </li>

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

export default OthersSidebar;