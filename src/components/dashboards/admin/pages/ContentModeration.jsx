// frontend/src/components/dashboards/admin/pages/ContentModeration.jsx
/**
 * Content Moderation Page
 * View, edit, and moderate all posts, questions, and answers
 */

import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Trash2, Eye, AlertTriangle, RefreshCw, Edit, Search, X } from 'lucide-react';
import { adminApi } from '../../../../api/admin.api';

const ContentModeration = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_posts: 0,
    total_answers: 0,
    flagged_posts: 0,
    recent_posts_24h: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadContent();
    loadStats();
  }, [pagination.page, showFlaggedOnly]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        flagged: showFlaggedOnly
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const data = await adminApi.getPosts(params);
      setPosts(data.posts || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading content:', error);
      alert('Failed to load content: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await adminApi.getContentStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadContent();
  };

  const viewPostDetail = async (postId) => {
    try {
      const postDetail = await adminApi.getPostDetail(postId);
      setSelectedPost(postDetail);
    } catch (error) {
      alert('Failed to load post details');
    }
  };

  const deletePost = async (postId, title) => {
    if (!confirm(`Are you sure you want to delete this post: "${title}"?`)) return;

    try {
      await adminApi.deletePost(postId);
      alert('Post deleted successfully!');
      setSelectedPost(null);
      loadContent();
      loadStats();
    } catch (error) {
      alert('Failed to delete post: ' + (error.message || 'Unknown error'));
    }
  };

  const deleteAnswer = async (postId, answerId, authorName) => {
    if (!confirm(`Are you sure you want to delete answer by ${authorName}?`)) return;

    try {
      await adminApi.deleteAnswer(postId, answerId);
      alert('Answer deleted successfully!');
      viewPostDetail(postId);
      loadStats();
    } catch (error) {
      alert('Failed to delete answer: ' + (error.message || 'Unknown error'));
    }
  };

  const startEditPost = (post) => {
    setEditingPost(post.post_id);
    setEditForm({
      title: post.title || '',
      question: post.question || '',
      description: post.description || '',
      content: post.content || ''
    });
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditForm({});
  };

  const saveEdit = async (postId) => {
    try {
      await adminApi.updatePost(postId, editForm);
      alert('Post updated successfully!');
      setEditingPost(null);
      setEditForm({});
      if (selectedPost && selectedPost.post_id === postId) {
        viewPostDetail(postId);
      }
      loadContent();
    } catch (error) {
      alert('Failed to update post: ' + (error.message || 'Unknown error'));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Moderation</h2>
          <p className="text-gray-400 text-sm mt-1">
            Moderate posts, questions, and answers
          </p>
        </div>
        
        <button
          onClick={() => { loadContent(); loadStats(); }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total_posts}</p>
              <p className="text-xs text-gray-400">Total Posts</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total_answers}</p>
              <p className="text-xs text-gray-400">Total Answers</p>
            </div>
          </div>
        </div>

        <div className="bg-red-500/10 backdrop-blur-xl rounded-xl p-4 border border-red-500/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-red-400">{stats.flagged_posts}</p>
              <p className="text-xs text-red-300">Flagged</p>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/50">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-green-400">{stats.recent_posts_24h}</p>
              <p className="text-xs text-green-300">Last 24h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search posts by title, author, or content..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFlaggedOnly}
              onChange={(e) => setShowFlaggedOnly(e.target.checked)}
              className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-300 whitespace-nowrap">Flagged Only</span>
          </label>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading content...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No posts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.post_id}
                  className={`rounded-lg p-6 border-2 transition-all ${
                    post.flagged
                      ? 'bg-red-500/10 border-red-500/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {editingPost === post.post_id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.title || editForm.question}
                        onChange={(e) => setEditForm({ ...editForm, [post.title ? 'title' : 'question']: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Title or Question"
                      />
                      <textarea
                        value={editForm.description || editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, [post.description ? 'description' : 'content']: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Description or Content"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(post.post_id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                            {post.type || 'Post'}
                          </span>
                          {post.flagged && (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Flagged
                            </span>
                          )}
                          <span className="text-gray-500 text-xs">
                            {post.answers_count || 0} answers
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {post.title || post.question || 'Untitled'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {post.description || post.content || 'No content'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By: {post.author_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{formatDate(post.created_at)}</span>
                          {post.views > 0 && (
                            <>
                              <span>•</span>
                              <span>{post.views} views</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewPostDetail(post.post_id)}
                          className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => startEditPost(post)}
                          className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deletePost(post.post_id, post.title || post.question)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.pages} ({pagination.total} posts)
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages || loading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-white">Post Details</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Post Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                    {selectedPost.type || 'Post'}
                  </span>
                  {selectedPost.flagged && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                      Flagged
                    </span>
                  )}
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  {selectedPost.title || selectedPost.question}
                </h4>
                <p className="text-gray-300 mb-4">
                  {selectedPost.description || selectedPost.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Author: {selectedPost.author_name}</span>
                  <span>•</span>
                  <span>{formatDate(selectedPost.created_at)}</span>
                  <span>•</span>
                  <span>{selectedPost.upvotes || 0} upvotes</span>
                  <span>•</span>
                  <span>{selectedPost.views || 0} views</span>
                </div>
              </div>

              {/* Answers Section */}
              <div className="border-t border-white/10 pt-6">
                <h5 className="text-lg font-semibold text-white mb-4">
                  Answers ({selectedPost.answers?.length || 0})
                </h5>
                
                {selectedPost.answers && selectedPost.answers.length > 0 ? (
                  <div className="space-y-4">
                    {selectedPost.answers.map((answer, index) => (
                      <div key={answer.answer_id || index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-gray-300 mb-3">{answer.content || answer.answer}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>By: {answer.author_name || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{formatDate(answer.created_at)}</span>
                              {answer.upvotes > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{answer.upvotes} upvotes</span>
                                </>
                              )}
                              {answer.is_accepted && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-400">✓ Accepted</span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteAnswer(selectedPost.post_id, answer.answer_id, answer.author_name)}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete Answer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No answers yet</p>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-white/10 pt-6 flex gap-3">
                <button
                  onClick={() => {
                    startEditPost(selectedPost);
                    setSelectedPost(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Post
                </button>
                <button
                  onClick={() => deletePost(selectedPost.post_id, selectedPost.title || selectedPost.question)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;