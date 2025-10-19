// ========== FILE 8: CourseResourcesCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/CourseResourcesCard.jsx
import React from 'react';
import { Upload, FileText } from 'lucide-react';

const CourseResourcesCard = () => {
  return (
    <div className="dashboard-card resources-card">
      <h3 className="card-title">Course Resources</h3>
      <p className="card-subtitle">Manage materials</p>
      
      <div className="resources-actions">
        <button className="resource-action upload-notes">
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <button className="resource-action manage-resources">
          <FileText className="w-4 h-4" />
          Manage
        </button>
      </div>
      
      <div className="recent-uploads">
        <h4 className="recent-title">Recent Files</h4>
        <div className="uploads-list">
          <div className="upload-item">
            <FileText className="upload-icon" />
            <span className="upload-name">Neural Networks.pdf</span>
          </div>
          <div className="upload-item">
            <FileText className="upload-icon" />
            <span className="upload-name">Guidelines.docx</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseResourcesCard;