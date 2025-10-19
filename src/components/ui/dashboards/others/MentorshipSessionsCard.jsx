// frontend/src/components/ui/dashboards/others/MentorshipSessionsCard.jsx
import React, { useState, useEffect } from 'react';
import { apiCall } from '../../../../api/api';

const MentorshipSessionsCard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await apiCall('/api/mentorship/sessions', { method: 'GET' });
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      // Use mock data on error
      setSessions([
        { id: 1, student: 'Alex K.', topic: 'Career Guidance', date: 'Sep 5, 2025', time: '2:00 PM', status: 'scheduled' },
        { id: 2, student: 'Sarah M.', topic: 'Interview Prep', date: 'Sep 7, 2025', time: '4:00 PM', status: 'confirmed' },
        { id: 3, student: 'Mike R.', topic: 'Resume Review', date: 'Sep 10, 2025', time: '10:00 AM', status: 'pending' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-card sessions-card loading">Loading sessions...</div>;
  }

  return (
    <div className="dashboard-card sessions-card">
      <h3 className="card-title">Mentorship Sessions</h3>
      <p className="card-subtitle">Manage your mentoring schedule</p>
      
      <div className="sessions-list">
        {sessions.slice(0, 3).map((session) => (
          <div key={session.id} className="session-item">
            <div className="session-info">
              <h4 className="session-student">{session.student}</h4>
              <p className="session-topic">{session.topic}</p>
              <p className="session-time">{session.date} at {session.time}</p>
            </div>
            <span className={`session-status ${session.status}`}>
              {session.status}
            </span>
          </div>
        ))}
      </div>
      
      <button className="manage-sessions-btn" onClick={() => alert('Navigate to sessions page')}>
        Manage Sessions
      </button>
    </div>
  );
};

export default MentorshipSessionsCard;