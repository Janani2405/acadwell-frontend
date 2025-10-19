// frontend/src/components/dashboards/admin/pages/WellnessMonitoring.jsx
/**
 * Wellness Monitoring Page
 * Monitor student wellness alerts and mental health trends
 */

import React, { useState, useEffect } from 'react';
import { Heart, AlertTriangle, TrendingDown, User, Calendar, RefreshCw } from 'lucide-react';
import axiosInstance from '../../../../api/axios.instance';

const WellnessMonitoring = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, critical, high, resolved
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    resolved: 0
  });

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/wellness/alerts', {
        params: filter !== 'all' ? { severity: filter } : {}
      });
      
      if (response.data.alerts) {
        setAlerts(response.data.alerts);
        calculateStats(response.data.alerts);
      }
    } catch (error) {
      console.error('Error loading wellness alerts:', error);
      // Try alternative endpoint
      try {
        const response = await axiosInstance.get('/api/mental-health/alerts');
        if (response.data.alerts) {
          setAlerts(response.data.alerts);
          calculateStats(response.data.alerts);
        }
      } catch (err) {
        console.error('Alternative endpoint also failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (alertsList) => {
    const stats = {
      total: alertsList.length,
      critical: alertsList.filter(a => a.severity === 'critical').length,
      high: alertsList.filter(a => a.severity === 'high').length,
      medium: alertsList.filter(a => a.severity === 'medium').length,
      resolved: alertsList.filter(a => a.resolved).length
    };
    setStats(stats);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      low: 'bg-green-500/20 text-green-400 border-green-500/50'
    };
    return colors[severity] || colors.medium;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
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
          <h2 className="text-2xl font-bold text-white">Wellness Monitoring</h2>
          <p className="text-gray-400 text-sm mt-1">
            Track student mental health and wellness alerts
          </p>
        </div>
        
        <button
          onClick={loadAlerts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-400">Total Alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-red-500/10 backdrop-blur-xl rounded-xl p-4 border border-red-500/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
              <p className="text-xs text-red-300">Critical</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-500/10 backdrop-blur-xl rounded-xl p-4 border border-orange-500/50">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-orange-400">{stats.high}</p>
              <p className="text-xs text-orange-300">High</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
              <p className="text-xs text-yellow-300">Medium</p>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/50">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
              <p className="text-xs text-green-300">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
        <div className="flex flex-wrap gap-2">
          {['all', 'critical', 'high', 'medium', 'resolved'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === filterOption
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading wellness alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No wellness alerts found</p>
              <p className="text-gray-500 text-sm">
                {filter !== 'all' 
                  ? `No ${filter} severity alerts at this time` 
                  : 'All students are doing well!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={alert.alert_id || index}
                  className={`rounded-lg p-6 border-2 ${
                    alert.resolved 
                      ? 'bg-green-500/5 border-green-500/30' 
                      : `bg-white/5 border ${getSeverityColor(alert.severity)}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(alert.severity)}`}>
                          {alert.severity || 'Medium'}
                        </span>
                        {alert.resolved && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                            ✓ Resolved
                          </span>
                        )}
                      </div>

                      {/* Student Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">
                          {alert.student_name || 'Student'}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm">
                          ID: {alert.student_id || 'Unknown'}
                        </span>
                      </div>

                      {/* Alert Details */}
                      <p className="text-gray-300 mb-3">
                        <span className="font-semibold">Reason:</span> {alert.reason || alert.message || 'Mental health concern detected'}
                      </p>

                      {/* Trigger Info */}
                      {alert.trigger_type && (
                        <p className="text-gray-400 text-sm mb-2">
                          <span className="font-semibold">Trigger:</span> {alert.trigger_type}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(alert.created_at || alert.timestamp)}</span>
                        </div>
                        {alert.mood_score && (
                          <>
                            <span>•</span>
                            <span>Mood Score: {alert.mood_score}/10</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => window.open(`/wellness/student/${alert.student_id}`, '_blank')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                      {!alert.resolved && (
                        <button
                          onClick={() => alert('Resolve feature coming soon!')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessMonitoring;