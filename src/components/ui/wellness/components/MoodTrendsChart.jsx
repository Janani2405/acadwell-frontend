import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

const MoodTrendsChart = ({ moodCalendar, trends }) => {
  
  const chartData = useMemo(() => {
    if (!moodCalendar) return [];

    let entries = Array.isArray(moodCalendar) ? moodCalendar : [];
    
    const processedData = entries.map((entry, index) => {
      const date = entry?.date || '';
      const level = entry?.dominant_level || entry?.level || 'green';
      const emoji = entry?.emoji || '';
      
      let score = entry?.score;
      if (score === undefined || score === null) {
        score = calculateScoreFromLevel(level);
      }
      
      const hasNote = entry?.moods?.some(m => m.note) || false;

      return {
        index,
        date,
        score: Number(score),
        level,
        emoji,
        hasNote
      };
    })
    .filter(item => item.date && item.date.length > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

    return processedData;
  }, [moodCalendar]);

  const getTrendIcon = () => {
    if (!trends?.trend) return <Minus className="w-5 h-5 text-gray-400" />;
    if (trends.trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (trends.trend === 'worsening') return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getTrendText = () => {
    if (!trends?.trend) return 'Stable';
    if (trends.trend === 'improving') return 'Improving';
    if (trends.trend === 'worsening') return 'Declining';
    return 'Stable';
  };

  const getTrendColor = () => {
    if (!trends?.trend) return 'text-gray-400';
    if (trends.trend === 'improving') return 'text-green-400';
    if (trends.trend === 'worsening') return 'text-red-400';
    return 'text-gray-400';
  };

  const getLevelLabel = (level) => {
    const labels = {
      'green': 'Excellent',
      'yellow': 'Good',
      'orange': 'Concerning',
      'red': 'Critical'
    };
    return labels[level] || 'Unknown';
  };

  const getLevelColor = (level) => {
    const colors = {
      'green': { bg: 'bg-green-500', light: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40' },
      'yellow': { bg: 'bg-yellow-500', light: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
      'orange': { bg: 'bg-orange-500', light: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
      'red': { bg: 'bg-red-500', light: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40' }
    };
    return colors[level] || colors['yellow'];
  };

  const displayData = chartData.slice(-14); // Show last 14 days

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-bold text-white">Mood Trends</h3>
          </div>
          <p className="text-sm text-gray-400">
            {displayData.length} days of data
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
          {getTrendIcon()}
          <span className={`text-sm font-semibold ${getTrendColor()}`}>
            {getTrendText()}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 pb-4 border-b border-white/10">
        {['green', 'yellow', 'orange', 'red'].map(level => {
          const colors = getLevelColor(level);
          const count = displayData.filter(d => d.level === level).length;
          return (
            <div key={level} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${colors.bg}`}></div>
              <span className="text-xs text-gray-300">
                {getLevelLabel(level)} ({count})
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart Area */}
      {displayData.length > 0 ? (
        <div className="mb-6">
          {/* Line chart visualization */}
          <div className="space-y-4">
            {/* Grid background */}
            <div className="relative">
              {/* Mood level zones */}
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                <div className="flex-1 border-t border-white/5"></div>
                <div className="flex-1 border-t border-white/5"></div>
                <div className="flex-1 border-t border-white/5"></div>
                <div className="flex-1"></div>
              </div>

              {/* Zone labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-600 font-medium pointer-events-none -ml-12">

                <span>Critical</span>
                <span>Concerning</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>

              {/* Data points container */}
              <div className="flex items-end justify-between gap-2 h-64 px-4 py-8 bg-white/5 rounded-xl relative">
                {displayData.map((entry, idx) => {
                  const colors = getLevelColor(entry.level);
                  // Invert score: lower = better (top), higher = worse (bottom)
                  const yPosition = (entry.score / 100) * 100; // 0-100%
                  
                  return (
                    <div
                      key={`${entry.date}-${idx}`}
                      className="flex-1 relative flex flex-col items-center group"
                      style={{ height: '100%' }}
                    >
                      {/* Point on chart */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-white cursor-pointer transition-all hover:scale-150 ${colors.bg}`}
                        style={{
                          position: 'absolute',
                          bottom: `${yPosition}%`,
                          boxShadow: '0 0 12px rgba(0,0,0,0.5)'
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className={`${colors.light} ${colors.border} border rounded-lg px-3 py-2 text-xs whitespace-nowrap`}>
                            <div className="font-semibold text-white">{formatFullDate(entry.date)}</div>
                            <div className={`${colors.text} mt-1`}>
                              {entry.emoji || getMoodEmoji(entry.level)} {getLevelLabel(entry.level)}
                            </div>
                            <div className="text-gray-300 mt-1">Score: {entry.score}</div>
                            {entry.hasNote && <div className="text-gray-400 mt-1">Has note</div>}
                          </div>
                        </div>
                      </div>

                      {/* Date label */}
                      {displayData.length <= 7 || idx % Math.ceil(displayData.length / 7) === 0 ? (
                        <div className="text-xs text-gray-500 mt-2 text-center absolute -bottom-6">
                          {formatDateLabel(entry.date)}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis */}
            <div className="text-xs text-gray-500 text-right pr-4">
              {displayData.length > 0 && `${displayData[0].date} → ${displayData[displayData.length - 1].date}`}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No mood data available</p>
            <p className="text-xs mt-1">Start logging your mood to see trends</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {trends && (
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 mt-6">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Current Average</div>
            <div className="text-2xl font-bold text-white">
              {trends.current_average?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-1">{getLevelLabel(getAverageLevelFromScore(trends.current_average))}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Change</div>
            <div className={`text-2xl font-bold ${
              trends.change_percentage > 0 
                ? 'text-red-400' 
                : trends.change_percentage < 0 
                  ? 'text-green-400' 
                  : 'text-gray-400'
            }`}>
              {trends.change_percentage > 0 ? '+' : ''}
              {trends.change_percentage?.toFixed(1) || '0'}%
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Total Entries</div>
            <div className="text-2xl font-bold text-white">{displayData.length}</div>
          </div>
        </div>
      )}

      {/* Insight */}
      {trends?.trend === 'improving' && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-300">
            Great progress! Your mood has been improving. Keep up the good work!
          </p>
        </div>
      )}
      
      {trends?.trend === 'worsening' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">
            We notice things have been difficult lately. Consider reaching out for support.
          </p>
        </div>
      )}
      
      {trends?.trend === 'stable' && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            Your mood has been relatively stable. Continue your self-care routine!
          </p>
        </div>
      )}
    </div>
  );
};

function calculateScoreFromLevel(level) {
  const scores = {
    'green': 20,
    'yellow': 40,
    'orange': 65,
    'red': 85
  };
  return scores[level] || 50;
}

function getMoodEmoji(level) {
  const emojis = {
    'green': '😊',
    'yellow': '🙂',
    'orange': '😢',
    'red': '😫'
  };
  return emojis[level] || '😐';
}

function formatDateLabel(dateStr) {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr.slice(5);
  }
}

function formatFullDate(dateStr) {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function getAverageLevelFromScore(score) {
  if (score < 30) return 'green';
  if (score < 50) return 'yellow';
  if (score < 70) return 'orange';
  return 'red';
}

export default MoodTrendsChart;