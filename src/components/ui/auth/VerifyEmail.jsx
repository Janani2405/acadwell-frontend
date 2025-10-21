// frontend/src/components/ui/auth/VerifyEmail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, Mail } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');
  
  // ✅ FIX: Use ref to prevent double API call in React Strict Mode
  const hasVerified = useRef(false);

  useEffect(() => {
    // ✅ Only run once
    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyEmailToken();
    }
  }, []);

  const verifyEmailToken = async () => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email link.');
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
      
      console.log('🔍 Verifying email with token:', token);
      console.log('🌐 API URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      console.log('📨 Verification response:', response.status, data);

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully! You can now log in.');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        
        // Better error messages
        if (response.status === 400 && data.error.includes('expired')) {
          setMessage('Verification link has expired. Please register again or request a new verification email.');
        } else if (response.status === 400) {
          setMessage(data.error || 'This verification link is invalid or has already been used.');
        } else {
          setMessage('Email verification failed. Please try again or contact support.');
        }
      }

    } catch (error) {
      console.error('❌ Verification error:', error);
      setStatus('error');
      setMessage('Network error. Please check your internet connection and try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>
        
        {/* Logo/Brand */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            marginBottom: '16px'
          }}>
            <Mail size={32} style={{ color: 'white' }} />
          </div>
          <h1 style={{ 
            color: '#1f2937', 
            fontSize: '24px', 
            fontWeight: 'bold',
            margin: 0 
          }}>
            Email Verification
          </h1>
        </div>

        {/* Status: Verifying */}
        {status === 'verifying' && (
          <div style={{ padding: '20px 0' }}>
            <Loader 
              size={48} 
              style={{ 
                margin: '0 auto 20px', 
                animation: 'spin 2s linear infinite', 
                color: '#667eea' 
              }} 
            />
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '20px',
              marginBottom: '10px',
              fontWeight: '600'
            }}>
              Verifying Your Email
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {/* Status: Success */}
        {status === 'success' && (
          <div style={{ padding: '20px 0' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: '#d1fae5',
              borderRadius: '50%',
              marginBottom: '20px'
            }}>
              <CheckCircle size={48} style={{ color: '#10b981' }} />
            </div>
            <h2 style={{ 
              color: '#10b981', 
              fontSize: '24px',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Email Verified! ✓
            </h2>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              {message}
            </p>
            <div style={{
              background: '#dbeafe',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ 
                color: '#1e40af', 
                fontSize: '14px',
                margin: 0
              }}>
                🎉 Welcome to AcadWell! You can now access all features.
              </p>
            </div>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '14px',
              margin: 0
            }}>
              Redirecting to login in 3 seconds...
            </p>
          </div>
        )}

        {/* Status: Error */}
        {status === 'error' && (
          <div style={{ padding: '20px 0' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: '#fee2e2',
              borderRadius: '50%',
              marginBottom: '20px'
            }}>
              <AlertCircle size={48} style={{ color: '#dc2626' }} />
            </div>
            <h2 style={{ 
              color: '#dc2626', 
              fontSize: '24px',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Verification Failed
            </h2>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '30px',
              fontSize: '16px'
            }}>
              {message}
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#5a67d8'}
                onMouseOut={(e) => e.target.style.background = '#667eea'}
              >
                Go to Login
              </button>
              
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
              >
                Register Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;