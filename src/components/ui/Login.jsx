// Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Brain,
  AlertCircle
} from 'lucide-react';
import { apiCall } from '../../api/api'; // ✅ Import the API function
import '../css/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // ✅ Use apiCall instead of fetch
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      console.log('✅ Login successful:', data);

      // 🔥 Save ALL required values
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user_id);   // ✅ critical for chat
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);

      // Debug log
      console.log("📦 Stored in localStorage:", {
        token: localStorage.getItem("token"),
        user_id: localStorage.getItem("user_id"),
        role: localStorage.getItem("role"),
        name: localStorage.getItem("name"),
      });

      // Redirect based on role
      if (data.role === "student") {
        navigate("/dashboard/student");
      } else if (data.role === "teacher") {
        navigate("/dashboard/teacher");
      } else {
        navigate("/dashboard/others");
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setErrors({ general: error.message || "⚠️ Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background Elements */}
      <div className="login-background">
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
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to continue your academic wellness journey</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email/Password Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email or username"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <div className="field-error">
                  <AlertCircle className="error-icon-small" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                </button>
              </div>
              {errors.password && (
                <div className="field-error">
                  <AlertCircle className="error-icon-small" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox" />
                <span className="checkbox-text">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="login-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="footer-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;