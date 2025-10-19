// frontend/src/components/ui/dashboards/others/HelpRequestsCard.jsx
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { apiCall } from '../../../../api/api';

const HelpRequestsCard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await apiCall('/api/mentorship/requests', { method: 'GET' });
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      // Use mock data on error
      setRequests([
        { id: 1, student: 'Anonymous', request: 'Need guidance on choosing AI specialization track', type: 'career', time: '2h ago', priority: 'medium' },
        { id: 2, student: 'Emma L.', request: 'Help with job interview preparation for tech roles', type: 'career', time: '5h ago', priority: 'high' },
        { id: 3, student: 'Anonymous', request: 'Struggling with work-life balance as a student', type: 'wellness', time: '1d ago', priority: 'medium' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (requestId) => {
    alert(`Responding to request ${requestId}`);
  };

  if (loading) {
    return <div className="dashboard-card requests-card loading">Loading requests...</div>;
  }

  return (
    <div className="dashboard-card requests-card">
      <h3 className="card-title">Student Requests</h3>
      <p className="card-subtitle">Help requests from students</p>
      
      <div className="requests-list">
        {requests.slice(0, 2).map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-header">
              <span className="request-student">{request.student}</span>
              <span className={`priority-badge ${request.priority}`}>
                {request.priority}
              </span>
            </div>
            <p className="request-text">{request.request}</p>
            <div className="request-actions">
              <button className="respond-btn" onClick={() => handleRespond(request.id)}>
                <Send className="w-3 h-3" />
                Respond
              </button>
              <span className="request-time">{request.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-requests-btn">View All Requests</button>
    </div>
  );
};

export default HelpRequestsCard;