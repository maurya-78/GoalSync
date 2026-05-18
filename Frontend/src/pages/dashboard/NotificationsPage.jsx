import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, CheckCircle, XCircle, MessageSquare, Info } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const typeIcon = {
  goal_approved: { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950' },
  goal_rejected: { icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-950' },
  goal_submitted: { icon: Bell, color: 'text-primary-600 bg-primary-100 dark:bg-primary-950' },
  feedback: { icon: MessageSquare, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950' },
  general: { icon: Info, color: 'text-sky-600 bg-sky-100 dark:bg-sky-950' },
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(p => p.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAll = async () => {
    await api.put('/notifications/mark-all-read');
    setNotifications(p => p.map(n => ({ ...n, isRead: true })));
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Notifications</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="btn btn-secondary btn-sm gap-1.5">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up! No new notifications." />
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {notifications.map(n => {
              const { icon: Icon, color } = typeIcon[n.type] || typeIcon.general;
              return (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markRead(n._id)}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors ${!n.isRead ? 'bg-primary-50 dark:bg-primary-950/20 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-950/40' : 'hover:bg-[var(--color-surface-2)]'}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--color-text)]">{n.title}</p>
                      {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
