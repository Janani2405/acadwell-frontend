// ============================================================
// FILE 3: frontend/src/components/ui/dashboards/teacher/tabs/TeacherCoursesTab.jsx
// ============================================================
import React from 'react';
import { BookOpen, Users, FileText, Clock, CheckCircle, Upload, Eye, ChevronRight } from 'lucide-react';

const TeacherCoursesTab = ({ teacherData }) => {
  const activeCourses = teacherData.coursesTaught.filter(c => c.status === 'active');
  const totalActiveStudents = activeCourses.reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="profile-tab-content">
      <div className="profile-section-card">
        <h3 className="section-title">Teaching Overview</h3>
        <div className="teaching-stats">
          <div className="stat-card">
            <div className="stat-icon courses">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{activeCourses.length}</span>
              <span className="stat-label">Active Courses</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon students">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{totalActiveStudents}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon assignments">
              <FileText className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{teacherData.assignmentsManaged.total}</span>
              <span className="stat-label">Assignments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Current Courses</h3>
        {activeCourses.length > 0 ? (
          <div className="courses-list">
            {activeCourses.map(course => (
              <div key={course.id} className="course-item">
                <div className="course-info">
                  <h4 className="course-name">{course.code} - {course.name}</h4>
                  <p className="course-details">{course.students} students • {course.semester}</p>
                </div>
                <div className="course-actions">
                  <button className="course-action-btn">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No active courses.</p>
        )}
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Assignment Management</h3>
        <div className="assignment-overview-grid">
          <div className="assignment-stat active">
            <div className="assignment-icon">
              <Clock className="w-6 h-6" />
            </div>
            <div className="assignment-details">
              <span className="assignment-number">{teacherData.assignmentsManaged.active}</span>
              <span className="assignment-label">Active</span>
            </div>
          </div>
          <div className="assignment-stat graded">
            <div className="assignment-icon">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="assignment-details">
              <span className="assignment-number">{teacherData.assignmentsManaged.graded}</span>
              <span className="assignment-label">Graded</span>
            </div>
          </div>
          <div className="assignment-stat submissions">
            <div className="assignment-icon">
              <Upload className="w-6 h-6" />
            </div>
            <div className="assignment-details">
              <span className="assignment-number">{teacherData.assignmentsManaged.totalSubmissions}</span>
              <span className="assignment-label">Submissions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCoursesTab;
