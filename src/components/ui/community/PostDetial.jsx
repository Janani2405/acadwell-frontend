// PostDetail.jsx - Updated with all features
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Heart, MessageSquare, Eye, Share2, Flag,
  ThumbsUp, ThumbsDown, CheckCircle, Send, Paperclip,
  Award, Crown, Shield, Zap, Trophy, X, Edit2, Trash2,
  AlertTriangle, Copy, Check
} from 'lucide-react';
import '../../css/community/PostDetial.css';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../../../api/api';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [replyToId, setReplyToId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState({ title: '', description: '' });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [likedReplies, setLikedReplies] = useState(new Set());
  const [dislikedReplies, setDislikedReplies] = useState(new Set());

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

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/api/community/posts/${postId}`, {
        method: 'GET'
      });
      
      setPost(data);
      setReplies(data.replies || []);
    } catch (err) {
      console.error('Error fetching post:', err);
      alert('Failed to load post details');
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const getUserBadge = (user) => {
    if (user.author_role === 'counselor') return { 
      color: 'bg-purple-500/20 text-purple-400', 
      label: 'Counselor', 
      icon: Shield 
    };
    if (user.author_role === 'teacher') return { 
      color: 'bg-green-500/20 text-green-400', 
      label: 'Teacher', 
      icon: Award 
    };
    return { 
      color: 'bg-blue-500/20 text-blue-400', 
      label: 'Student', 
      icon: null 
    };
  };

  const handleLike = async () => {
    try {
      const data = await apiCall(`/api/community/posts/${postId}/like`, {
        method: 'POST'
      });
      
      setIsLiked(data.liked);
      fetchPostDetail();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleReplyLike = async (replyId) => {
    try {
      const data = await apiCall(`/api/community/replies/${replyId}/like`, {
        method: 'POST'
      });
      
      if (data.liked) {
        setLikedReplies(new Set([...likedReplies, replyId]));
        dislikedReplies.delete(replyId);
      } else {
        likedReplies.delete(replyId);
      }
      setLikedReplies(new Set(likedReplies));
      fetchPostDetail();
    } catch (err) {
      console.error('Error liking reply:', err);
    }
  };

  const handleReplyDislike = async (replyId) => {
    try {
      const data = await apiCall(`/api/community/replies/${replyId}/dislike`, {
        method: 'POST'
      });
      
      if (data.disliked) {
        setDislikedReplies(new Set([...dislikedReplies, replyId]));
        likedReplies.delete(replyId);
      } else {
        dislikedReplies.delete(replyId);
      }
      setDislikedReplies(new Set(dislikedReplies));
      fetchPostDetail();
    } catch (err) {
      console.error('Error disliking reply:', err);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim()) return;
    
    try {
      setSubmitting(true);
      await apiCall(`/api/community/posts/${postId}/replies`, {
        method: 'POST',
        body: JSON.stringify({
          content: newReply,
          is_anonymous: false,
          parent_reply_id: replyToId
        })
      });
      
      setNewReply('');
      setReplyToId(null);
      fetchPostDetail();
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (replyId, authorName) => {
    try {
      await apiCall(`/api/community/replies/${replyId}/accept`, {
        method: 'POST'
      });
      
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 5000);
      
      fetchPostDetail();
      alert(`Answer accepted! ${authorName} has been awarded 10 points! 🎉`);
    } catch (err) {
      console.error('Error accepting answer:', err);
      alert(err.message || 'Failed to accept answer');
    }
  };

  const handleEditPost = async () => {
    try {
      await apiCall(`/api/community/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editContent.title,
          description: editContent.description
        })
      });
      
      setShowEditModal(false);
      fetchPostDetail();
      alert('Post updated successfully!');
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post');
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await apiCall(`/api/community/posts/${postId}`, {
        method: 'DELETE'
      });
      
      alert('Post deleted successfully');
      navigate('/community');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    try {
      await apiCall(`/api/community/replies/${replyId}`, {
        method: 'DELETE'
      });
      
      fetchPostDetail();
      alert('Reply deleted successfully');
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert('Failed to delete reply');
    }
  };

  const handleReportPost = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }
    
    try {
      await apiCall(`/api/community/posts/${postId}/report`, {
        method: 'POST',
        body: JSON.stringify({
          reason: reportReason,
          description: reportDescription
        })
      });
      
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      alert('Post reported successfully. Our moderators will review it.');
    } catch (err) {
      console.error('Error reporting post:', err);
      alert('Failed to report post');
    }
  };

  const handleShare = async () => {
    try {
      const data = await apiCall(`/api/community/posts/${postId}/share`, {
        method: 'POST'
      });
      
      setShareLink(data.share_link);
      setShowShareModal(true);
    } catch (err) {
      console.error('Error sharing post:', err);
      // Fallback to current URL
      setShareLink(window.location.href);
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    navigate('/community');
  };

  const openEditModal = () => {
    setEditContent({
      title: post.title,
      description: post.description
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p>Post not found</p>
          <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-600 rounded">
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const isPostAuthor = String(post.author_id) === String(currentUser?.userId);
  const canModerate = currentUser?.role === 'teacher' || currentUser?.role === 'counselor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <Trophy className="w-6 h-6" />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Answer Accepted!</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>10 points awarded to the answerer 🎉</div>
          </div>
          <button 
            onClick={() => setShowSuccessNotification(false)}
            style={{ marginLeft: '12px', opacity: 0.8, cursor: 'pointer', background: 'none', border: 'none', color: 'white' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '32px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Edit Post</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
              <input
                type="text"
                value={editContent.title}
                onChange={(e) => setEditContent({...editContent, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
              <textarea
                value={editContent.description}
                onChange={(e) => setEditContent({...editContent, description: e.target.value})}
                rows={8}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(148, 163, 184, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '32px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flag className="w-6 h-6 text-red-400" />
              Report Post
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              >
                <option value="">Select a reason</option>
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="misinformation">Misinformation</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Additional Details (Optional)</label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={4}
                placeholder="Provide more context..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportDescription('');
                }}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(148, 163, 184, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReportPost}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '32px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 className="w-6 h-6 text-blue-400" />
              Share Post
            </h2>
            
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <input
                type="text"
                value={shareLink || window.location.href}
                readOnly
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '8px 16px',
                  background: copied ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s'
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(148, 163, 184, 0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="post-detail">
        <div className="detail-header">
          <button onClick={handleBack} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Back to Community
          </button>
        </div>

        {/* Main Post */}
        <div className="main-post">
          <div className="post-header">
            <div className="author-section">
              <div className="author-info">
                <div className="author-details">
                  <span className="author-name">
                    {post.is_anonymous ? 'Anonymous' : post.author_name}
                  </span>
                  <div className="author-meta">
                    {(() => {
                      const badge = getUserBadge(post);
                      return (
                        <span className={`user-badge ${badge.color}`}>
                          {badge.icon && <badge.icon className="w-4 h-4" />}
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div className="post-time">{post.time_ago}</div>
            </div>
            
            {/* Edit/Delete buttons for author */}
            {isPostAuthor && (
              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <button
                  onClick={openEditModal}
                  style={{
                    padding: '8px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#60a5fa',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeletePost}
                  style={{
                    padding: '8px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#f87171',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="post-content">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-tags">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tag-badge">{tag}</span>
              ))}
            </div>

            <div className="post-description">
              {post.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="post-actions">
            <div className="action-buttons">
              <button 
                onClick={handleLike}
                className={`action-btn ${isLiked ? 'liked' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.like_count}</span>
              </button>
              
              <div className="action-btn">
                <MessageSquare className="w-5 h-5" />
                <span>{post.reply_count} replies</span>
              </div>
              
              <div className="action-btn">
                <Eye className="w-5 h-5" />
                <span>{post.view_count} views</span>
              </div>
              
              <button className="action-btn" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              <button className="action-btn report" onClick={() => setShowReportModal(true)}>
                <Flag className="w-5 h-5" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="replies-section">
          <div className="replies-header">
            <h2 className="replies-title">{replies.length} Answers</h2>
          </div>

          {replies.length === 0 ? (
            <div className="empty-replies">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>No answers yet. Be the first to help!</p>
            </div>
          ) : (
            <div className="replies-list">
              {replies.map((reply) => {
                const badge = getUserBadge(reply);
                const isReplyAuthor = String(reply.author_id) === String(currentUser?.userId);
                
                return (
                  <div key={reply.reply_id} className={`reply-card ${reply.is_accepted ? 'accepted' : ''}`}>
                    {reply.is_accepted && (
                      <div className="accepted-badge">
                        <CheckCircle className="w-4 h-4" />
                        <span>Accepted Answer</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.2)', padding: '4px 12px', borderRadius: '12px' }}>
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+10 points</span>
                        </div>
                      </div>
                    )}

                    <div className="reply-header">
                      <div className="reply-author">
                        <span className="author-name">
                          {reply.is_anonymous ? 'Anonymous' : reply.author_name}
                        </span>
                        <div className="author-badges">
                          <span className={`user-badge ${badge.color}`}>
                            {badge.icon && <badge.icon className="w-4 h-4" />}
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="reply-time">{reply.time_ago}</span>
                        {(isReplyAuthor || canModerate) && (
                          <button
                            onClick={() => handleDeleteReply(reply.reply_id)}
                            style={{
                              padding: '6px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#f87171',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="reply-content">
                      {reply.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                      ))}
                    </div>

                    <div className="reply-actions">
                      <button 
                        className={`reply-action-btn ${likedReplies.has(reply.reply_id) ? 'active' : ''}`}
                        onClick={() => handleReplyLike(reply.reply_id)}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{reply.like_count}</span>
                      </button>
                      
                      <button 
                        className={`reply-action-btn ${dislikedReplies.has(reply.reply_id) ? 'active' : ''}`}
                        onClick={() => handleReplyDislike(reply.reply_id)}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{reply.dislike_count || 0}</span>
                      </button>
                      
                      <button 
                        className="reply-action-btn"
                        onClick={() => setReplyToId(reply.reply_id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                      </button>

                      {!reply.is_accepted && isPostAuthor && (
                        <button 
                          onClick={() => handleAcceptAnswer(reply.reply_id, reply.author_name)}
                          className="accept-btn"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Accept Answer</span>
                          <div style={{ marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', opacity: 0.8 }}>
                            <Zap className="w-3 h-3" />
                            +10pts
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Nested Replies */}
                    {reply.nested_replies && reply.nested_replies.length > 0 && (
                      <div style={{ marginTop: '16px', marginLeft: '24px', paddingLeft: '16px', borderLeft: '2px solid rgba(148, 163, 184, 0.2)' }}>
                        {reply.nested_replies.map((nested) => {
                          const nestedBadge = getUserBadge(nested);
                          const isNestedAuthor = String(nested.author_id) === String(currentUser?.userId);
                          
                          return (
                            <div key={nested.reply_id} style={{ marginBottom: '16px', padding: '12px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    {nested.is_anonymous ? 'Anonymous' : nested.author_name}
                                  </span>
                                  <span className={`user-badge ${nestedBadge.color}`} style={{ fontSize: '12px', padding: '2px 8px' }}>
                                    {nestedBadge.label}
                                  </span>
                                  <span style={{ fontSize: '12px', opacity: 0.6 }}>{nested.time_ago}</span>
                                </div>
                                {(isNestedAuthor || canModerate) && (
                                  <button
                                    onClick={() => handleDeleteReply(nested.reply_id)}
                                    style={{
                                      padding: '4px',
                                      background: 'rgba(239, 68, 68, 0.2)',
                                      border: 'none',
                                      borderRadius: '4px',
                                      color: '#f87171',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{nested.content}</p>
                              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button 
                                  className="reply-action-btn"
                                  onClick={() => handleReplyLike(nested.reply_id)}
                                  style={{ fontSize: '12px', padding: '4px 8px' }}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{nested.like_count}</span>
                                </button>
                                <button 
                                  className="reply-action-btn"
                                  onClick={() => handleReplyDislike(nested.reply_id)}
                                  style={{ fontSize: '12px', padding: '4px 8px' }}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>{nested.dislike_count || 0}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Reply to this reply form */}
                    {replyToId === reply.reply_id && (
                      <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#60a5fa' }}>
                            Replying to {reply.author_name}
                          </span>
                          <button
                            onClick={() => setReplyToId(null)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#f87171',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="Write your reply..."
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            resize: 'vertical',
                            marginBottom: '8px'
                          }}
                        />
                        <button
                          onClick={handleSubmitReply}
                          disabled={!newReply.trim() || submitting}
                          style={{
                            padding: '8px 16px',
                            background: newReply.trim() ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(148, 163, 184, 0.2)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: newReply.trim() ? 'pointer' : 'not-allowed',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          Post Reply
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reply Form */}
        <div className="reply-form-section">
          <h3 className="form-title">Your Answer</h3>
          
          <div className="reply-form">
            <div className="form-header">
              <span className="current-user">
                Replying as {currentUser?.name || 'User'}
              </span>
            </div>
            
            <textarea
              value={replyToId ? '' : newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write your answer here... Be helpful and constructive."
              className="reply-textarea"
              rows={6}
              disabled={replyToId !== null}
            />
            
            {replyToId && (
              <div style={{ 
                padding: '12px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '8px', 
                marginBottom: '16px',
                fontSize: '14px',
                color: '#60a5fa'
              }}>
                You are replying to a specific comment. Scroll up to see the reply form.
              </div>
            )}
            
            <div className="form-actions">
              <div className="form-tools">
                <button className="tool-btn">
                  <Paperclip className="w-4 h-4" />
                  <span>Attach</span>
                </button>
              </div>
              
              <button 
                onClick={handleSubmitReply}
                className="submit-btn"
                disabled={(!newReply.trim() && !replyToId) || submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .reply-action-btn.active {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default PostDetail;