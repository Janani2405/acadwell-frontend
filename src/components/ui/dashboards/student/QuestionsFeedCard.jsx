// frontend/src/components/ui/dashboards/student/QuestionsFeedCard.jsx
import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Loader } from 'lucide-react';
import { getPosts } from '../../../../api/communityApi';
import { Link } from 'react-router-dom';

const QuestionsFeedCard = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentQuestions();
  }, []);

  const fetchRecentQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPosts();
      
      // Get only the most recent 5 questions and format them
      const formattedQuestions = response.posts
        .slice(0, 5)
        .map(post => ({
          id: post.post_id,
          text: post.title,
          replies: post.reply_count,
          status: post.has_accepted_answer ? 'answered' : 'active',
          category: post.category,
          author_name: post.is_anonymous ? 'Anonymous' : post.author_name,
          time_ago: post.time_ago,
          is_anonymous: post.is_anonymous
        }));
      
      setQuestions(formattedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card questions-card">
        <h3 className="card-title">Recent Questions</h3>
        <div className="flex items-center justify-center py-8">
          <Loader className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card questions-card">
      <h3 className="card-title">Recent Questions</h3>
      <p className="card-subtitle">See what your peers are asking</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="py-8 text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p className="text-gray-400 text-sm">No questions yet</p>
        </div>
      ) : (
        <div className="questions-list space-y-3">
          {questions.map((q) => (
            <div 
              key={q.id} 
              className="question-item p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer"
            >
              <div className="question-content flex items-start gap-3 mb-2">
                <MessageSquare className="question-icon w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="question-text text-white text-sm font-medium line-clamp-2">
                    {q.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{q.author_name}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{q.time_ago}</span>
                  </div>
                </div>
              </div>

              <div className="question-meta flex items-center justify-between px-8">
                <span className="question-replies text-xs text-gray-400">
                  {q.replies} {q.replies === 1 ? 'reply' : 'replies'}
                </span>
                <div className="flex items-center gap-1">
                  {q.status === 'answered' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">Answered</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Active</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="view-more-btn mt-4 w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
        <Link to='/community'>
        View All Questions
        </Link>
      
      </button>
    </div>
  );
};

export default QuestionsFeedCard;