import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Bell, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { toggleMobileSidebar } from '../../redux/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import Avatar from '../common/Avatar';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Navbar = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const userRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications || []);
        setUnread(res.data.notifications?.filter((n) => !n.isRead).length || 0);
      } catch { /* ignore */ }
    };
    fetchNotifs();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  };

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-4 gap-4 sticky top-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="lg:hidden btn-ghost p-2 rounded-xl"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-[var(--color-text)] truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle compact />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="btn-ghost p-2 rounded-xl relative"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 card shadow-2xl z-50 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                <span className="text-sm font-semibold text-[var(--color-text)]">Notifications</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="text-center text-sm text-[var(--color-text-muted)] py-8">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 border-b border-[var(--color-border)] last:border-0 ${!n.isRead ? 'bg-primary-50 dark:bg-primary-950/30' : ''}`}
                    >
                      <p className="text-xs font-semibold text-[var(--color-text)]">{n.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 btn-ghost px-2 py-1.5 rounded-xl"
          >
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
            <span className="text-sm font-medium text-[var(--color-text)] hidden sm:block max-w-[120px] truncate">
              {user?.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 card py-1 shadow-2xl z-50 animate-scale-in">
              <button
                onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <UserCircle className="w-4 h-4" /> My Profile
              </button>
              <div className="border-t border-[var(--color-border)] my-1" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
