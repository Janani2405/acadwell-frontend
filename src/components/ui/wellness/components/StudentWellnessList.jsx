// frontend/src/components/ui/wellness/components/StudentWellnessList.jsx
import React from 'react';
import { Eye, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentWellnessList = ({ students, loading }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      'red': 'bg-red-500/20 text-red-400 border-red-500/30',
      'orange': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'yellow': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'green': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[status] || colors['green'];
  };

  const getStatusEmoji = (status) => {
    const emojis = { red: '😢', orange: '😟', yellow: '😐', green: '😊' };
    return emojis[status] || '😊';
  };

  const getStatusText = (status) => {
    const texts = { red: 'Critical', orange: 'Concerning', yellow: 'Monitor', green: 'Healthy' };
    return texts[status] || 'Unknown';
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Never';
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
    navigate(`/wellness/student/${studentId}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-white mb-2">All Students Doing Well!</h3>
          <p className="text-gray-400">No students requiring immediate attention at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Students Needing Attention</h3>
          <p className="text-sm text-gray-400 mt-1">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {students.map((student) => (
          <div
            key={student.student_id}
            className={`
              group relative p-4 rounded-xl border-2 transition-all cursor-pointer
              hover:scale-[1.02] hover:shadow-lg
              ${getStatusColor(student.overall_status)}
            `}
            onClick={() => handleViewDetails(student.student_id)}
          >
            <div className="flex items-start justify-between gap-4">
              
              {/* Left: Student Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                
                {/* Emoji & Status Indicator */}
                <div className="relative flex-shrink-0">
                  <div className="text-4xl">{getStatusEmoji(student.overall_status)}</div>
                  {student.needs_attention && (
                    <div className="absolute -top-1 -right-1">
                      <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Student Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-lg truncate group-hover:text-pink-400 transition">
                    {student.name}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="truncate">{student.email}</span>
                    {student.reg_number && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span>{student.reg_number}</span>
                      </>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    
                    {/* Status Badge */}
                    <span className={`
                      inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                      ${getStatusColor(student.overall_status)}
                    `}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {getStatusText(student.overall_status)}
                    </span>

                    {/* Alert Count */}
                    {student.alert_count_7days > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        {student.alert_count_7days} alert{student.alert_count_7days !== 1 ? 's' : ''}
                      </span>
                    )}

                    {/* Recent Mood Count */}
                    {student.recent_mood_count > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                        📊 {student.recent_mood_count} mood{student.recent_mood_count !== 1 ? 's' : ''} logged
                      </span>
                    )}

                    {/* Last Check Time */}
                    {student.last_check && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {getRelativeTime(student.last_check)}
                      </span>
                    )}
                  </div>

                  {/* Last Mood */}
                  {student.last_mood && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Last mood:</span>
                      <span className="text-2xl">{student.last_mood_emoji}</span>
                      <span className="text-gray-400 capitalize">{student.last_mood}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(student.student_id);
                }}
                className="flex-shrink-0 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-110 group-hover:shadow-lg"
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination or Load More (if needed) */}
      {students.length >= 10 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition">
            Load More Students
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentWellnessList;