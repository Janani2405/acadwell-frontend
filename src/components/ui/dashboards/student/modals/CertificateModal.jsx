// ============================================================
// FILE 7: frontend/src/components/ui/dashboards/student/modals/CertificateModal.jsx
// ============================================================
import React, { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import { apiCall } from '../../../../../api/api';

const CertificateModal = ({ onClose, fetchProfile }) => {
  const [certFile, setCertFile] = useState(null);
  const [certFormData, setCertFormData] = useState({
    name: '',
    issuer: '',
    date: ''
  });
  const [uploadingCert, setUploadingCert] = useState(false);

  const handleCertFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setCertFile(file);
    } else {
      alert('File size must be under 5MB');
    }
  };

  const handleCertUpload = async () => {
    if (!certFile || !certFormData.name || !certFormData.issuer) {
      alert('Please fill all fields and select a file');
      return;
    }
    
    try {
      setUploadingCert(true);
      const formData = new FormData();
      formData.append('certificate_file', certFile);
      formData.append('name', certFormData.name);
      formData.append('issuer', certFormData.issuer);
      formData.append('date', certFormData.date || new Date().toISOString().split('T')[0]);
      
      await apiCall('/api/profile/certificates', {
        method: 'POST',
        body: formData
      });
      
      alert('Certificate uploaded successfully!');
      onClose();
      fetchProfile();
    } catch (err) {
      console.error('Error uploading certificate:', err);
      alert('Failed to upload certificate');
    } finally {
      setUploadingCert(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          background: '#1e293b',
          padding: '32px',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '500px',
          color: 'white'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: '20px', fontSize: '24px' }}>Upload Certificate</h3>
        
        <input
          type="text"
          placeholder="Certificate Name *"
          value={certFormData.name}
          onChange={(e) => setCertFormData({...certFormData, name: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: 'white',
            boxSizing: 'border-box'
          }}
        />
        
        <input
          type="text"
          placeholder="Issuing Organization *"
          value={certFormData.issuer}
          onChange={(e) => setCertFormData({...certFormData, issuer: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: 'white',
            boxSizing: 'border-box'
          }}
        />
        
        <input
          type="date"
          value={certFormData.date}
          onChange={(e) => setCertFormData({...certFormData, date: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: 'white',
            boxSizing: 'border-box'
          }}
        />
        
        <div style={{
          border: '2px dashed #334155',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '20px',
          background: '#0f172a'
        }}>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleCertFileChange}
            style={{ display: 'none' }}
            id="cert-upload"
          />
          <label htmlFor="cert-upload" style={{ cursor: 'pointer', display: 'block' }}>
            {certFile ? (
              <div>✅ {certFile.name}</div>
            ) : (
              <div>
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" style={{ margin: '0 auto 8px' }} />
                <div>Click to upload certificate</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                  PDF, JPG, PNG (Max 5MB)
                </div>
              </div>
            )}
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={handleCertUpload}
            disabled={uploadingCert}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: uploadingCert ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: uploadingCert ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {uploadingCert && <Loader className="w-4 h-4 animate-spin" />}
            <span>{uploadingCert ? 'Uploading...' : 'Upload'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: '#475569',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;