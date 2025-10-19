import React, { useState, useEffect } from 'react';
import { authAPI, questionsAPI } from '../services/api';

const TestConnection = () => {
  const [status, setStatus] = useState({
    backend: 'checking...',
    auth: 'pending',
    questions: 'pending'
  });

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    try {
      // Test backend health
      const healthResponse = await fetch('http://localhost:5000/health');
      if (healthResponse.ok) {
        setStatus(prev => ({ ...prev, backend: 'connected ✅' }));
        
        // Test auth
        const authResponse = await authAPI.anonLogin();
        if (authResponse.data.success) {
          setStatus(prev => ({ ...prev, auth: 'working ✅' }));
          
          // Test questions
          const questionsResponse = await questionsAPI.getAll();
          if (questionsResponse.data.success) {
            setStatus(prev => ({ ...prev, questions: `${questionsResponse.data.count} questions loaded ✅` }));
          }
        }
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setStatus(prev => ({ 
        ...prev, 
        backend: 'failed ❌',
        auth: 'failed ❌',
        questions: 'failed ❌'
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🔗 System Communication Test</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Backend (Flask):</span>
          <span>{status.backend}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Authentication:</span>
          <span>{status.auth}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Questions API:</span>
          <span>{status.questions}</span>
        </div>
      </div>
      
      <button 
        onClick={testConnections}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        🔄 Test Again
      </button>
    </div>
  );
};

export default TestConnection;