// ========== FILE 2: MyClassesCard.jsx ==========
// frontend/src/components/ui/dashboards/teacher/MyClassesCard.jsx
import React from 'react';
import { Eye } from 'lucide-react';

const MyClassesCard = () => {
  const myClasses = [
    { id: 1, name: 'CS101 - AI Basics', students: 45, color: 'blue' },
    { id: 2, name: 'CS201 - Machine Learning', students: 32, color: 'green' },
    { id: 3, name: 'CS301 - Deep Learning', students: 28, color: 'purple' },
  ];

  return (
    <div className="dashboard-card classes-card">
      <h3 className="card-title">My Classes</h3>
      <p className="card-subtitle">Manage your course offerings</p>
      
      <div className="classes-list">
        {myClasses.map((classItem) => (
          <div key={classItem.id} className={`class-item class-${classItem.color}`}>
            <div className="class-info">
              <h4 className="class-name">{classItem.name}</h4>
              <p className="class-students">{classItem.students} students</p>
            </div>
            <button className="class-action-btn">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button className="view-all-btn">View All Classes</button>
    </div>
  );
};

export default MyClassesCard;
