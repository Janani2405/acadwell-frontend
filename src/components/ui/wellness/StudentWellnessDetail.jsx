// frontend/src/components/ui/wellness/StudentWellnessDetail.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, Activity, FileText, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentWellnessDetails, addCounselorNote } from '../../../api/wellnessApi';

// Import child components
import StudentMoodTimeline from './components/StudentMoodTimeline';
import InterventionActionsCard from './components/InterventionActionsCard';

const StudentWellnessDetail = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const data = await getStudentWellnessDetails(studentId);
      setStudentData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Unable to load student wellness data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      setSavingNote(true);
      await addCounselorNote(studentId, noteText);
      setNoteText('');
      // Refresh data to show new note
      fetchStudentData();
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note. Please try again.');
    } finally {
      setSavingNote(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'red': 'text-red-400 bg-red-500/20 border-red-500/30',
      'orange': 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      'yellow': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      'green': 'text-green-400 bg-green-500/20 border-green-500/30'
    };
    return colors[status] || colors['green'];
  };

  const getStatusEmoji = (status) => {
    const emojis = { red: '😢', orange: '😟', yellow: '😐', green: '😊' };
    return emojis[status] || '😊';
  };

  const getStatusText = (status) => {
    const texts = { red: 'Critical', orange: 'Concerning', yellow: 'Monitor', green: 'Healthy' };
    return texts[status] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-pink-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-red-500/30">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
            <p className="text-gray-300 mb-6">{error || 'Student not found'}</p>
            <button
              onClick={() => navigate('/wellness/students-overview')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  const student = studentData.student || {};
  const wellnessStatus = studentData.wellness_status || {};
  const summary = studentData.summary || {};
  const recentAlerts = studentData.recent_alerts || [];
  const counselorNotes = studentData.counselor_notes || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20">
      
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/wellness/students-overview')}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Student Wellness Details</h1>
                <p className="text-sm text-gray-400 mt-1">{student.name}</p>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${student.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Student Info Card */}
        <div className="mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            
            {/* Left: Student Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="text-6xl">{getStatusEmoji(wellnessStatus.overall_status)}</div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{student.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {student.email}
                  </span>
                  {student.reg_number && (
                    <>
                      <span>•</span>
                      <span>{student.reg_number}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Status Badge */}
            <div className={`px-6 py-4 rounded-xl border-2 ${getStatusColor(wellnessStatus.overall_status)}`}>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Current Status</div>
                <div className="text-2xl font-bold">{getStatusText(wellnessStatus.overall_status)}</div>
                {wellnessStatus.last_check && (
                  <div className="text-xs text-gray-500 mt-2">
                    Last checked: {new Date(wellnessStatus.last_check).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Timeline & Stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Mood Timeline */}
            <StudentMoodTimeline 
              moodTimeline={studentData.mood_timeline || []}
              trends={studentData.trends || {}}
            />

            {/* Recent Alerts */}
            {recentAlerts.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Recent Alerts</h3>
                </div>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-red-400">
                          {alert.level.toUpperCase()} ALERT
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        Context: {alert.context}
                      </p>
                      {alert.keywords && alert.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {alert.keywords.map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Summary */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Wellness Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">{summary.total_checks || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Total Checks</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{summary.level_breakdown?.green || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Healthy</div>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{summary.level_breakdown?.yellow || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Monitor</div>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">
                    {(summary.level_breakdown?.orange || 0) + (summary.level_breakdown?.red || 0)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Concerning</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Notes */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Intervention Actions */}
            <InterventionActionsCard 
              wellnessStatus={wellnessStatus}
              suggestedActions={studentData.suggested_actions || []}
              studentEmail={student.email}
            />

            {/* Add Counselor Note */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Add Note</h3>
              </div>
              <form onSubmit={handleAddNote}>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Private counselor note (only visible to staff)..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none mb-3"
                />
                <button
                  type="submit"
                  disabled={!noteText.trim() || savingNote}
                  className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingNote ? 'Saving...' : 'Add Note'}
                </button>
              </form>
            </div>

            {/* Counselor Notes History */}
            {counselorNotes.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Previous Notes</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {counselorNotes.map((note, index) => (
                    <div key={note.note_id || index} className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">{note.note}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(note.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWellnessDetail;