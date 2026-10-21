import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import PatientAppointmentDetailPage from './pages/PatientAppointmentDetailPage';
import AdminDoctorManagementPage from './pages/AdminDoctorManagementPage';
import AdminDoctorFormPage from './pages/AdminDoctorFormPage';
import AdminAppointmentManagementPage from './pages/AdminAppointmentManagementPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route path="/doctors" element={<DoctorListPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage user={user} />} />

          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute user={user} allowedRoles={['patient']}>
                <PatientAppointmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments/:id"
            element={
              <ProtectedRoute user={user}>
                <PatientAppointmentDetailPage user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'receptionist']}>
                <AdminDoctorManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/doctors/new"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'receptionist']}>
                <AdminDoctorFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/doctors/edit/:id"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'receptionist']}>
                <AdminDoctorFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'receptionist']}>
                <AdminAppointmentManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'receptionist']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
