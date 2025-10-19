// frontend/src/components/ui/dashboards/others/BadgesRecognitionCard.jsx
import React, { useState, useEffect } from 'react';
import { Award, Star, Users, Gift } from 'lucide-react';
import { apiCall } from '../../../../api/api';

const BadgesRecognitionCard = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const data = await apiCall('/api/mentorship/badges', { method: 'GET' });
      setBadges(data.badges || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
      // Use mock data on error
      setBadges([
        { id: 1, name: 'Helpful Mentor', icon: Award, earned: true },
        { id: 2, name: 'Top Contributor', icon: Star, earned: true },
        { id: 3, name: 'Community Builder', icon: Users, earned: true },
        { id: 4, name: 'Super Mentor', icon: Gift, earned: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (iconName) => {
    const icons = { Award, Star, Users, Gift };
    return icons[iconName] || Award;
  };

  if (loading) {
    return <div className="dashboard-card badges-card loading">Loading badges...</div>;
  }

  return (
    <div className="dashboard-card badges-card">
      <h3 className="card-title">Recognition & Badges</h3>
      <p className="card-subtitle">Your achievements</p>
      
      <div className="badges-grid">
        {badges.map((badge) => {
          const IconComponent = badge.icon || Award;
          return (
            <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
              <IconComponent className="badge-icon" />
              <span className="badge-name">{badge.name}</span>
            </div>
          );
        })}
      </div>
      
      <button className="view-achievements-btn">View All Achievements</button>
    </div>
  );
};

export default BadgesRecognitionCard;