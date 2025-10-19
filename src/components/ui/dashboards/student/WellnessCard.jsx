// frontend/src/components/ui/dashboards/student/WellnessCard.jsx
import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  CheckCircle,
  Activity,
  Calendar
} from 'lucide-react';
import { apiCall } from '../../../../api/api';
import MoodLoggingModal from '../../wellness/MoodLoggingModal'; // ✨ Import modal

const WellnessCard = () => {
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false); // ✨ Add modal state
 
  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/wellness/dashboard/student', { method: 'GET' }); // ✨ Fixed endpoint
      setWellnessData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching wellness data:', err);
      setError('Unable to load wellness data');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodLogged = (response) => {
    // Refresh dashboard after logging mood
    fetchWellnessData();
  };

  const getWellnessEmoji = (level) => {
    const emojis = { green: '😊', yellow: '😐', orange: '😟', red: '😢' };
    return emojis[level] || '😊';
  };

  const getWellnessText = (level) => {
    const texts = { green: 'Doing Great', yellow: 'Monitor', orange: 'Needs Support', red: 'Urgent Attention' };
    return texts[level] || 'Unknown';
  };

  const getBorderColor = (level) => {
    const colors = { green: 'border-l-green-500', yellow: 'border-l-yellow-500', orange: 'border-l-orange-500', red: 'border-l-red-500' };
    return colors[level] || 'border-l-green-500';
  };

  const getTextColor = (level) => {
    const colors = { green: 'text-green-400', yellow: 'text-yellow-400', orange: 'text-orange-400', red: 'text-red-400' };
    return colors[level] || 'text-green-400';
  };

  const getTrendIcon = () => {
    if (!wellnessData?.trends) return <Minus className="w-5 h-5 text-gray-400" />;
    const trend = wellnessData.trends.trend;
    if (trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (trend === 'worsening') return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getTrendText = () => {
    if (!wellnessData?.trends) return 'Stable';
    const trend = wellnessData.trends.trend;
    if (trend === 'improving') return 'Improving ✨';
    if (trend === 'worsening') return 'Needs Attention';
    return 'Stable';
  };

  if (loading) {
    return (
      <div className="dashboard-card border-pink-500/30">
        <div className="flex flex-col items-center justify-center py-8">
          <Activity className="w-8 h-8 text-pink-400 animate-spin" />
          <span className="mt-2 text-sm text-gray-400">Loading wellness data...</span>
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
          <button onClick={fetchWellnessData} className="mt-3 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg text-sm hover:bg-pink-500/30 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const level = wellnessData?.overall_status || 'green';
  const summary = wellnessData?.summary || {};
  const trends = wellnessData?.trends || {};

  return (
    <>
      <div className={`dashboard-card border-pink-500/30 border-l-4 ${getBorderColor(level)}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="card-title flex items-center">
            <HeartPulse className="w-5 h-5 mr-2" />
            Wellness Snapshot
          </h3>
          {getTrendIcon()}
        </div>
        <p className="card-subtitle">Your mental health overview</p>

        {/* Current Status */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg my-4">
          <div className="text-5xl">{getWellnessEmoji(level)}</div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Overall Status</span>
            <span className={`text-xl font-semibold mt-1 ${getTextColor(level)}`}>
              {getWellnessText(level)}
            </span>
          </div>
        </div>

        {/* Trend Information */}
        {trends.trend && (
          <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-md mb-4">
            <span className="text-sm text-gray-400">Trend:</span>
            <span className={`text-sm font-semibold ${trends.trend === 'improving' ? 'text-green-400' : trends.trend === 'worsening' ? 'text-red-400' : 'text-gray-400'}`}>
              {getTrendText()}
            </span>
          </div>
        )}

        {/* Stats Summary */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">{summary.total_checks || 0}</span>
              <span className="text-xs text-gray-400">Check-ins</span>
            </div>
          </div>
          
          {summary.level_breakdown && (
            <div className="flex gap-2">
              {summary.level_breakdown.green > 0 && (
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-xs font-semibold" title={`${summary.level_breakdown.green} healthy`}>
                  {summary.level_breakdown.green}
                </div>
              )}
              {summary.level_breakdown.yellow > 0 && (
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full text-xs font-semibold" title={`${summary.level_breakdown.yellow} monitoring`}>
                  {summary.level_breakdown.yellow}
                </div>
              )}
              {summary.level_breakdown.orange > 0 && (
                <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-xs font-semibold" title={`${summary.level_breakdown.orange} concerning`}>
                  {summary.level_breakdown.orange}
                </div>
              )}
              {summary.level_breakdown.red > 0 && (
                <div className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full text-xs font-semibold" title={`${summary.level_breakdown.red} critical`}>
                  {summary.level_breakdown.red}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Encouragement Message */}
        {level === 'green' && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-400 rounded-lg mb-4">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Keep up the great work! 🌟</p>
          </div>
        )}
        
        {level === 'yellow' && (
          <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 text-yellow-400 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Remember to take care of yourself 💙</p>
          </div>
        )}
        
        {(level === 'orange' || level === 'red') && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">We're here to support you ❤️</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            onClick={() => window.location.href = '/wellness/dashboard'}
          >
            View Dashboard
          </button>
          {/* ✨ FIXED: Open modal instead of navigating */}
          <button 
            className="flex-1 py-2 bg-white/5 text-gray-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
            onClick={() => setShowMoodModal(true)}
          >
            Log Mood
          </button>
        </div>
      </div>

      {/* ✨ Add Mood Logging Modal */}
      <MoodLoggingModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onMoodLogged={handleMoodLogged}
      />
    </>
  );
};

export default WellnessCard;