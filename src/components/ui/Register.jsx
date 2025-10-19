// Register.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, School, Users } from 'lucide-react';
import '../css/Register.css';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="register-wrapper">
      {/* Background Elements */}
      <div className="register-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Back Button */}
      <button onClick={() => navigate('/')} className="back-button">
        <ArrowLeft className="back-icon" />
        <span>Back to Home</span>
      </button>

      {/* Main Content */}
      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <div className="register-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="register-title">Create Your Account</h1>
            <p className="register-subtitle">Choose your role to get started</p>
          </div>

          {/* Role Selection */}
          <div className="grid gap-6">
            <button 
              onClick={() => navigate('/register/student')}
              className="flex items-center justify-center space-x-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <School className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-semibold">Student</span>
            </button>

            {/* <button 
              onClick={() => navigate('/register/teacher')}
              className="flex items-center justify-center space-x-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <Users className="w-6 h-6 text-green-400" />
              <span className="text-lg font-semibold">Teacher</span>
            </button>

            <button 
              onClick={() => navigate('/register/others')}
              className="flex items-center justify-center space-x-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <User className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-semibold">Others</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
