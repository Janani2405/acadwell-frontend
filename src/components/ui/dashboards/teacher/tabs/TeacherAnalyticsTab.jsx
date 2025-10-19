// ============================================================
// FILE: frontend/src/components/ui/dashboards/teacher/tabs/TeacherAnalyticsTab.jsx
// ============================================================
import React from 'react';

const TeacherAnalyticsTab = ({ teacherData }) => {
  return (
    <div className="profile-tab-content">
      <div className="profile-section-card">
        <h3 className="section-title">Performance Overview</h3>
        <div className="performance-stats">
          <div className="performance-item">
            <div className="performance-label">Average Class GPA</div>
            <div className="performance-value">
              {teacherData.performanceOverview.averageClassGPA?.toFixed(1) || '0.0'}
            </div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Student Satisfaction</div>
            <div className="performance-value">
              {teacherData.performanceOverview.studentSatisfactionRate || 0}%
            </div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Course Completion</div>
            <div className="performance-value">
              {teacherData.performanceOverview.courseCompletionRate || 0}%
            </div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Participation Rate</div>
            <div className="performance-value">
              {teacherData.performanceOverview.participationRate || 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Class Participation Statistics</h3>
        {teacherData.classParticipation && teacherData.classParticipation.length > 0 ? (
          <div className="participation-analytics">
            {teacherData.classParticipation.map((data) => (
              <div key={data.course} className="participation-item">
                <div className="participation-header">
                  <span className="course-name">{data.course}</span>
                  <span className="participation-rate">{data.participation}%</span>
                </div>
                <div className="participation-bar">
                  <div 
                    className="participation-fill" 
                    style={{ width: `${data.participation}%` }}
                  ></div>
                </div>
                <div className="participation-students">{data.students} students</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
            No analytics data available yet.
          </p>
        )}
      </div>

      <div className="profile-section-card">
        <h3 className="section-title">Analytics Summary</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginTop: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              Overall Performance
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {teacherData.performanceOverview.studentSatisfactionRate}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              Student satisfaction rating
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              Course Completion
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {teacherData.performanceOverview.courseCompletionRate}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              Students completing courses
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              Class Engagement
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {teacherData.performanceOverview.participationRate}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              Average participation rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalyticsTab;
