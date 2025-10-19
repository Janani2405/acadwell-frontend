// frontend/src/components/ui/dashboards/others/CommunityFeedCard.jsx
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../../api/api';

const CommunityFeedCard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const fetchCommunityPosts = async () => {
    try {
      const data = await apiCall('/api/community/posts', { method: 'GET' });
      setPosts(data.posts?.slice(0, 3) || []);
    } catch (err) {
      console.error('Error fetching community posts:', err);
      // Use mock data on error
      setPosts([
        { id: 1, author: 'Dr. Johnson', title: 'Top 5 AI Trends in 2025', engagement: 24, time: '3h ago', type: 'article' },
        { id: 2, author: 'Sarah Alumni', title: 'My journey from student to Google AI researcher', engagement: 18, time: '6h ago', type: 'experience' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-card community-card loading">Loading posts...</div>;
  }

  return (
    <div className="dashboard-card community-card">
      <h3 className="card-title">Community Feed</h3>
      <p className="card-subtitle">Latest discussions & posts</p>
      
      <div className="community-list">
        {posts.slice(0, 2).map((post) => (
          <div key={post.id} className="community-item">
            <div className="post-header">
              <span className="post-author">{post.author || post.author_name}</span>
              <span className={`post-type ${post.type || 'discussion'}`}>
                {post.type || 'discussion'}
              </span>
            </div>
            <h4 className="post-title">{post.title}</h4>
            <div className="post-engagement">
              <Heart className="w-4 h-4 text-red-400" />
              <span>{post.engagement || post.like_count || 0} interactions</span>
              <span className="post-time">{post.time || post.time_ago}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="join-community-btn" onClick={() => navigate('/community')}>
        Join Discussion
      </button>
    </div>
  );
};

export default CommunityFeedCard;