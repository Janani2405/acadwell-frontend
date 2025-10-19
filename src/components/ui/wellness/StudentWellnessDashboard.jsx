// frontend/src/components/ui/wellness/StudentWellnessDashboard.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStudentWellnessDashboard } from '../../../api/wellnessApi';

// Import child components
import MoodLoggingModal from './MoodLoggingModal';
import MoodHistoryCalendar from './components/MoodHistoryCalendar';
import MoodTrendsChart from './components/MoodTrendsChart';
import WellnessInsightsCard from './components/WellnessInsightsCard';
import ResourcesCard from './components/ResourcesCard';
import MoodStatsCard from './components/MoodStatsCard';

const StudentWellnessDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getStudentWellnessDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Unable to load wellness dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodLogged = (response) => {
    // Refresh dashboard after logging mood
    fetchDashboardData();
  };

  const getStatusColor = (status) => {
    const colors = {
      'green': 'text-green-400',
      'yellow': 'text-yellow-400',
      'orange': 'text-orange-400',
      'red': 'text-red-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusText = (status) => {
    const texts = {
      'green': 'Doing Great',
      'yellow': 'Monitoring',
      'orange': 'Needs Support',
      'red': 'Urgent Attention'
    };
    return texts[status] || 'Unknown';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      'green': '😊',
      'yellow': '😐',
      'orange': '😟',
      'red': '😢'
    };
    return emojis[status] || '😐';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-pink-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-red-500/30">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = dashboardData?.overall_status || 'green';
  const stats = dashboardData?.statistics || {};
  const recentEntries = dashboardData?.recent_entries || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20">
      
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/student')}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Wellness Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">Track your mental health journey</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowMoodModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition"
            >
              <Plus className="w-5 h-5" />
              Log Mood
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Current Status Banner */}
        <div className="mb-8 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-7xl">{getStatusEmoji(status)}</div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Current Status</p>
                <h2 className={`text-3xl font-bold mt-1 ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </h2>
                {dashboardData?.last_check && (
                  <p className="text-sm text-gray-500 mt-2">
                    Last checked: {new Date(dashboardData.last_check).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.total_entries || 0}</div>
                <div className="text-sm text-gray-400">Total Entries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.current_streak || 0}</div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Left Column - Stats & Insights */}
          <div className="lg:col-span-1 space-y-6">
            <MoodStatsCard statistics={stats} />
            <WellnessInsightsCard insights={dashboardData?.insights || []} />
          </div>

          {/* Middle/Right Column - Charts & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <MoodTrendsChart 
              moodCalendar={dashboardData?.mood_calendar || []}
              trends={dashboardData?.trends || {}}
            />
            <MoodHistoryCalendar 
              moodCalendar={dashboardData?.mood_calendar || []}
              recentEntries={recentEntries}
            />
          </div>
        </div>

        {/* Resources Section */}
        <ResourcesCard />
      </div>

      {/* Mood Logging Modal */}
      <MoodLoggingModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onMoodLogged={handleMoodLogged}
      />
    </div>
  );
};

export default StudentWellnessDashboard;