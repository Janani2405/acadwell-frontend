// ============================================================
// FILE 3: frontend/src/components/ui/dashboards/student/tabs/AcademicsTab.jsx
// ============================================================
import React from 'react';
import { TrendingUp, BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';

const AcademicsTab = ({ studentData }) => {
  return (
    <div className="profile-tab-content">
      <div className="profile-section-card">
        <h3 className="section-title">Academic Overview</h3>
        <div className="academic-stats">
          <div className="stat-card">
            <div className="stat-icon gpa">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{studentData.grades.gpa.toFixed(1)}</span>
              <span className="stat-label">Current GPA</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon credits">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{studentData.grades.completedCredits}</span>
              <span className="stat-label">Credits Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon assignments">
              <FileText className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{studentData.assignments.completed}</span>
              <span className="stat-label">Assignments Done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Enrolled Courses</h3>
        {studentData.enrolledCourses.length > 0 ? (
          <div className="courses-list">
            {studentData.enrolledCourses.map(course => (
              <div key={course.id} className="course-item">
                <div className="course-info">
                  <h4 className="course-name">{course.name}</h4>
                  <p className="course-code">{course.code} • {course.credits} Credits</p>
                </div>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No courses enrolled yet.</p>
        )}
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Assignment Overview</h3>
        <div className="assignment-grid">
          <div className="assignment-stat completed">
            <CheckCircle className="w-8 h-8" />
            <div>
              <span className="assignment-number">{studentData.assignments.completed}</span>
              <span className="assignment-label">Completed</span>
            </div>
          </div>
          <div className="assignment-stat pending">
            <Clock className="w-8 h-8" />
            <div>
              <span className="assignment-number">{studentData.assignments.pending}</span>
              <span className="assignment-label">Pending</span>
            </div>
          </div>
          <div className="assignment-stat total">
            <FileText className="w-8 h-8" />
            <div>
              <span className="assignment-number">{studentData.assignments.total}</span>
              <span className="assignment-label">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsTab;
