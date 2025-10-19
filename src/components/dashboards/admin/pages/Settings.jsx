// frontend/src/components/dashboards/admin/pages/Settings.jsx
/**
 * Admin Settings Page
 * System configuration and admin profile settings
 */

import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Database, Mail, Bell, Save, Shield } from 'lucide-react';
import { useAdminContext } from '../../../../context/AdminContext';

const Settings = () => {
  const { admin } = useAdminContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    username: admin?.username || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Profile updated successfully!');
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 text-sm mt-1">
          Manage system configuration and admin profile
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        <div className="flex border-b border-white/10 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'system', label: 'System', icon: Database },
            { id: 'notifications', label: 'Notifications', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {admin?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{admin?.name || 'Admin'}</h3>
                  <p className="text-gray-400">{admin?.email || 'admin@acadwell.com'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-400 font-medium">Super Admin</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
                <p className="text-gray-400 text-sm">
                  Ensure your account stays secure by using a strong password
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>

              {/* Security Info */}
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mt-6">
                <h4 className="text-blue-400 font-semibold mb-2">Security Tips</h4>
                <ul className="text-blue-300 text-sm space-y-1">
                  <li>• Use a password with at least 8 characters</li>
                  <li>• Include numbers, symbols, and mixed case letters</li>
                  <li>• Don't reuse passwords from other accounts</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">System Information</h3>
                <p className="text-gray-400 text-sm">
                  View system configuration and database status
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Platform Version</p>
                  <p className="text-white font-semibold">AcadWell v2.0.0</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Database</p>
                  <p className="text-green-400 font-semibold">MongoDB (Connected)</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Backend Status</p>
                  <p className="text-green-400 font-semibold">Online</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Last Backup</p>
                  <p className="text-white font-semibold">Manual backup required</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Maintenance Mode</h4>
                <p className="text-yellow-300 text-sm mb-4">
                  Enable maintenance mode to prevent user access during updates
                </p>
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors">
                  Enable Maintenance Mode
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Notification Preferences</h3>
                <p className="text-gray-400 text-sm">
                  Configure how you receive admin notifications
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'critical_alerts', label: 'Critical Wellness Alerts', description: 'Get notified of urgent student wellness concerns' },
                  { id: 'user_reports', label: 'User Reports', description: 'Notifications when users report content' },
                  { id: 'new_registrations', label: 'New User Registrations', description: 'Daily summary of new user signups' },
                  { id: 'system_alerts', label: 'System Alerts', description: 'Important system notifications and errors' }
                ].map((setting) => (
                  <div key={setting.id} className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-gray-400 text-sm">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={() => alert('Notification settings saved!')}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;