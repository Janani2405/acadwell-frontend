// ==================== FILE 3: ResetPassword.jsx ====================
// frontend/src/components/ui/auth/ResetPassword.jsx

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { apiCall } from '../../../api/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <AlertCircle size={32} style={{ color: '#dc2626', margin: '0 auto 10px' }} />
          <h2 style={{ color: '#dc2626' }}>Invalid Reset Link</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>The reset link is invalid or has expired.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await apiCall('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password })
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Reset Your Password</h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Enter your new password below.
        </p>

        {success ? (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <CheckCircle size={32} style={{ color: '#10b981', margin: '0 auto 10px' }} />
            <h3 style={{ color: '#065f46', margin: '0 0 10px' }}>Password Reset Successfully!</h3>
            <p style={{ color: '#047857', margin: 0, fontSize: '14px' }}>
              Redirecting to login in 3 seconds...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                color: '#374151',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                New Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '10px 15px'
              }}>
                <Lock size={18} style={{ color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    fontSize: '14px'
                  }}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '5px 0 0' }}>
                Must contain uppercase, number, and special character
              </p>
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#374151',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Confirm Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '10px 15px'
              }}>
                <Lock size={18} style={{ color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                color: '#991b1b'
              }}>
                <AlertCircle size={18} />
                <span style={{ fontSize: '14px' }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;