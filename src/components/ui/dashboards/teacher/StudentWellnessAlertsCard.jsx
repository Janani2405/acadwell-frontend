// frontend/src/components/ui/dashboards/teacher/StudentWellnessAlertsCard.jsx
// Widget showing students needing wellness attention - WITH TAILWIND CSS

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  HeartPulse, 
  Users,
  Activity,
  Eye,
  Clock,
  AlertCircle
} from 'lucide-react';
import { apiCall } from '../../../../api/api';

const StudentWellnessAlertsCard = () => {
  const [studentsData, setStudentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentsData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchStudentsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/wellness/wellness/students-overview', { method: 'GET' });
      setStudentsData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching students wellness data:', err);
      setError('Unable to load student wellness data');
    } finally {
      setLoading(false);
    }
  };

  const getWellnessEmoji = (level) => {
    const emojis = { green: '😊', yellow: '😐', orange: '😟', red: '😢' };
    return emojis[level] || '😊';
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleViewDetails = (studentId) => {
    window.location.href = `/wellness/student/${studentId}`;
  };

  if (loading) {
    return (
      <div className="dashboard-card border-pink-500/30">
        <div className="flex flex-col items-center justify-center py-8">
          <Activity className="w-8 h-8 text-pink-400 animate-spin" />
          <span className="mt-2 text-sm text-gray-400">Loading student wellness data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card border-pink-500/30">
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="mt-2 text-sm text-gray-400">{error}</p>
          <button onClick={fetchStudentsData} className="mt-3 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg text-sm hover:bg-pink-500/30 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { 
    students_needing_attention = [], 
    critical_count = 0, 
    concerning_count = 0,
    total_students = 0
  } = studentsData || {};

  return (
    <div className="dashboard-card border-pink-500/30">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="card-title flex items-center">
            <HeartPulse className="w-5 h-5 mr-2" />
            Student Wellness Alerts
          </h3>
          <p className="card-subtitle">Students needing attention</p>
        </div>
        
        {(critical_count > 0 || concerning_count > 0) && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm font-semibold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            {critical_count + concerning_count}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border-l-3 border-l-red-500 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{critical_count}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Critical</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-orange-500/10 border-l-3 border-l-orange-500 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{concerning_count}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Concern</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-blue-500/10 border-l-3 border-l-blue-500 rounded-lg">
          <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{total_students}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
          </div>
        </div>
      </div>

      {/* Students List */}
      {students_needing_attention.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <HeartPulse className="w-12 h-12 text-green-400 mb-3" />
          <p className="text-base text-gray-300 mb-1">All students are doing well!</p>
          <span className="text-3xl">🎉</span>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {students_needing_attention.slice(0, 3).map((student) => (
              <div 
                key={student.user_id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:border-blue-400 cursor-pointer ${
                  student.status === 'red' ? 'bg-red-500/5 border-red-500/20 border-l-4 border-l-red-500' :
                  student.status === 'orange' ? 'bg-orange-500/5 border-orange-500/20 border-l-4 border-l-orange-500' :
                  'bg-yellow-500/5 border-yellow-500/20 border-l-4 border-l-yellow-500'
                }`}
                onClick={() => handleViewDetails(student.user_id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="text-3xl">{getWellnessEmoji(student.status)}</div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      student.status === 'red' ? 'bg-red-500' :
                      student.status === 'orange' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></div>
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate">{student.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-medium">
                        {student.alert_count} alert{student.alert_count !== 1 ? 's' : ''}
                      </span>
                      {student.last_alert && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(student.last_alert)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(student.user_id);
                  }}
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {students_needing_attention.length > 3 && (
            <button 
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 mb-3"
              onClick={() => window.location.href = '/wellness/students-overview'}
            >
              <Users className="w-4 h-4" />
              View All {students_needing_attention.length} Students
            </button>
          )}
        </>
      )}

      {/* Action Button */}
      <button 
        className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
        onClick={() => window.location.href = '/wellness/students-overview'}
      >
        <Activity className="w-4 h-4" />
        Open Wellness Dashboard
      </button>
    </div>
  );
};

export default StudentWellnessAlertsCard;