// ==================== FILE 1: VerifyEmail.jsx ====================
// frontend/src/components/ui/auth/VerifyEmail.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, Mail } from 'lucide-react';
import { apiCall } from '../../../api/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    verifyEmailToken();
  }, []);

  const verifyEmailToken = async () => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    try {
      const response = await apiCall('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token })
      });

      setStatus('success');
      setMessage(response.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Email verification failed. The link may have expired.');
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
        {status === 'verifying' && (
          <>
            <Loader size={48} style={{ margin: '0 auto 20px', animation: 'spin 2s linear infinite', color: '#667eea' }} />
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Verifying Your Email</h2>
            <p style={{ color: '#6b7280' }}>Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} style={{ margin: '0 auto 20px', color: '#10b981' }} />
            <h2 style={{ color: '#10b981', marginBottom: '10px' }}>Email Verified!</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>{message}</p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Redirecting to login in 3 seconds...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={48} style={{ margin: '0 auto 20px', color: '#dc2626' }} />
            <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Verification Failed</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>{message}</p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
