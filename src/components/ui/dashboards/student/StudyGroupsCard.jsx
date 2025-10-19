import React, { useEffect, useState } from 'react';
import { Users, Plus, ExternalLink } from 'lucide-react';
import { groupsApi } from '../../../../api/api';
import { useNavigate } from 'react-router-dom';

const StudyGroupsCard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await groupsApi.getMyGroups();
      if (data.success) {
        setGroups(data.groups.slice(0, 3)); // Show latest 3
      } else {
        setError(data.message || 'Failed to load groups');
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card study-groups-card">
      <h3 className="card-title">📚 Study Groups</h3>
      <p className="card-subtitle">Collaborate with peers</p>
      
      {loading ? (
        <p className="text-gray-400 text-center py-4">Loading groups...</p>
      ) : error ? (
        <p className="text-red-400 text-center py-4">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No groups yet. Create one!</p>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div key={group._id} className="group-item">
              <div className="group-info">
                <h4 className="group-name">{group.name}</h4>
                <p className="group-members">
                  {group.memberCount || group.members?.length || 0} members
                </p>
                <p className="group-session">
                  {group.isPrivate ? '🔒 Private' : '🌐 Public'}
                </p>
              </div>
              <button 
                onClick={() => navigate('/messages')}
                className="join-group-btn hover:scale-110 transition-transform"
                title="Go to groups"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => navigate('/messages')}
        className="explore-groups-btn"
      >
        <Plus className="w-4 h-4" />
        Manage Groups
      </button>
    </div>
  );
};

export default StudyGroupsCard;