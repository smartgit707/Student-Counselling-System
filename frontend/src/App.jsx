import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Simple check for auth (in real app, use Context or Redux)
const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/student/*" element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/counsellor/*" element={
              <PrivateRoute role="counsellor">
                <CounsellorDashboard />
              </PrivateRoute>
            } />

            <Route path="/admin/*" element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
