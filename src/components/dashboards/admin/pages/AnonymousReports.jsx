// frontend/src/components/dashboards/admin/pages/AnonymousReports.jsx
import React, { useEffect, useState } from 'react';
import adminApi from '../../../../api/admin.api';
import { AlertCircle, CheckCircle, XCircle, Clock, Eye, Shield, RefreshCw } from 'lucide-react';

const AnonymousReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      // This will use the admin API endpoint
      const response = await adminApi.getAnonymousReports(filter);
      
      if (response && response.reports) {
        setReports(response.reports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Make sure the backend endpoint is configured.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await adminApi.updateAnonymousReportStatus(reportId, newStatus);
      alert(`Report marked as ${newStatus}`);
      fetchReports();
    } catch (err) {
      console.error('Error updating report:', err);
      alert('Failed to update report status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock },
      reviewed: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Eye },
      resolved: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: CheckCircle },
      dismissed: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: XCircle }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getReasonBadge = (reason) => {
    const colors = {
      harassment: 'bg-red-500/20 text-red-300',
      spam: 'bg-orange-500/20 text-orange-300',
      inappropriate: 'bg-pink-500/20 text-pink-300',
      threats: 'bg-red-600/20 text-red-400',
      impersonation: 'bg-purple-500/20 text-purple-300',
      other: 'bg-gray-500/20 text-gray-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[reason] || colors.other}`}>
        {reason.charAt(0).toUpperCase() + reason.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            Anonymous Reports
          </h1>
          <p className="text-gray-400">Review and manage anonymous user reports</p>
        </div>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['pending', 'reviewed', 'resolved', 'dismissed', 'all'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-2 text-red-300">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Reports List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p>Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No {filter === 'all' ? '' : filter} reports found</p>
          <p className="text-sm mt-2">Reports will appear here when users flag anonymous content</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map(report => (
            <div
              key={report.report_id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getReasonBadge(report.reason)}
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-gray-400">
                      Reported {new Date(report.created_at).toLocaleDateString()} at{' '}
                      {new Date(report.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reporter & Reported User */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Reporter</div>
                  <div className="text-white font-medium">{report.reporter?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">{report.reporter?.anonId || 'N/A'}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Reported User</div>
                  <div className="text-white font-medium">{report.reported_user?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">{report.reported_user?.anonId || 'N/A'}</div>
                </div>
              </div>

              {/* Details */}
              {report.details && (
                <div className="bg-white/5 p-3 rounded-lg mb-4">
                  <div className="text-xs text-gray-400 mb-1">Details</div>
                  <p className="text-sm text-gray-300">{report.details}</p>
                </div>
              )}

              {/* Conversation ID */}
              <div className="text-xs text-gray-500 mb-4">
                Conversation ID: {report.conversation_id}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {report.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(report.report_id, 'reviewed')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.report_id, 'resolved')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.report_id, 'dismissed')}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </>
                )}
                {report.status === 'reviewed' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(report.report_id, 'resolved')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.report_id, 'dismissed')}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </>
                )}
                
                {report.reviewed_at && (
                  <div className="ml-auto text-xs text-gray-400">
                    Reviewed: {new Date(report.reviewed_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnonymousReports;