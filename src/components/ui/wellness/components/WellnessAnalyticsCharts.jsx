// frontend/src/components/ui/wellness/components/WellnessAnalyticsCharts.jsx
import React from 'react';
import { BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react';

const WellnessAnalyticsCharts = ({ summary }) => {
  
  const total = summary?.total_students || 0;
  const critical = summary?.critical || 0;
  const concerning = summary?.concerning || 0;
  const monitor = summary?.monitor || 0;
  const healthy = summary?.healthy || 0;

  // Calculate percentages
  const getPercentage = (value) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  // Calculate overall health score (0-100, higher is better)
  const healthScore = total > 0
    ? Math.round(((healthy * 100 + monitor * 60 + concerning * 30 + critical * 0) / total / 100) * 100)
    : 0;

  const getHealthScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthScoreLabel = (score) => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Needs Attention';
    return 'Critical';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-white">Class Analytics</h3>
      </div>

      {/* Overall Health Score */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Overall Health Score</span>
          <TrendingUp className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-end gap-3">
          <div className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
            {healthScore}
          </div>
          <div className="text-sm text-gray-400 mb-1">/ 100</div>
        </div>
        <div className="mt-2">
          <span className={`text-xs font-semibold ${getHealthScoreColor(healthScore)}`}>
            {getHealthScoreLabel(healthScore)}
          </span>
        </div>
      </div>

      {/* Distribution Breakdown */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-400">Wellness Distribution</h4>
        
        {/* Healthy */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{healthy}</span>
              <span className="text-xs text-gray-500">({getPercentage(healthy)}%)</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${getPercentage(healthy)}%` }}
            ></div>
          </div>
        </div>

        {/* Monitor */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Monitor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{monitor}</span>
              <span className="text-xs text-gray-500">({getPercentage(monitor)}%)</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${getPercentage(monitor)}%` }}
            ></div>
          </div>
        </div>

        {/* Concerning */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-300">Concerning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{concerning}</span>
              <span className="text-xs text-gray-500">({getPercentage(concerning)}%)</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${getPercentage(concerning)}%` }}
            ></div>
          </div>
        </div>

        {/* Critical */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{critical}</span>
              <span className="text-xs text-gray-500">({getPercentage(critical)}%)</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500 animate-pulse"
              style={{ width: `${getPercentage(critical)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-xl font-bold text-white">{total}</div>
        </div>
        <div className="p-3 bg-red-500/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">At Risk</span>
          </div>
          <div className="text-xl font-bold text-red-400">{critical + concerning}</div>
        </div>
      </div>

      {/* Recommendations */}
      {(critical > 0 || concerning > 0) && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-300">
            <strong>⚠️ Action Needed:</strong> {critical + concerning} student{critical + concerning !== 1 ? 's' : ''} require{critical + concerning === 1 ? 's' : ''} immediate attention.
          </p>
        </div>
      )}

      {(critical === 0 && concerning === 0 && total > 0) && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-xs text-green-300">
            <strong>✅ Great Job!</strong> All students are in good standing.
          </p>
        </div>
      )}
    </div>
  );
};

export default WellnessAnalyticsCharts;