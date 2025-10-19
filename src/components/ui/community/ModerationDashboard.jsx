import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, Trash2, Shield } from 'lucide-react';
import { apiCall } from '../../../api/api';
import { useNavigate } from 'react-router-dom';

const ModerationDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/community/moderation/reports', {
        method: 'GET'
      });
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, action) => {
    try {
      await apiCall(`/api/community/moderation/reports/${reportId}/resolve`, {
        method: 'PUT',
        body: JSON.stringify({ action })
      });
      
      alert(`Report ${action === 'delete_content' ? 'resolved and content deleted' : 'dismissed'}`);
      fetchReports();
    } catch (err) {
      console.error('Error resolving report:', err);
      alert('Failed to resolve report');
    }
  };

  const viewContent = (contentType, contentId) => {
    if (contentType === 'post') {
      navigate(`/community/post/${contentId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <Shield className="w-8 h-8 text-red-400" />
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              Content Moderation Dashboard
            </h1>
            <p style={{ opacity: 0.8 }}>
              Review and manage reported content
            </p>
          </div>
          <div style={{ 
            marginLeft: 'auto', 
            background: 'rgba(239, 68, 68, 0.2)', 
            padding: '8px 16px', 
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            {reports.length} Pending Reports
          </div>
        </div>

        {reports.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <CheckCircle className="w-16 h-16 mb-4 mx-auto text-green-400" />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              All Clear!
            </h2>
            <p style={{ opacity: 0.7 }}>
              No pending reports to review
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {reports.map((report) => (
              <div
                key={report.report_id}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#f87171'
                      }}>
                        {report.content_type.toUpperCase()}
                      </span>
                      <span style={{ opacity: 0.6, fontSize: '14px' }}>
                        {report.time_ago}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                      Reason: {report.reason}
                    </h3>
                    <p style={{ opacity: 0.7, fontSize: '14px' }}>
                      Reported by: {report.reported_by}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', opacity: 0.7 }}>
                    Content Preview:
                  </div>
                  <p style={{ lineHeight: '1.6' }}>
                    {report.content_preview}...
                  </p>
                </div>

                {report.description && (
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.7 }}>
                      Additional Details:
                    </div>
                    <p style={{ fontSize: '14px' }}>{report.description}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => viewContent(report.content_type, report.content_id)}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <Eye className="w-4 h-4" />
                    View Content
                  </button>
                  
                  <button
                    onClick={() => handleResolve(report.report_id, 'delete_content')}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Content
                  </button>
                  
                  <button
                    onClick={() => handleResolve(report.report_id, 'dismiss')}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(148, 163, 184, 0.2)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <XCircle className="w-4 h-4" />
                    Dismiss Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationDashboard;