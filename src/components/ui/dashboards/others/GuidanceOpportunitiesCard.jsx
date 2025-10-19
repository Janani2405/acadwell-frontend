// frontend/src/components/ui/dashboards/others/GuidanceOpportunitiesCard.jsx
import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { apiCall } from '../../../../api/api';

const GuidanceOpportunitiesCard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const data = await apiCall('/api/mentorship/opportunities', { method: 'GET' });
      setOpportunities(data.opportunities || []);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      // Use mock data on error
      setOpportunities([
        { id: 1, title: 'Career Workshop: Tech Industry Insights', date: 'Sep 15', participants: 0, maxParticipants: 25 },
        { id: 2, title: 'Resume Review Session', date: 'Sep 18', participants: 12, maxParticipants: 15 },
        { id: 3, title: 'Alumni Talk: Life After Graduation', date: 'Sep 22', participants: 8, maxParticipants: 30 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (opportunityId) => {
    try {
      await apiCall(`/api/mentorship/opportunities/${opportunityId}/join`, { method: 'POST' });
      alert('Successfully joined opportunity!');
      fetchOpportunities();
    } catch (err) {
      console.error('Error joining opportunity:', err);
      alert('Failed to join opportunity');
    }
  };

  if (loading) {
    return <div className="dashboard-card opportunities-card loading">Loading opportunities...</div>;
  }

  return (
    <div className="dashboard-card opportunities-card">
      <h3 className="card-title">Guidance Opportunities</h3>
      <p className="card-subtitle">Ways to contribute</p>
      
      <div className="opportunities-list">
        {opportunities.slice(0, 2).map((opportunity) => (
          <div key={opportunity.id} className="opportunity-item">
            <div className="opportunity-info">
              <h4 className="opportunity-title">{opportunity.title}</h4>
              <p className="opportunity-date">{opportunity.date}</p>
              <p className="opportunity-participants">
                {opportunity.participants}/{opportunity.maxParticipants} participants
              </p>
            </div>
            <button className="join-opportunity-btn" onClick={() => handleJoin(opportunity.id)}>
              <Target className="w-4 h-4" />
              Join
            </button>
          </div>
        ))}
      </div>
      
      <button className="view-opportunities-btn">View All Opportunities</button>
    </div>
  );
};

export default GuidanceOpportunitiesCard;