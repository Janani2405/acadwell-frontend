// frontend/src/components/ui/wellness/TeacherWellnessOverview.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Filter, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTeacherWellnessOverview } from '../../../api/wellnessApi';

// Import child components
import StudentWellnessList from './components/StudentWellnessList';
import WellnessAlertsTable from './components/WellnessAlertsTable';
import WellnessAnalyticsCharts from './components/WellnessAnalyticsCharts';

const TeacherWellnessOverview = () => {
  const navigate = useNavigate();
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all'); // all, critical, concerning, monitor
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOverviewData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchOverviewData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const data = await getTeacherWellnessOverview();
      setOverviewData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching overview:', err);
      setError('Unable to load wellness overview');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchOverviewData();
  };

  const filterStudents = (students) => {
    if (!students) return [];
    
    let filtered = students;
    
    // Filter by level
    if (filterLevel !== 'all') {
      if (filterLevel === 'critical') {
        filtered = filtered.filter(s => s.overall_status === 'red');
      } else if (filterLevel === 'concerning') {
        filtered = filtered.filter(s => s.overall_status === 'orange');
      } else if (filterLevel === 'monitor') {
        filtered = filtered.filter(s => s.overall_status === 'yellow');
      }
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.reg_number?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  if (loading && !overviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-pink-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading wellness overview...</p>
        </div>
      </div>
    );
  }

  if (error && !overviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-red-500/30">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={fetchOverviewData}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const summary = overviewData?.summary || {};
  const students = overviewData?.students_needing_attention || [];
  const filteredStudents = filterStudents(students);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20">
      
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Left: Title & Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/teacher')}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Student Wellness Overview</h1>
                <p className="text-sm text-gray-400 mt-1">Monitor and support student wellbeing</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Total Students */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{summary.total_students || 0}</div>
            <div className="text-sm text-gray-400">Total Students</div>
          </div>

          {/* Critical */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-4xl">🚨</div>
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">{summary.critical || 0}</div>
            <div className="text-sm text-gray-400">Critical</div>
          </div>

          {/* Concerning */}
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-4xl">⚠️</div>
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-1">{summary.concerning || 0}</div>
            <div className="text-sm text-gray-400">Concerning</div>
          </div>

          {/* Monitor */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-4xl">📊</div>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{summary.monitor || 0}</div>
            <div className="text-sm text-gray-400">Monitor</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or reg number..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => setFilterLevel('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterLevel === 'all'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterLevel('critical')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterLevel === 'critical'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilterLevel('concerning')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterLevel === 'concerning'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Concerning
              </button>
              <button
                onClick={() => setFilterLevel('monitor')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterLevel === 'monitor'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Monitor
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Students List */}
          <div className="lg:col-span-2">
            <StudentWellnessList 
              students={filteredStudents}
              loading={loading}
            />
          </div>

          {/* Right: Alerts & Analytics */}
          <div className="lg:col-span-1 space-y-6">
            <WellnessAlertsTable 
              students={students.filter(s => s.overall_status === 'red' || s.overall_status === 'orange').slice(0, 5)}
            />
            <WellnessAnalyticsCharts summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherWellnessOverview;