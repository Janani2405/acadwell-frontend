// frontend/src/components/ui/wellness/components/WellnessInsightsCard.jsx
import React from 'react';
import { Lightbulb, TrendingUp, Award, AlertCircle, Sparkles } from 'lucide-react';

const WellnessInsightsCard = ({ insights }) => {
  
  const getInsightIcon = (type) => {
    const icons = {
      'positive': <TrendingUp className="w-5 h-5 text-green-400" />,
      'achievement': <Award className="w-5 h-5 text-yellow-400" />,
      'concern': <AlertCircle className="w-5 h-5 text-red-400" />,
      'suggestion': <Sparkles className="w-5 h-5 text-blue-400" />,
      'info': <Lightbulb className="w-5 h-5 text-purple-400" />
    };
    return icons[type] || <Lightbulb className="w-5 h-5 text-gray-400" />;
  };

  const getInsightBgColor = (type) => {
    const colors = {
      'positive': 'bg-green-500/10 border-green-500/30',
      'achievement': 'bg-yellow-500/10 border-yellow-500/30',
      'concern': 'bg-red-500/10 border-red-500/30',
      'suggestion': 'bg-blue-500/10 border-blue-500/30',
      'info': 'bg-purple-500/10 border-purple-500/30'
    };
    return colors[type] || 'bg-gray-500/10 border-gray-500/30';
  };

  const getInsightTextColor = (type) => {
    const colors = {
      'positive': 'text-green-300',
      'achievement': 'text-yellow-300',
      'concern': 'text-red-300',
      'suggestion': 'text-blue-300',
      'info': 'text-purple-300'
    };
    return colors[type] || 'text-gray-300';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">Wellness Insights</h3>
      </div>
      <p className="text-sm text-gray-400 mb-6">Personalized recommendations for you</p>

      {/* Insights List */}
      {insights && insights.length > 0 ? (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getInsightBgColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className={`text-sm ${getInsightTextColor(insight.type)}`}>
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Log more moods to get personalized insights
          </p>
        </div>
      )}

      {/* General Tips */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">Quick Tips</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0"></div>
            <p className="text-xs text-gray-400">Log your mood daily for better insights</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0"></div>
            <p className="text-xs text-gray-400">Be honest about how you're feeling</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0"></div>
            <p className="text-xs text-gray-400">Reach out if you need support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessInsightsCard;