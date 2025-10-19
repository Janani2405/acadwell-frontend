// frontend/src/components/ui/wellness/components/WellnessAlertsTable.jsx
import React from 'react';
import { AlertTriangle, Clock, Eye, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WellnessAlertsTable = ({ students }) => {
  const navigate = useNavigate();

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (status) => {
    if (status === 'red') return 'text-red-400 bg-red-500/20';
    if (status === 'orange') return 'text-orange-400 bg-orange-500/20';
    return 'text-yellow-400 bg-yellow-500/20';
  };

  const getPriorityLabel = (status) => {
    if (status === 'red') return 'URGENT';
    if (status === 'orange') return 'HIGH';
    return 'MEDIUM';
  };

  if (!students || students.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-bold text-white">Recent Alerts</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-sm text-gray-400">No critical alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-bold text-white">Recent Alerts</h3>
        </div>
        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
          {students.length}
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {students.map((student, index) => (
          <div
            key={student.student_id || index}
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition cursor-pointer group"
            onClick={() => navigate(`/wellness/student/${student.student_id}`)}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              
              {/* Student Name & Priority */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm truncate group-hover:text-pink-400 transition">
                  {student.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold
                    ${getPriorityColor(student.overall_status)}
                  `}>
                    <AlertTriangle className="w-3 h-3" />
                    {getPriorityLabel(student.overall_status)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/wellness/student/${student.student_id}`);
                }}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition flex-shrink-0"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Alert Details */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {student.alert_count_7days} alert{student.alert_count_7days !== 1 ? 's' : ''}
              </span>
              {student.last_check && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getRelativeTime(student.last_check)}
                  </span>
                </>
              )}
            </div>

            {/* Last Mood Indicator */}
            {student.last_mood_emoji && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{student.last_mood_emoji}</span>
                  <span className="text-xs text-gray-400 capitalize">
                    {student.last_mood}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      {students.length >= 5 && (
        <button
          onClick={() => navigate('/wellness/students-overview')}
          className="w-full mt-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition"
        >
          View All Alerts
        </button>
      )}
    </div>
  );
};

export default WellnessAlertsTable;