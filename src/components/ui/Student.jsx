// frontend/src/components/ui/Student.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, Hash, Mail, Lock, School, BookOpen, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { apiCall } from '../../api/api';
import '../css/Student.css';

const Student = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    year: '',
    field: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validate password strength
  const validatePasswordStrength = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one digit");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&* etc.)");
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Validate password strength in real-time
    if (name === 'password' && value) {
      const errors = validatePasswordStrength(value);
      setPasswordErrors(errors);
    } else if (name === 'password') {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const passwordStrengthErrors = validatePasswordStrength(formData.password);
    if (passwordStrengthErrors.length > 0) {
      setError("Password does not meet strength requirements");
      return;
    }

    // Check if all fields are filled
    if (!formData.name || !formData.regNumber || !formData.email || !formData.university || !formData.year || !formData.field) {
      setError("Please fill in all fields!");
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiCall('/api/auth/register/student', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          regNumber: formData.regNumber,
          email: formData.email,
          password: formData.password,
          university: formData.university,
          year: formData.year,
          field: formData.field,
        }),
      });

      console.log('Student registration successful:', data);
      
      setSuccessMessage(
        "Registration successful! Check your email to verify your account. " +
        "You'll receive an email with a verification link."
      );

      // Clear form
      setFormData({
        name: '',
        regNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        year: '',
        field: ''
      });
      setPasswordErrors([]);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle specific error messages
      if (error.message && error.message.includes('already registered')) {
        setError("Email already registered. Please use a different email or try logging in.");
      } else if (error.message && error.message.includes('already in use')) {
        setError("Registration number already in use. Please check and try again.");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="student-wrapper">
      {/* Background */}
      <div className="student-background">
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
      <div className="student-container">
        <div className="student-card">
          <div className="student-header">
            <div className="student-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="student-title">Student Registration</h1>
            <p className="student-subtitle">Fill in your details to get started</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              marginBottom: '20px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#10b981'
            }}>
              <CheckCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              marginBottom: '20px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '14px' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="student-form">
            {/* Name Field */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter your full name" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            {/* Registration Number Field */}
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

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
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
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '5px 0 0' }}>
                We'll send a verification link to this email
              </p>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Create a strong password" 
                  className="form-input" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ marginTop: '10px' }}>
                  {passwordErrors.length > 0 ? (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#ef4444',
                      fontSize: '12px'
                    }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Password Requirements:</p>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {passwordErrors.map((err, idx) => (
                          <li key={idx} style={{ margin: '4px 0' }}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#10b981',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <CheckCircle size={14} /> Password meets all requirements
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Re-enter password" 
                  className="form-input" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && formData.confirmPassword && (
                <p style={{
                  fontSize: '12px',
                  color: formData.password === formData.confirmPassword ? '#10b981' : '#ef4444',
                  margin: '5px 0 0'
                }}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* University Field */}
            <div className="form-group">
              <label className="form-label">University</label>
              <div className="input-wrapper">
                <School className="input-icon" />
                <input 
                  type="text" 
                  name="university" 
                  value={formData.university} 
                  onChange={handleChange} 
                  placeholder="Your University" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            {/* Year of Study Field */}
            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input"
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select your year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Masters">Masters</option>
                </select>
              </div>
            </div>

            {/* Field of Study Field */}
            <div className="form-group">
              <label className="form-label">Field of Study</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input 
                  type="text" 
                  name="field" 
                  value={formData.field} 
                  onChange={handleChange} 
                  placeholder="e.g. Computer Science" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            {/* Terms & Conditions Note */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#1e40af'
            }}>
              By registering, you agree to our Terms of Service and acknowledge that you will receive a verification email. Check your spam folder if you don't see it.
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="student-submit-btn"
              disabled={isLoading || passwordErrors.length > 0 || formData.password !== formData.confirmPassword}
              style={{
                opacity: (isLoading || passwordErrors.length > 0 || formData.password !== formData.confirmPassword) ? 0.6 : 1,
                cursor: (isLoading || passwordErrors.length > 0 || formData.password !== formData.confirmPassword) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    marginRight: '8px'
                  }} />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>

            {/* Login Link */}
            <p style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Already have an account? 
              <span 
                onClick={() => navigate('/login')}
                style={{
                  color: '#667eea',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginLeft: '6px'
                }}
              >
                Sign in here
              </span>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Student;