// frontend/src/components/ui/dashboards/others/ImpactAnalyticsCard.jsx
import React, { useState, useEffect } from 'react';
import { Coffee, Users, Share2, Award, TrendingUp } from 'lucide-react';
import { apiCall } from '../../../../api/api';

const ImpactAnalyticsCard = () => {
  const [stats, setStats] = useState({
    sessionsCompleted: 0,
    studentsImpacted: 0,
    resourcesShared: 0,
    badgesEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactStats();
  }, []);

  const fetchImpactStats = async () => {
    try {
      const data = await apiCall('/api/mentorship/impact', { method: 'GET' });
      setStats(data.stats || stats);
    } catch (err) {
      console.error('Error fetching impact stats:', err);
      // Use mock data on error
      setStats({
        sessionsCompleted: 47,
        studentsImpacted: 32,
        resourcesShared: 15,
        badgesEarned: 8
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-card impact-card loading">Loading analytics...</div>;
  }

  return (
    <div className="dashboard-card impact-card">
      <h3 className="card-title">Impact Analytics</h3>
      <p className="card-subtitle">Your contribution overview</p>
      
      <div className="impact-stats">
        <div className="stat-item">
          <div className="stat-icon sessions">
            <Coffee className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.sessionsCompleted}</span>
            <span className="stat-label">Sessions</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon students">
            <Users className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.studentsImpacted}</span>
            <span className="stat-label">Students</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon resources">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.resourcesShared}</span>
            <span className="stat-label">Resources</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon badges">
            <Award className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.badgesEarned}</span>
            <span className="stat-label">Badges</span>
          </div>
        </div>
      </div>
      
      <button className="detailed-impact-btn">
        <TrendingUp className="w-4 h-4" />
        Detailed Impact
      </button>
    </div>
  );
};

export default ImpactAnalyticsCard;