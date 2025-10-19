// Teacher.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, Hash, Mail, Lock, Briefcase, BookOpen, AlertCircle } from 'lucide-react';
import { apiCall } from '../../api/api'; // ✅ Import API function
import '../css/Teacher.css';

const Teacher = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    empNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    designation: '',
    expertise: '',
    experience: ''
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

    if (formData.experience < 0) {
      setError("Experience cannot be negative!");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Use apiCall instead of hardcoded fetch
      const data = await apiCall('/api/auth/register/teacher', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          empNumber: formData.empNumber,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          designation: formData.designation,
          expertise: formData.expertise,
          experience: formData.experience,
        }),
      });

      console.log('✅ Teacher registration successful:', data);
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
    <div className="teacher-wrapper">
      {/* Background */}
      <div className="teacher-background">
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
      <div className="teacher-container">
        <div className="teacher-card">
          <div className="teacher-header">
            <div className="teacher-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="teacher-title">Teacher Registration</h1>
            <p className="teacher-subtitle">Fill in your details to get started</p>
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

          <form onSubmit={handleSubmit} className="teacher-form">
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
              <label className="form-label">Employee Number</label>
              <div className="input-wrapper">
                <Hash className="input-icon" />
                <input 
                  type="text" 
                  name="empNumber" 
                  value={formData.empNumber} 
                  onChange={handleChange} 
                  placeholder="Employee number" 
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
              <label className="form-label">Department</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input 
                  type="text" 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  placeholder="e.g. Computer Science" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Designation</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input 
                  type="text" 
                  name="designation" 
                  value={formData.designation} 
                  onChange={handleChange} 
                  placeholder="e.g. Assistant Professor" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expertise</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input 
                  type="text" 
                  name="expertise" 
                  value={formData.expertise} 
                  onChange={handleChange} 
                  placeholder="e.g. AI, Machine Learning" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input 
                  type="number" 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  placeholder="e.g. 5" 
                  min="0"
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="teacher-submit-btn"
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

export default Teacher;