import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/Dashboard'; // Aapka layouts/Dashboard.jsx

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard & Feature Pages
import UnifiedDashboard from '../pages/dashboard/UnifiedDashboard';
import MyGoals from '../pages/employee/MyGoals';
import TeamAnalytics from '../pages/manager/TeamAnalytics';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES (Auth) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* PROTECTED PRIVATE ROUTES */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        {/* All Roles */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<UnifiedDashboard />} />

        {/* Employee Only */}
        <Route path="goals" element={
          <ProtectedRoute allowedRoles={['Employee', 'Admin']}>
            <MyGoals />
          </ProtectedRoute>
        } />

        {/* Manager Only */}
        <Route path="team-analytics" element={
          <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
            <TeamAnalytics />
          </ProtectedRoute>
        } />

        {/* Admin Only */}
        <Route path="admin-hq" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Route>

      {/* 404 & Unauthorized Redirects */}
      <Route path="/unauthorized" element={<div className="text-white p-10 font-mono">Access Denied: Level 4 Clearance Required.</div>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;