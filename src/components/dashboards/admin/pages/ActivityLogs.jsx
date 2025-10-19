// frontend/src/components/dashboards/admin/pages/ActivityLogs.jsx
/**
 * Activity Logs Page
 * Track all admin actions and system activity
 */

import React, { useState, useEffect } from 'react';
import { Activity, User, Trash2, Ban, CheckCircle, LogIn, RefreshCw, Clock } from 'lucide-react';
import { useAdmin } from '../../../../hooks/useAdmin';

const ActivityLogs = () => {
  const { fetchActivityLogs, loading } = useAdmin();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadLogs();
  }, [pagination.page]);

  const loadLogs = async () => {
    try {
      const data = await fetchActivityLogs({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (data && data.logs) {
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      login: LogIn,
      delete_user: Trash2,
      suspend_user: Ban,
      activate_user: CheckCircle,
      delete_post: Trash2,
      delete_message: Trash2
    };
    const Icon = icons[action] || Activity;
    return <Icon className="w-5 h-5" />;
  };

  const getActionColor = (action) => {
    const colors = {
      login: 'text-green-400 bg-green-500/20',
      delete_user: 'text-red-400 bg-red-500/20',
      suspend_user: 'text-yellow-400 bg-yellow-500/20',
      activate_user: 'text-green-400 bg-green-500/20',
      delete_post: 'text-red-400 bg-red-500/20',
      delete_message: 'text-red-400 bg-red-500/20'
    };
    return colors[action] || 'text-blue-400 bg-blue-500/20';
  };

  const getActionLabel = (action) => {
    const labels = {
      login: 'Admin Login',
      delete_user: 'User Deleted',
      suspend_user: 'User Suspended',
      activate_user: 'User Activated',
      delete_post: 'Post Deleted',
      delete_message: 'Message Deleted'
    };
    return labels[action] || action.replace(/_/g, ' ').toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Activity Logs</h2>
          <p className="text-gray-400 text-sm mt-1">
            Track all admin actions and system activity
          </p>
        </div>
        
        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pagination.total || 0}</p>
              <p className="text-sm text-gray-400">Total Activities</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.action === 'login').length}
              </p>
              <p className="text-sm text-gray-400">Login Activities</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.action?.includes('delete')).length}
              </p>
              <p className="text-sm text-gray-400">Delete Actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6">
          {loading && logs.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No activity logs found</p>
              <p className="text-gray-500 text-sm mt-2">
                Admin actions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div
                  key={log._id || index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Action Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="text-white font-semibold">
                            {getActionLabel(log.action)}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Admin: <span className="text-white">{log.admin_username || 'System'}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.timestamp)}
                        </div>
                      </div>

                      {/* Target Info */}
                      {log.target_user_name && (
                        <div className="bg-white/5 rounded p-3 mt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">Target:</span>
                            <span className="text-white font-medium">
                              {log.target_user_name}
                            </span>
                            {log.target_user_id && (
                              <>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-500">
                                  ID: {log.target_user_id.substring(0, 8)}...
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* IP Address */}
                      {log.ip_address && (
                        <div className="mt-2 text-xs text-gray-500">
                          IP: {log.ip_address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} logs
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="text-white px-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages || loading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;