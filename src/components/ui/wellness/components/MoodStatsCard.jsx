// frontend/src/components/ui/wellness/components/MoodStatsCard.jsx
import React from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

const MoodStatsCard = ({ statistics }) => {
  
  const stats = statistics || {};
  const levelBreakdown = stats.level_breakdown || { green: 0, yellow: 0, orange: 0, red: 0 };
  const total = stats.total_entries || 0;

  // Calculate percentages
  const getPercentage = (count) => {
    if (total === 0) return 0;
    return ((count / total) * 100).toFixed(1);
  };

  // Get average score display
  const getAverageDisplay = () => {
    if (!stats.average_score) return '0.0';
    return stats.average_score.toFixed(1);
  };

  // Get wellness summary text
  const getWellnessSummary = () => {
    const avg = stats.average_score || 0;
    if (avg < 25) return 'Excellent';
    if (avg < 40) return 'Very Good';
    if (avg < 60) return 'Good';
    if (avg < 75) return 'Fair';
    return 'Needs Support';
  };

  // Get summary color
  const getSummaryColor = () => {
    const avg = stats.average_score || 0;
    if (avg < 25) return 'text-green-400';
    if (avg < 40) return 'text-green-400';
    if (avg < 60) return 'text-yellow-400';
    if (avg < 75) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">Your Stats</h3>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        
        {/* Total Entries */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/50 transition">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-3xl font-bold text-white">{total}</div>
          <div className="text-xs text-gray-500 mt-1">Mood Entries</div>
        </div>

        {/* Current Streak */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-500/50 transition">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Streak</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.current_streak || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Days</div>
        </div>

        {/* Average Score */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-green-500/50 transition">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Average</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {getAverageDisplay()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Score</div>
        </div>

        {/* Wellness Level Status */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Status</span>
          </div>
          <div className={`text-2xl font-bold ${getSummaryColor()}`}>
            {getWellnessSummary()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Overall</div>
        </div>
      </div>

      {/* Distribution Progress Bar */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-red-400"></div>
          <span className="text-sm font-semibold text-gray-300">Mood Distribution</span>
        </div>
        <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-gray-900">
          {levelBreakdown.green > 0 && (
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${getPercentage(levelBreakdown.green)}%` }}
              title={`Great: ${getPercentage(levelBreakdown.green)}%`}
            />
          )}
          {levelBreakdown.yellow > 0 && (
            <div 
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${getPercentage(levelBreakdown.yellow)}%` }}
              title={`Okay: ${getPercentage(levelBreakdown.yellow)}%`}
            />
          )}
          {levelBreakdown.orange > 0 && (
            <div 
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${getPercentage(levelBreakdown.orange)}%` }}
              title={`Struggling: ${getPercentage(levelBreakdown.orange)}%`}
            />
          )}
          {levelBreakdown.red > 0 && (
            <div 
              className="h-full bg-red-500 transition-all duration-500 animate-pulse"
              style={{ width: `${getPercentage(levelBreakdown.red)}%` }}
              title={`Difficult: ${getPercentage(levelBreakdown.red)}%`}
            />
          )}
          {total === 0 && (
            <div className="h-full w-full bg-gray-700" />
          )}
        </div>
      </div>

      {/* Level Breakdown Details */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-400">Mood Breakdown</h4>
        
        {/* Green - Great Days */}
        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:border-green-500/40 transition">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <div className="text-sm font-semibold text-white">Great Days</div>
              <div className="text-xs text-gray-400">Feeling good</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-400">{levelBreakdown.green}</span>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
              {getPercentage(levelBreakdown.green)}%
            </span>
          </div>
        </div>

        {/* Yellow - Okay Days */}
        <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="text-sm font-semibold text-white">Okay Days</div>
              <div className="text-xs text-gray-400">Getting by</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-yellow-400">{levelBreakdown.yellow}</span>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
              {getPercentage(levelBreakdown.yellow)}%
            </span>
          </div>
        </div>

        {/* Orange - Struggling Days */}
        <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:border-orange-500/40 transition">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <div>
              <div className="text-sm font-semibold text-white">Struggling Days</div>
              <div className="text-xs text-gray-400">Need support</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-orange-400">{levelBreakdown.orange}</span>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
              {getPercentage(levelBreakdown.orange)}%
            </span>
          </div>
        </div>

        {/* Red - Difficult Days */}
        <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:border-red-500/40 transition">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div>
              <div className="text-sm font-semibold text-white">Difficult Days</div>
              <div className="text-xs text-gray-400">Crisis support needed</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-400">{levelBreakdown.red}</span>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
              {getPercentage(levelBreakdown.red)}%
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Metrics</h4>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="font-bold text-white">{total > 0 ? Math.round((levelBreakdown.green / total) * 100) : 0}%</div>
            <div className="text-gray-400">Healthy</div>
          </div>
          <div>
            <div className="font-bold text-white">{stats.current_streak || 0}</div>
            <div className="text-gray-400">Day Streak</div>
          </div>
          <div>
            <div className="font-bold text-white">{total}</div>
            <div className="text-gray-400">Logged</div>
          </div>
        </div>
      </div>

      {/* Encouragement Message */}
      {total === 0 ? (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300 text-center">
            Start logging your mood daily to build insights! 📊
          </p>
        </div>
      ) : total >= 14 ? (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-300 text-center font-semibold">
            Excellent consistency! You've logged {total} mood entries 🌟
          </p>
          <p className="text-xs text-green-400 text-center mt-1">
            Keep going - tracking helps identify patterns and supports your wellbeing
          </p>
        </div>
      ) : total >= 7 ? (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-300 text-center font-semibold">
            Great start! Keep logging for better insights 💪
          </p>
          <p className="text-xs text-purple-400 text-center mt-1">
            {14 - total} more entries to unlock better analytics
          </p>
        </div>
      ) : (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-sm text-amber-300 text-center font-semibold">
            Log {7 - total} more moods to see trends 📈
          </p>
          <p className="text-xs text-amber-400 text-center mt-1">
            Daily logging helps us provide better wellness insights
          </p>
        </div>
      )}

      {/* Progress indicator - Visual feedback */}
      {total > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Wellness Goal Progress</span>
            <span className="text-gray-500">{Math.min(Math.round((total / 30) * 100), 100)}%</span>
          </div>
          <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
              style={{ width: `${Math.min((total / 30) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {30 - total <= 0 
              ? "You've reached the 30-day logging milestone!" 
              : `Log ${30 - total} more entries to reach 30-day goal`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodStatsCard;