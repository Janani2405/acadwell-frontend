// frontend/src/components/dashboards/admin/AdminTopbar.jsx
/**
 * Admin Topbar
 * Top navigation bar with breadcrumbs and quick actions
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, RefreshCw } from 'lucide-react';

const AdminTopbar = () => {
  const location = useLocation();

  // Get page title from pathname
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    const titles = {
      overview: 'Dashboard Overview',
      users: 'User Management',
      content: 'Content Moderation',
      messages: 'Messages',
      wellness: 'Wellness Monitoring',
      activity: 'Activity Logs',
      settings: 'Settings'
    };
    return titles[path] || 'Admin Dashboard';
  };

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search...</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;