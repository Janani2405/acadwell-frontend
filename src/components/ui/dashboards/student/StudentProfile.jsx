
// ============================================================
// FILE 1: frontend/src/components/ui/dashboards/student/StudentProfile.jsx
// ============================================================
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../../api/api';
import '../../../css/dashboards/student/StudentProfile.css';
import BasicInfoTab from './tabs/BasicInfoTab';
import AcademicsTab from './tabs/AcademicsTab';
import WellnessTab from './tabs/WellnessTab';
import AchievementsTab from './tabs/AchievementsTab';
import SettingsTab from './tabs/SettingsTab';
import { User, GraduationCap, Heart, Trophy, Settings } from 'lucide-react';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [studentData, setStudentData] = useState(null);
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchPointsData();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall('/api/profile/profile', { method: 'GET' });
      
      const transformedData = {
        fullName: response.name,
        registrationNumber: response.regNumber || 'N/A',
        department: response.department || response.field || 'N/A',
        yearOfStudy: response.year || 'N/A',
        email: response.email,
        phone: response.profile?.phone || '',
        location: response.profile?.location || '',
        joinDate: response.created_at 
          ? new Date(response.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
          : 'N/A',
        profilePicture: response.profile?.profilePicture || null,
        enrolledCourses: response.profile?.enrolledCourses || [],
        assignments: response.profile?.assignments || { total: 0, completed: 0, pending: 0, overdue: 0 },
        grades: response.profile?.grades || { gpa: 0.0, lastSemesterGPA: 0.0, totalCredits: 0, completedCredits: 0 },
        recentMoods: response.profile?.recentMoods || [],
        communityActivity: response.profile?.communityActivity || {
          questionsAsked: 0, answersGiven: 0, acceptedAnswers: 0, helpfulVotes: 0, studyGroupsJoined: 0
        },
        badges: response.profile?.badges || [],
        certificates: response.profile?.certificates || [],
        milestones: response.profile?.milestones || [],
        privacy: response.profile?.privacy || {
          showFullName: true, showEmail: false, showPhone: false, anonymousMode: false
        },
        notifications: response.profile?.notifications || {
          assignmentReminders: true, wellnessNudges: true, peerMessages: true, groupInvitations: true, gradeUpdates: true
        }
      };
      
      setStudentData(transformedData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsData = async () => {
    try {
      const response = await apiCall('/api/profile/points', { method: 'GET' });
      setPointsData(response);
    } catch (err) {
      console.error('Error fetching points:', err);
    }
  };

  const onBackToDashboard = () => {
    navigate("/dashboard/student");
  };

  const tabs = [
    { id: 'info', label: 'Basic Info', icon: User },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="student-profile-wrapper">
        <div className="profile-topbar">
          <div className="profile-topbar-left">
            <button type="button" onClick={onBackToDashboard} className="back-btn">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="profile-title">Student Profile</h1>
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
      <div className="student-profile-wrapper">
        <div className="profile-topbar">
          <div className="profile-topbar-left">
            <button type="button" onClick={onBackToDashboard} className="back-btn">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="profile-title">Student Profile</h1>
          </div>
        </div>
        <div className="profile-content" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>
          <button type="button" onClick={fetchProfile} className="edit-profile-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-wrapper">
      <div className="profile-topbar">
        <div className="profile-topbar-left">
          <button onClick={onBackToDashboard} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="profile-title">Student Profile</h1>
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
          {activeTab === 'info' && <BasicInfoTab studentData={studentData} setStudentData={setStudentData} pointsData={pointsData} fetchProfile={fetchProfile} />}
          {activeTab === 'academics' && <AcademicsTab studentData={studentData} />}
          {activeTab === 'wellness' && <WellnessTab studentData={studentData} />}
          {activeTab === 'achievements' && <AchievementsTab studentData={studentData} pointsData={pointsData} fetchProfile={fetchProfile} />}
          {activeTab === 'settings' && <SettingsTab studentData={studentData} setStudentData={setStudentData} />}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;