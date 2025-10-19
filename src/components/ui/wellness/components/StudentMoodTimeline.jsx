// frontend/src/components/ui/wellness/components/StudentMoodTimeline.jsx
import React from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StudentMoodTimeline = ({ moodTimeline, trends }) => {
  
  const getLevelColor = (level) => {
    const colors = {
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'orange': 'bg-orange-500',
      'red': 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getTrendIcon = () => {
    if (!trends?.trend) return <Minus className="w-5 h-5 text-gray-400" />;
    if (trends.trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (trends.trend === 'worsening') return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getTrendText = () => {
    if (!trends?.trend) return 'Stable';
    if (trends.trend === 'improving') return 'Improving';
    if (trends.trend === 'worsening') return 'Worsening';
    return 'Stable';
  };

  const getTrendColor = () => {
    if (!trends?.trend) return 'text-gray-400';
    if (trends.trend === 'improving') return 'text-green-400';
    if (trends.trend === 'worsening') return 'text-red-400';
    return 'text-gray-400';
  };

  // Get max score for scaling
  const maxScore = Math.max(...moodTimeline.map(m => m.score || 0), 100);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-bold text-white">Mood Timeline</h3>
          </div>
          <p className="text-sm text-gray-400">Last 30 days</p>
        </div>

        {/* Trend Indicator */}
        {trends && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${getTrendColor()}`}>
              {getTrendText()}
            </span>
          </div>
        )}
      </div>

      {/* Timeline Chart */}
      {moodTimeline && moodTimeline.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-end justify-between gap-1 h-48">
            {moodTimeline.slice(0, 30).reverse().map((entry, index) => {
              const height = entry.score ? (100 - entry.score) : 0; // Invert: lower score = taller bar (better mood)
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end group relative min-w-0">
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${getLevelColor(entry.level)} hover:opacity-80 cursor-pointer`}
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 border border-white/20 shadow-xl">
                        <div className="font-semibold">{entry.date}</div>
                        {entry.has_note && (
                          <div className="text-gray-300 mt-1">📝 Has note</div>
                        )}
                        <div className="text-gray-400 mt-1">Score: {entry.score}</div>
                      </div>
                    </div>
                  </div>

                  {/* Date label (show every 5th) */}
                  {index % 5 === 0 && (
                    <div className="text-xs text-gray-500 mt-2 rotate-45 origin-top-left">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Y-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Better</span>
            <span>Worse</span>
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No mood data available</p>
          </div>
        </div>
      )}

      {/* Trend Analysis */}
      {trends && trends.trend && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Current Average</div>
            <div className="text-xl font-bold text-white">
              {trends.current_average?.toFixed(1) || 'N/A'}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Change</div>
            <div className={`text-xl font-bold ${
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
        </div>
      )}

      {/* Interpretation */}
      {trends?.trend === 'improving' && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-300">
            ✨ Good news! This student's mood has been improving.
          </p>
        </div>
      )}
      
      {trends?.trend === 'worsening' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">
            ⚠️ This student's mood has been declining. Consider reaching out.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentMoodTimeline;