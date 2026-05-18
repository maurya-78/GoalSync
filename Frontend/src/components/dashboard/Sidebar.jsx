import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Target, BarChart3, Users, Settings,
  ChevronLeft, Building2, RefreshCw, Bell, UserCircle, Shield, Briefcase,
} from 'lucide-react';
import { setMobileSidebar } from '../../redux/slices/uiSlice';
import Avatar from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';

const navByRole = {
  admin: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Goals', to: '/goals', icon: Target },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Teams', to: '/admin/teams', icon: Briefcase },
    { label: 'Departments', to: '/admin/departments', icon: Building2 },
    { label: 'Cycles', to: '/admin/cycles', icon: RefreshCw },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'Profile', to: '/profile', icon: UserCircle },
  ],
  manager: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Goals', to: '/goals', icon: Target },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'My Team', to: '/manager/team', icon: Users },
    { label: 'Goal Reviews', to: '/manager/reviews', icon: Shield },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'Profile', to: '/profile', icon: UserCircle },
  ],
  employee: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Goals', to: '/goals', icon: Target },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'Profile', to: '/profile', icon: UserCircle },
  ],
};

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        isActive
          ? 'bg-primary-600 text-white shadow-glow-primary/30'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
      }`
    }
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="truncate">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, sidebarMobileOpen } = useSelector((s) => s.ui);
  const { user, isAdmin, isManager } = useAuth();

  const nav = navByRole[user?.role] || navByRole.employee;
  const roleLabel = isAdmin ? 'Administrator' : isManager ? 'Manager' : 'Employee';

  const close = () => dispatch(setMobileSidebar(false));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar transition-transform duration-300 ${
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">
              Goal<span className="text-primary-600">Sync</span>
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} src={user?.avatar} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text)] truncate">{user?.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{roleLabel}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin">
          {nav.map((item) => (
            <SidebarLink key={item.to} {...item} onClick={close} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-[var(--color-border)]">
          <NavLink
            to="/settings"
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
