// frontend/src/components/dashboards/admin/pages/Overview.jsx
/**
 * Admin Dashboard Overview Page
 * Shows statistics and key metrics
 */

import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, Heart, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../../../hooks/useAdmin';
import StatsCard from '../components/StatsCard';

const Overview = () => {
  const { fetchDashboardOverview, loading, error } = useAdmin();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await fetchDashboardOverview();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
        <p className="text-red-400">Error loading dashboard: {error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-purple-100">
          Monitor and manage your AcadWell platform from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Total Users */}
        <StatsCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={Users}
          color="purple"
          subtitle={`${stats?.users?.new_today || 0} new today`}
          trend={stats?.users?.active_last_7_days || 0}
          trendLabel="active this week"
        />

        {/* Students */}
        <StatsCard
          title="Students"
          value={stats?.users?.students || 0}
          icon={Users}
          color="blue"
          subtitle="Enrolled students"
        />

        {/* Teachers */}
        <StatsCard
          title="Teachers"
          value={stats?.users?.teachers || 0}
          icon={Users}
          color="green"
          subtitle="Active teachers"
        />

        {/* Community Posts */}
        <StatsCard
          title="Posts"
          value={stats?.content?.posts || 0}
          icon={FileText}
          color="indigo"
          subtitle={`${stats?.content?.new_posts_today || 0} posted today`}
        />

        {/* Messages */}
        <StatsCard
          title="Messages"
          value={stats?.content?.messages || 0}
          icon={MessageSquare}
          color="pink"
          subtitle="Total messages"
        />

        {/* Questions */}
        <StatsCard
          title="Questions"
          value={stats?.content?.questions || 0}
          icon={FileText}
          color="cyan"
          subtitle="Q&A forum"
        />

        {/* Wellness Logs */}
        <StatsCard
          title="Wellness Logs"
          value={stats?.wellness?.total_logs || 0}
          icon={Heart}
          color="red"
          subtitle="Mood check-ins"
        />

        {/* Critical Alerts */}
        <StatsCard
          title="Critical Alerts"
          value={stats?.wellness?.critical_alerts || 0}
          icon={AlertTriangle}
          color="yellow"
          subtitle={`${stats?.wellness?.active_alerts || 0} active alerts`}
          urgent={stats?.wellness?.critical_alerts > 0}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            User Growth
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Users (7 days)</span>
              <span className="text-white font-semibold">
                {stats?.users?.active_last_7_days || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">New Today</span>
              <span className="text-green-400 font-semibold">
                +{stats?.users?.new_today || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Others</span>
              <span className="text-white font-semibold">
                {stats?.users?.others || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Wellness Overview */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Wellness Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Logs</span>
              <span className="text-white font-semibold">
                {stats?.wellness?.total_logs || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Alerts</span>
              <span className="text-yellow-400 font-semibold">
                {stats?.wellness?.active_alerts || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Critical</span>
              <span className="text-red-400 font-semibold">
                {stats?.wellness?.critical_alerts || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
            View All Users
          </button>
          <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            Moderate Content
          </button>
          <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium">
            Check Wellness Alerts
          </button>
          <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
            View Activity Logs
          </button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Overview;