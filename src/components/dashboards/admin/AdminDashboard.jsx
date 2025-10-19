// frontend/src/components/dashboards/admin/AdminDashboard.jsx
/**
 * Admin Dashboard Main Layout - Complete Version
 * Container for admin dashboard with all pages
 */

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Import components
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

// Import all pages
import Overview from './pages/Overview';
import UsersManagement from './pages/UsersManagement';
import ContentModeration from './pages/ContentModeration';
import WellnessMonitoring from './pages/WellnessMonitoring';
import ActivityLogs from './pages/ActivityLogs';
import Settings from './pages/Settings';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-purple-600 p-2 rounded-lg text-white hover:bg-purple-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar */}
        <AdminTopbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            {/* Default redirect to overview */}
            <Route index element={<Navigate to="overview" replace />} />
            
            {/* All admin pages */}
            <Route path="overview" element={<Overview />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="content" element={<ContentModeration />} />
            <Route path="messages" element={<ContentModeration />} />
            <Route path="wellness" element={<WellnessMonitoring />} />
            <Route path="activity" element={<ActivityLogs />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Catch all - redirect to overview */}
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;