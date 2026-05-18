import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMe } from '../redux/slices/authSlice';
import { PageLoader } from '../components/common/LoadingSpinner';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Dashboard pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import GoalsPage from '../pages/dashboard/GoalsPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import NotificationsPage from '../pages/dashboard/NotificationsPage';

// Admin pages
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminTeamsPage from '../pages/admin/AdminTeamsPage';
import AdminDepartmentsPage from '../pages/admin/AdminDepartmentsPage';
import AdminCyclesPage from '../pages/admin/AdminCyclesPage';

// Manager pages
import ManagerTeamPage from '../pages/manager/ManagerTeamPage';
import ManagerReviewsPage from '../pages/manager/ManagerReviewsPage';

// Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((s) => s.auth);
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const ManagerRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!['admin', 'manager'].includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRouter = () => {
  const dispatch = useDispatch();
  const { initialized, token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []);

  if (token && !initialized) return <PageLoader />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />

          {/* Admin */}
          <Route path="admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="admin/teams" element={<AdminRoute><AdminTeamsPage /></AdminRoute>} />
          <Route path="admin/departments" element={<AdminRoute><AdminDepartmentsPage /></AdminRoute>} />
          <Route path="admin/cycles" element={<AdminRoute><AdminCyclesPage /></AdminRoute>} />

          {/* Manager */}
          <Route path="manager/team" element={<ManagerRoute><ManagerTeamPage /></ManagerRoute>} />
          <Route path="manager/reviews" element={<ManagerRoute><ManagerReviewsPage /></ManagerRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;