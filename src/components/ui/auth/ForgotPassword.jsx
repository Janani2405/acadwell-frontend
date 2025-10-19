// ==================== FILE 2: ForgotPassword.jsx ====================
// frontend/src/components/ui/auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { apiCall } from '../../../api/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiCall('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      setSuccess(true);
      setEmail('');

    } catch (err) {
      setError(err.message || 'Failed to process request');
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
      background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
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
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Reset Your Password</h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Enter your email address and we'll send you a link to reset your password.
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
            <h3 style={{ color: '#065f46', margin: '0 0 10px' }}>Check Your Email</h3>
            <p style={{ color: '#047857', margin: 0, fontSize: '14px' }}>
              We've sent password reset instructions to {email}
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
                Email Address
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
                <Mail size={18} style={{ color: '#9ca3af' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
                background: '#f59e0b',
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
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;