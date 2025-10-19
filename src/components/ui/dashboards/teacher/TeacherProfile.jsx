// ============================================================
// FILE 1: frontend/src/components/ui/dashboards/teacher/TeacherProfile.jsx
// ============================================================
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, User, BookOpen, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../../api/api';
import '../../../css/dashboards/teacher/TeacherProfile.css';
import TeacherBasicInfoTab from './tabs/TeacherBasicInfoTab';
import TeacherCoursesTab from './tabs/TeacherCoursesTab';
import TeacherEngagementTab from './tabs/TeacherEngagementTab';
import TeacherAnalyticsTab from './tabs/TeacherAnalyticsTab';
import TeacherSettingsTab from './tabs/TeacherSettingsTab';

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall('/api/teacher_profile/profile', { method: 'GET' });
      
      const transformedData = {
        fullName: response.name,
        employeeId: response.empNumber || 'N/A',
        designation: response.designation || 'N/A',
        department: response.department || 'N/A',
        email: response.email,
        phone: response.profile?.phone || '',
        officeLocation: response.profile?.officeLocation || '',
        joinDate: response.created_at 
          ? new Date(response.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
          : 'N/A',
        profilePicture: response.profile?.profilePicture || null,
        coursesTaught: response.profile?.coursesTaught || [],
        assignmentsManaged: response.profile?.assignmentsManaged || { total: 0, active: 0, graded: 0, totalSubmissions: 0 },
        researchPublications: response.profile?.researchPublications || [],
        studentInteraction: response.profile?.studentInteraction || {
          queriesResponded: 0, mentorshipSessions: 0, communityContributions: 0, averageResponseTime: 'N/A'
        },
        performanceOverview: response.profile?.performanceOverview || {
          averageClassGPA: 0.0, studentSatisfactionRate: 0, courseCompletionRate: 0, participationRate: 0
        },
        classParticipation: response.profile?.classParticipation || [],
        systemBadges: response.profile?.systemBadges || [],
        teachingAwards: response.profile?.teachingAwards || [],
        privacy: response.profile?.privacy || {
          showFullName: true, showEmail: false, showPhone: false, showOfficeLocation: true, allowStudentContact: true
        },
        notifications: response.profile?.notifications || {
          assignmentSubmissions: true, studentQueries: true, peerActivity: true, systemUpdates: true, gradeReminders: true
        }
      };
      
      setTeacherData(transformedData);
    } catch (err) {
      console.error('Error fetching teacher profile:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onBackToDashboard = () => {
    navigate("/dashboard/teacher");
  };

  const tabs = [
    { id: 'info', label: 'Basic Info', icon: User },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'engagement', label: 'Engagement', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="teacher-profile-wrapper">
        <div className="profile-topbar">
          <div className="profile-topbar-left">
            <button type="button" onClick={onBackToDashboard} className="back-btn">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="profile-title">Teacher Profile</h1>
          </div>
        </div>
        <div className="profile-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Loader className="w-8 h-8 animate-spin" />
          <span style={{ marginLeft: '10px' }}>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-profile-wrapper">
        <div className="profile-topbar">
          <div className="profile-topbar-left">
            <button type="button" onClick={onBackToDashboard} className="back-btn">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="profile-title">Teacher Profile</h1>
          </div>
        </div>
        <div className="profile-content" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>
          <button type="button" onClick={fetchTeacherProfile} className="edit-profile-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-profile-wrapper">
      <div className="profile-topbar">
        <div className="profile-topbar-left">
          <button onClick={onBackToDashboard} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="profile-title">Teacher Profile</h1>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="profile-main-content">
          {activeTab === 'info' && <TeacherBasicInfoTab teacherData={teacherData} setTeacherData={setTeacherData} fetchTeacherProfile={fetchTeacherProfile} />}
          {activeTab === 'courses' && <TeacherCoursesTab teacherData={teacherData} />}
          {activeTab === 'engagement' && <TeacherEngagementTab teacherData={teacherData} />}
          {activeTab === 'analytics' && <TeacherAnalyticsTab teacherData={teacherData} />}
          {activeTab === 'settings' && <TeacherSettingsTab teacherData={teacherData} setTeacherData={setTeacherData} />}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;