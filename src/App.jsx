// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/ui/Homepage';
import Login from './components/ui/Login';
import Register from './components/ui/Register';
import Student from './components/ui/Student';
import Teacher from './components/ui/Teacher';
import Others from './components/ui/Others';
import DashboardLanding from './components/ui/DashboardLanding';
import StudentDashboard from './components/ui/dashboards/student/StudentDashboard';
import TeacherDashboard from './components/ui/dashboards/teacher/TeacherDashboard';
import OthersDashboard from './components/ui/dashboards/others/OthersDashboard';
import StudentProfile from './components/ui/dashboards/student/StudentProfile';
import TeacherProfile from './components/ui/dashboards/teacher/TeacherProfile';
import CommunityFeed from './components/ui/community/CommunityFeed';
import AskQuestion from './components/ui/community/AskQuestion';
import PostDetail from './components/ui/community/PostDetial';
import ModerationDashboard from './components/ui/community/ModerationDashboard';
import Notifications from './components/ui/community/Notifications';
import MessagesPage from './components/ui/messages/MessagesPage';
import ChatRoom from './components/ui/messages/ChatRoom';

// Phase 2: Student Wellness Components
import StudentWellnessDashboard from './components/ui/wellness/StudentWellnessDashboard';

// Phase 3: Teacher Wellness Components
import TeacherWellnessOverview from './components/ui/wellness/TeacherWellnessOverview';
import StudentWellnessDetail from './components/ui/wellness/StudentWellnessDetail';

import StudentGrades from './components/ui/dashboards/student/StudentGrades';
import TeacherGradeUpload from './components/ui/dashboards/teacher/TeacherGradeUpload';

import StudyGroupChat from './components/ui/messages/StudyGroupChat';

// ✨ NEW: Authentication Components (Email Verification, Password Reset)
import VerifyEmail from './components/ui/auth/VerifyEmail';
import ForgotPassword from './components/ui/auth/ForgotPassword';
import ResetPassword from './components/ui/auth/ResetPassword';

// ✨ NEW: Import Admin components
import { AdminProvider } from './context/AdminContext';
import AdminRoute from './routes/AdminRoute';
import AdminLogin from './components/dashboards/admin/AdminLogin';
import AdminDashboard from './components/dashboards/admin/AdminDashboard';

import './App.css';

function App() {
  return (
    <AdminProvider>
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Registration Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/register/student" element={<Student />} />
          <Route path="/register/teacher" element={<Teacher />} />
          <Route path="/register/others" element={<Others />} />
          
          {/* ✨ NEW: Email Verification & Password Routes */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLanding />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/others" element={<OthersDashboard />} />
          
          {/* Profile Routes */}
          <Route path="/dashboard/profile" element={<StudentProfile />} />
          <Route path="/dashboard/tprofile" element={<TeacherProfile />} />
          
          {/* Wellness Routes - Student (Phase 2) */}
          <Route path="/wellness/dashboard" element={<StudentWellnessDashboard />} />
          
          {/* Wellness Routes - Teacher (Phase 3) */}
          <Route path="/wellness/students-overview" element={<TeacherWellnessOverview />} />
          <Route path="/wellness/student/:studentId" element={<StudentWellnessDetail />} />
          
          {/* Community Routes */}
          <Route path="/community" element={<CommunityFeed />} />
          <Route path="/community/askquestion" element={<AskQuestion />} />
          <Route path="/community/post/:postId" element={<PostDetail />} />
          <Route path="/community/moderation" element={<ModerationDashboard />} />
          <Route path="/community/notifications" element={<Notifications />} />

          {/* Messages Routes */}
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:convId" element={<ChatRoom />} />

          {/* Grades Routes */}
          <Route path="/dashboard/student/grades" element={<StudentGrades />} />
          <Route path="/dashboard/teacher/grades" element={<TeacherGradeUpload />} />

          {/* Study Group Routes */}
          <Route path="/study-group/:groupId" element={<StudyGroupChat />} />

          {/* ✨ NEW: Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
        </Routes>
      </div>
    </Router>
    </AdminProvider>
  );
}

export default App;