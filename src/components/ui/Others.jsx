// frontend/src/components/ui/Others.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, Hash, Mail, Lock, Briefcase, Globe, BookOpen, AlertCircle } from 'lucide-react';
import { apiCall } from '../../api/api';
import '../css/Others.css';

const Others = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: '',
    contribution: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Use apiCall instead of hardcoded fetch
      const data = await apiCall('/api/auth/register/others', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          regNumber: formData.regNumber,
          email: formData.email,
          password: formData.password,
          organization: formData.organization,
          role: formData.role,
          contribution: formData.contribution,
        }),
      });

      console.log('✅ Others registration successful:', data);
      alert("✅ Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error('❌ Registration failed:', error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="others-wrapper">
      {/* Background */}
      <div className="others-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Back Button */}
      <button onClick={() => navigate('/register')} className="back-button">
        <ArrowLeft className="back-icon" />
        <span>Back</span>
      </button>

      {/* Main Content */}
      <div className="others-container">
        <div className="others-card">
          <div className="others-header">
            <div className="others-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="others-title">Others Registration</h1>
            <p className="others-subtitle">Join as Mentor, Counselor, Alumni, or Contributor</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              marginBottom: '20px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444'
            }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="others-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter your name" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <div className="input-wrapper">
                <Hash className="input-icon" />
                <input 
                  type="text" 
                  name="regNumber" 
                  value={formData.regNumber} 
                  onChange={handleChange} 
                  placeholder="10-digit Registration No." 
                  maxLength="10" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Enter password (min. 6 characters)" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Re-enter password" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Organization / Institution</label>
              <div className="input-wrapper">
                <Globe className="input-icon" />
                <input 
                  type="text" 
                  name="organization" 
                  value={formData.organization} 
                  onChange={handleChange} 
                  placeholder="Your Organization" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="mentor">Mentor</option>
                  <option value="counselor">Counselor</option>
                  <option value="alumni">Alumni</option>
                  <option value="contributor">Contributor</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Area of Contribution</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input 
                  type="text" 
                  name="contribution" 
                  value={formData.contribution} 
                  onChange={handleChange} 
                  placeholder="e.g. Career Guidance, Wellness Support" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="others-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Others;