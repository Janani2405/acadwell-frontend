// frontend/src/components/dashboards/admin/components/UserTable.jsx
/**
 * User Table Component
 * Displays users in a table with actions
 */

import React from 'react';
import { Trash2, Ban, CheckCircle, Eye } from 'lucide-react';

const UserTable = ({ users, onDelete, onToggleStatus }) => {
  const getRoleBadge = (role) => {
    const colors = {
      student: 'bg-blue-500/20 text-blue-400',
      teacher: 'bg-green-500/20 text-green-400',
      others: 'bg-purple-500/20 text-purple-400'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[role] || 'bg-gray-500/20 text-gray-400'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
        Suspended
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">User</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Role</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Joined</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Last Active</th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.user_id} className="hover:bg-white/5 transition-colors">
              {/* User Info */}
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                  {user.role === 'student' && user.field && (
                    <div className="text-xs text-gray-500 mt-1">{user.field}</div>
                  )}
                  {user.role === 'teacher' && user.department && (
                    <div className="text-xs text-gray-500 mt-1">{user.department}</div>
                  )}
                </div>
              </td>

              {/* Role */}
              <td className="px-6 py-4">
                {getRoleBadge(user.role)}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                {getStatusBadge(user.is_active !== false)}
              </td>

              {/* Joined Date */}
              <td className="px-6 py-4 text-sm text-gray-400">
                {formatDate(user.created_at)}
              </td>

              {/* Last Active */}
              <td className="px-6 py-4 text-sm text-gray-400">
                {formatDate(user.last_login)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  {/* View Details */}
                  <button
                    onClick={() => alert(`View details for ${user.name} - Feature coming soon!`)}
                    className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Toggle Status */}
                  <button
                    onClick={() => onToggleStatus(user.user_id, user.is_active !== false, user.name)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.is_active !== false
                        ? 'hover:bg-yellow-500/20 text-yellow-400'
                        : 'hover:bg-green-500/20 text-green-400'
                    }`}
                    title={user.is_active !== false ? 'Suspend User' : 'Activate User'}
                  >
                    {user.is_active !== false ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(user.user_id, user.name)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;