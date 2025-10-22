// frontend/src/components/ui/dashboards/student/ProgressCard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStudentWellnessDashboard } from '../../../../api/wellnessApi';

const ProgressCard = () => {
  const navigate = useNavigate();
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      const data = await getStudentWellnessDashboard();
      console.log('📊 Wellness data received:', data);
      console.log('📅 Mood calendar:', data?.mood_calendar);
      setWellnessData(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching wellness data:', err);
      setError('Unable to load mood trends');
    } finally {
      setLoading(false);
    }
  };

  // Process mood calendar data for mini chart
  const chartData = useMemo(() => {
    if (!wellnessData?.mood_calendar) {
      console.log('⚠️ No mood_calendar in wellness data');
      return [];
    }

    let entries = Array.isArray(wellnessData.mood_calendar) ? wellnessData.mood_calendar : [];
    console.log('📝 Raw entries:', entries);
    
    const processedData = entries
      .map((entry, index) => {
        const date = entry?.date || '';
        const level = entry?.dominant_level || entry?.level || 'green';
        const emoji = entry?.emoji || getMoodEmoji(level);
        
        let score = entry?.score;
        if (score === undefined || score === null) {
          score = calculateScoreFromLevel(level);
        }

        return {
          index,
          date,
          score: Number(score),
          level,
          emoji
        };
      })
      .filter(item => item.date && item.date.length > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days only

    console.log('✅ Processed chart data:', processedData);
    return processedData;
  }, [wellnessData]);

  const getTrendIcon = () => {
    if (!wellnessData?.trends?.trend) return <Minus className="w-4 h-4 text-gray-400" />;
    const trend = wellnessData.trends.trend;
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'worsening') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!wellnessData?.trends?.trend) return 'text-gray-400';
    const trend = wellnessData.trends.trend;
    if (trend === 'improving') return 'text-green-400';
    if (trend === 'worsening') return 'text-red-400';
    return 'text-gray-400';
  };

  const getLevelColor = (level) => {
    const colors = {
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'orange': 'bg-orange-500',
      'red': 'bg-red-500'
    };
    return colors[level] || 'bg-yellow-500';
  };

  const formatDateLabel = (dateStr) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    } catch (e) {
      return dateStr.slice(8, 10);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card progress-card">
        <div className="flex flex-col items-center justify-center py-8">
          <Activity className="w-8 h-8 text-yellow-400 animate-spin" />
          <span className="mt-2 text-sm text-gray-400">Loading mood trends...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card progress-card">
        <h3 className="card-title">Mood Trends</h3>
        <p className="card-subtitle">7-day mood overview</p>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl mb-3">😔</div>
          <p className="text-sm text-gray-400 text-center">{error}</p>
          <button
            onClick={fetchWellnessData}
            className="mt-3 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const trends = wellnessData?.trends || {};

  return (
    <div className="dashboard-card progress-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="card-title flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Mood Trends
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
          {getTrendIcon()}
          <span className={`text-xs font-semibold ${getTrendColor()}`}>
            {trends.trend === 'improving' ? 'Up' : trends.trend === 'worsening' ? 'Down' : 'Stable'}
          </span>
        </div>
      </div>
      <p className="card-subtitle">7-day mood overview</p>

      {/* Mini Chart */}
      <div className="my-4">
        {chartData.length > 0 ? (
          <div className="relative bg-gradient-to-b from-white/5 to-transparent rounded-xl p-4 border border-white/10">
            {/* Background grid */}
            <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-dashed border-white/10"></div>
              <div className="border-t border-dashed border-white/10"></div>
              <div className="border-t border-dashed border-white/10"></div>
            </div>

            {/* Chart bars */}
            <div className="flex items-end justify-between gap-2 relative z-10" style={{ height: '120px' }}>
              {chartData.map((entry, idx) => {
                // Calculate height: LOWER score = BETTER mood = TALLER bar
                const rawHeight = 100 - entry.score; // Invert the score
                const heightPercent = Math.max(20, Math.min(95, rawHeight)); // Clamp between 20-95%
                
                console.log(`Bar ${idx}:`, { 
                  date: entry.date, 
                  level: entry.level, 
                  score: entry.score, 
                  heightPercent 
                });
                
                return (
                  <div
                    key={`mood-${entry.date}-${idx}`}
                    className="flex-1 flex flex-col items-center group"
                    style={{ height: '100%' }}
                  >
                    {/* Bar container */}
                    <div className="w-full flex flex-col justify-end" style={{ height: '100%', position: 'relative' }}>
                      {/* The actual bar */}
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${getLevelColor(entry.level)} hover:brightness-125 cursor-pointer relative shadow-lg`}
                        style={{ height: `${heightPercent}%` }}
                        title={`${entry.emoji} - ${formatDateLabel(entry.date)} (Score: ${entry.score})`}
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-lg"></div>
                        
                        {/* Emoji tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          {entry.emoji}
                        </div>
                      </div>
                    </div>

                    {/* Day label below bar */}
                    <span className="text-[10px] text-gray-400 font-bold tracking-wider mt-2">
                      {formatDateLabel(entry.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-sm text-gray-400 mb-1">No mood data yet</p>
              <p className="text-xs text-gray-500">Start logging to see trends!</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-white/10">
        <div className="text-center bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-2xl font-bold text-white">
            {trends.current_average?.toFixed(0) || '31'}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">Avg Score</div>
        </div>
        <div className="text-center bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/10">
          <div className={`text-2xl font-bold ${
            trends.change_percentage > 0 
              ? 'text-red-400' 
              : trends.change_percentage < 0 
                ? 'text-green-400' 
                : 'text-gray-400'
          }`}>
            {trends.change_percentage > 0 ? '+' : ''}
            {trends.change_percentage?.toFixed(0) || '-9'}%
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">Change</div>
        </div>
      </div>

      {/* View Dashboard Button */}
      <button 
        onClick={() => navigate('/wellness/dashboard')}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 font-semibold text-sm text-white hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-200"
      >
        <Eye className="w-4 h-4" />
        View Full Dashboard
      </button>
    </div>
  );
};

// Helper functions
function calculateScoreFromLevel(level) {
  const scores = {
    'green': 20,    // Best mood - LOW score = TALL bar (80% height)
    'yellow': 45,   // Good mood - score 45 = 55% height
    'orange': 70,   // Concerning - score 70 = 30% height
    'red': 85       // Critical - HIGH score = SHORT bar (15% height)
  };
  return scores[level] || 50;
}

function getMoodEmoji(level) {
  const emojis = {
    'green': '😊',
    'yellow': '😐',
    'orange': '😟',
    'red': '😢'
  };
  return emojis[level] || '😊';
}

export default ProgressCard;