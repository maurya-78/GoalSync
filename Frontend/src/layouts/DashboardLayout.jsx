import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../redux/slices/authSlice';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/goals': 'Goals',
  '/analytics': 'Analytics',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
  '/admin/users': 'User Management',
  '/admin/teams': 'Team Management',
  '/admin/departments': 'Department Management',
  '/admin/cycles': 'Cycle Management',
  '/manager/team': 'My Team',
  '/manager/reviews': 'Goal Reviews',
};

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'GoalSync';

  useEffect(() => {
    dispatch(fetchMe());
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        <Navbar title={title} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
