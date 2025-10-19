// frontend/src/components/dashboards/admin/components/StatsCard.jsx
/**
 * Stats Card Component
 * Reusable card for displaying statistics
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'purple', 
  subtitle, 
  trend, 
  trendLabel,
  urgent = false 
}) => {
  const colorClasses = {
    purple: 'from-purple-600 to-purple-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    red: 'from-red-600 to-red-700',
    yellow: 'from-yellow-600 to-yellow-700',
    indigo: 'from-indigo-600 to-indigo-700',
    pink: 'from-pink-600 to-pink-700',
    cyan: 'from-cyan-600 to-cyan-700'
  };

  const iconBgClasses = {
    purple: 'bg-purple-500/20',
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    red: 'bg-red-500/20',
    yellow: 'bg-yellow-500/20',
    indigo: 'bg-indigo-500/20',
    pink: 'bg-pink-500/20',
    cyan: 'bg-cyan-500/20'
  };

  return (
    <div className={`
      bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10
      hover:border-white/20 transition-all duration-300
      ${urgent ? 'ring-2 ring-red-500 animate-pulse' : ''}
    `}>
      {/* Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${iconBgClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {urgent && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            Urgent
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <h3 className="text-3xl font-bold text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-sm font-medium text-gray-400">{title}</p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
      )}

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-semibold">{trend}</span>
          {trendLabel && <span className="text-gray-500">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatsCard;