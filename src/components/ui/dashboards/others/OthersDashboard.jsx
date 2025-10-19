// OthersDashboard.jsx - With Mobile Sidebar Toggle
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import OthersSidebar from './OthersSidebar';
import OthersTopbar from './OthersTopbar';
import OthersWelcomeCard from './OthersWelcomeCard';
import MentorshipSessionsCard from './MentorshipSessionsCard';
import HelpRequestsCard from './HelpRequestsCard';
import CommunityFeedCard from './CommunityFeedCard';
import ImpactAnalyticsCard from './ImpactAnalyticsCard';
import GuidanceOpportunitiesCard from './GuidanceOpportunitiesCard';
import WellnessSupportCard from './WellnessSupportCard';
import BadgesRecognitionCard from './BadgesRecognitionCard';
import NotificationsCard from './NotificationsCard';
import '../../../css/dashboards/others/OthersDashboard.css';

const OthersDashboard = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("others");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName("User");
    }
    
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

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
    <div className="others-dashboard-wrapper">
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle />

      {/* Sidebar */}
      <OthersSidebar
        userRole={userRole}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />

      {/* Main Content Area */}
      <div className="others-dashboard-main">
        {/* Topbar */}
        <OthersTopbar userName={userName} />

        {/* Content Grid */}
        <div className="others-dashboard-content">
          {/* Welcome Card - Full Width */}
          <OthersWelcomeCard userName={userName} userRole={userRole} />
          
          {/* Main Content Cards - 2 per row */}
          <MentorshipSessionsCard />
          <HelpRequestsCard />
          <CommunityFeedCard />
          <ImpactAnalyticsCard />
          <GuidanceOpportunitiesCard />
          <WellnessSupportCard />
          <BadgesRecognitionCard />
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
};

export default OthersDashboard;