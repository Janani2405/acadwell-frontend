// frontend/src/components/dashboards/admin/AdminSidebar.jsx
/**
 * Admin Sidebar Navigation
 * Navigation menu for admin dashboard
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Heart,
  Activity,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, admin } = useAdminContext();

  const menuItems = [
    {
      name: 'Overview',
      path: '/admin/dashboard/overview',
      icon: LayoutDashboard,
      description: 'Dashboard overview'
    },
    {
      name: 'Users',
      path: '/admin/dashboard/users',
      icon: Users,
      description: 'Manage users'
    },
    {
      name: 'Content',
      path: '/admin/dashboard/content',
      icon: FileText,
      description: 'Posts & questions'
    },
    {
      name: 'Messages',
      path: '/admin/dashboard/messages',
      icon: MessageSquare,
      description: 'View messages'
    },
    {
      name: 'Wellness',
      path: '/admin/dashboard/wellness',
      icon: Heart,
      description: 'Wellness alerts'
    },
    {
      name: 'Activity',
      path: '/admin/dashboard/activity',
      icon: Activity,
      description: 'Activity logs'
    },
    {
      name: 'Anonymous Reports',
      path: '/admin/anonymous-reports',
      icon: Shield,
      badge: null // Optional: You can add a badge count later
    },
    {
      name: 'Settings',
      path: '/admin/dashboard/settings',
      icon: Settings,
      description: 'System settings'
    }
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">AcadWell</p>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {admin?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {admin?.username || 'admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-400'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs opacity-75">{item.description}</p>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;