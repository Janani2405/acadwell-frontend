// frontend/src/components/ui/dashboards/others/WellnessSupportCard.jsx
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { apiCall } from '../../../../api/api';

const WellnessSupportCard = () => {
  const [wellnessRequests, setWellnessRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWellnessRequests();
  }, []);

  const fetchWellnessRequests = async () => {
    try {
      const data = await apiCall('/api/wellness/support-requests', { method: 'GET' });
      setWellnessRequests(data.requests || []);
    } catch (err) {
      console.error('Error fetching wellness requests:', err);
      // Use mock data on error
      setWellnessRequests([
        { id: 1, student: 'Anonymous', concern: 'Feeling overwhelmed with coursework' },
        { id: 2, student: 'Student #247', concern: 'Need motivation for final exams' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async (requestId) => {
    try {
      await apiCall(`/api/wellness/support/${requestId}`, { method: 'POST' });
      alert('Support response sent!');
      fetchWellnessRequests();
    } catch (err) {
      console.error('Error providing support:', err);
      alert('Failed to send support');
    }
  };

  if (loading) {
    return <div className="dashboard-card wellness-support-card loading">Loading wellness requests...</div>;
  }

  return (
    <div className="dashboard-card wellness-support-card">
      <h3 className="card-title">Wellness Support</h3>
      <p className="card-subtitle">Non-academic student support</p>
      
      <div className="wellness-requests">
        {wellnessRequests.map((request) => (
          <div key={request.id} className="wellness-item">
            <div className="wellness-info">
              <span className="wellness-student">{request.student}</span>
              <p className="wellness-concern">{request.concern}</p>
            </div>
            <button className="support-btn" onClick={() => handleSupport(request.id)}>
              <Heart className="w-4 h-4" />
              Support
            </button>
          </div>
        ))}
      </div>
      
      <button className="wellness-center-btn">Wellness Center</button>
    </div>
  );
};

export default WellnessSupportCard;