// DashboardLanding.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, School, Users, User } from 'lucide-react';
import '../css/DashboardLanding.css';

const DashboardLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-landing-wrapper">
      {/* Background */}
      <div className="dashboard-landing-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Back Button */}
      <button onClick={() => navigate('/')} className="back-button">
        <ArrowLeft className="back-icon" />
        <span>Back to Home</span>
      </button>

      {/* Main Container */}
      <div className="dashboard-landing-container">
        <div className="dashboard-landing-card">
          <div className="dashboard-landing-header">
            <div className="dashboard-landing-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="dashboard-landing-title">Choose Your Dashboard</h1>
            <p className="dashboard-landing-subtitle">Start your journey by selecting your role</p>
          </div>

          <div className="grid gap-6">
            <button 
              onClick={() => navigate('/dashboard/student')}
              className="flex items-center justify-center space-x-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <School className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-semibold">Student Dashboard</span>
            </button>

            <button 
              onClick={() => navigate('/dashboard/teacher')}
              className="flex items-center justify-center space-x-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <Users className="w-6 h-6 text-green-400" />
              <span className="text-lg font-semibold">Teacher Dashboard</span>
            </button>

            <button 
              onClick={() => navigate('/dashboard/others')}
              className="flex items-center justify-center space-x-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <User className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-semibold">Others Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
