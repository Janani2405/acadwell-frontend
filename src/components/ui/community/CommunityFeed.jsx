import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, MessageSquare, Heart, Eye, Filter,
  TrendingUp, Clock, CheckCircle, AlertCircle, BookOpen,
  Brain, Users, Star, ChevronLeft
} from 'lucide-react';
import '../../css/community/CommunityFeed.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiCall } from '../../../api/api';

const CommunityFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Get current user info
  useEffect(() => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('user_id');
    
    setCurrentUser({
      role: role,
      name: name,
      userId: userId
    });
  }, []);

  // Fetch posts from backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/community/posts', {
        method: 'GET'
      });
      
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Posts', icon: MessageSquare },
    { value: 'mental-health', label: 'Mental Health', icon: Brain },
    { value: 'academic', label: 'Academic', icon: BookOpen },
    { value: 'study-groups', label: 'Study Groups', icon: Users },
    { value: 'unanswered', label: 'Unanswered', icon: AlertCircle },
    { value: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  const getUserBadge = (userType) => {
    const badges = {
      student: { color: 'bg-blue-500/20 text-blue-400', label: 'Student' },
      teacher: { color: 'bg-green-500/20 text-green-400', label: 'Teacher' },
      counselor: { color: 'bg-purple-500/20 text-purple-400', label: 'Counselor' }
    };
    return badges[userType] || badges.student;
  };

  const getStatusIcon = (status, hasAccepted = false) => {
    if (hasAccepted) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'answered') return <CheckCircle className="w-4 h-4 text-blue-400" />;
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unanswered') {
        matchesFilter = post.reply_count === 0;
      } else if (selectedFilter === 'trending') {
        matchesFilter = post.view_count > 100;
      } else {
        matchesFilter = post.tags?.some(tag => 
          tag.toLowerCase().includes(selectedFilter.replace('-', ' '))
        );
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const handlePostClick = (postId) => {
    navigate(`/community/post/${postId}`);
  };

  const getDashboardRoute = () => {
    if (currentUser?.role === 'teacher') return '/dashboard/teacher';
    if (currentUser?.role === 'student') return '/dashboard/student';
    return '/dashboard/others';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="community-feed">
        {/* Header Section */}
        <div className="feed-header">
          <div className="header-content">
            <div className="header-left">
              <Link to={getDashboardRoute()} className="back-btn">
                <ChevronLeft className="back-icon" />
                <span className="back-text">Back to Dashboard</span>
              </Link>
            </div>

            <div className="header-center">
              <h1 className="page-title">Community Forum</h1>
              <p className="page-subtitle">Connect, share knowledge, and support each other</p>
            </div>

            <div className="header-right">
              <Link to='/community/askquestion'>
                <button className="ask-question-btn">
                  <Plus className="w-5 h-5" />
                  Ask Question
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search questions, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="filter-select"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={fetchPosts}>Retry</button>
          </div>
        )}

        {/* Featured Posts */}
        {posts.filter(post => post.featured).length > 0 && (
          <div className="featured-section">
            <h2 className="section-title">
              <Star className="w-5 h-5" />
              Featured Discussions
            </h2>
            <div className="featured-posts">
              {posts.filter(post => post.featured).slice(0, 2).map(post => (
                <div key={post.post_id} className="featured-post-card" onClick={() => handlePostClick(post.post_id)}>
                  <div className="post-header">
                    <div className="author-info">
                      {post.is_anonymous ? (
                        <span className="anonymous-badge">Anonymous</span>
                      ) : (
                        <>
                          <span className="author-name">{post.author_name}</span>
                          <span className={`user-badge ${getUserBadge(post.author_role).color}`}>
                            {getUserBadge(post.author_role).label}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="post-time">{post.time_ago}</span>
                  </div>
                  
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-description">{post.description}</p>
                  
                  <div className="post-tags">
                    {post.tags?.map((tag, index) => (
                      <span key={index} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="post-stats">
                    <div className="stat-item">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.reply_count || 0}</span>
                    </div>
                    <div className="stat-item">
                      <Heart className="w-4 h-4" />
                      <span>{post.like_count || 0}</span>
                    </div>
                    <div className="stat-item">
                      <Eye className="w-4 h-4" />
                      <span>{post.view_count || 0}</span>
                    </div>
                    <div className="status-indicator">
                      {getStatusIcon(post.status, post.has_accepted_answer)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="posts-section">
          <h2 className="section-title">
            <MessageSquare className="w-5 h-5" />
            All Discussions ({filteredPosts.length})
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl mb-2">No posts found</p>
              <p className="text-gray-400 mb-4">Be the first to ask a question!</p>
              <Link to='/community/askquestion'>
                <button className="ask-question-btn">
                  <Plus className="w-5 h-5" />
                  Ask Question
                </button>
              </Link>
            </div>
          ) : (
            <div className="posts-list">
              {filteredPosts.map(post => (
                <div key={post.post_id} className="post-card" onClick={() => handlePostClick(post.post_id)}>
                  <div className="post-header">
                    <div className="author-info">
                      {post.is_anonymous ? (
                        <span className="anonymous-badge">Anonymous</span>
                      ) : (
                        <>
                          <span className="author-name">{post.author_name}</span>
                          <span className={`user-badge ${getUserBadge(post.author_role).color}`}>
                            {getUserBadge(post.author_role).label}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="post-time">{post.time_ago}</span>
                  </div>
                  
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-description">{post.description}</p>
                  
                  <div className="post-tags">
                    {post.tags?.map((tag, index) => (
                      <span key={index} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="post-footer">
                    <div className="post-stats">
                      <div className="stat-item">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.reply_count || 0} replies</span>
                      </div>
                      <div className="stat-item">
                        <Heart className="w-4 h-4" />
                        <span>{post.like_count || 0}</span>
                      </div>
                      <div className="stat-item">
                        <Eye className="w-4 h-4" />
                        <span>{post.view_count || 0}</span>
                      </div>
                    </div>
                    
                    <div className="status-indicator">
                      {getStatusIcon(post.status, post.has_accepted_answer)}
                      <span className="status-text">
                        {post.has_accepted_answer ? 'Solved' : 
                         post.status === 'answered' ? 'Answered' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Ask Button for Mobile */}
        <Link to='/community/askquestion'>
          <button className="floating-ask-btn">
            <Plus className="w-6 h-6" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CommunityFeed;