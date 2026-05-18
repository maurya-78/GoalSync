import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, fetchAnalytics } from '../../redux/slices/goalSlice';
import { Target, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import GoalCard from '../../components/goals/GoalCard';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4f6ef7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { goals, analytics, loading } = useSelector((s) => s.goals);

  useEffect(() => {
    dispatch(fetchGoals({}));
    dispatch(fetchAnalytics());
  }, []);

  const stats = analytics?.progressStats || {};
  const statusData = (analytics?.statusStats || []).map(s => ({ name: s._id?.replace(/_/g, ' '), value: s.count }));
  const priorityData = (analytics?.priorityStats || []).map(p => ({ name: p._id, count: p.count }));
  const recentGoals = goals.slice(0, 6);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Here's what's happening with your goals today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-2)] px-3 py-1.5 rounded-lg">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Goals" value={stats.totalGoals ?? goals.length} icon={Target} color="primary" subtitle="All time" />
        <StatCard title="Completed" value={stats.completedGoals ?? 0} icon={CheckCircle} color="success" subtitle="Finished goals" />
        <StatCard title="In Progress" value={goals.filter(g => g.status === 'in_progress').length} icon={Clock} color="info" subtitle="Active goals" />
        <StatCard title="Avg. Progress" value={`${Math.round(stats.avgProgress ?? 0)}%`} icon={TrendingUp} color="warning" subtitle="Across all goals" />
      </div>

      {/* Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie - Status */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Goals by Status</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '12px' }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-[var(--color-text-muted)]">No data yet</div>
            )}
          </div>

          {/* Bar - Priority */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Goals by Priority</h3>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={priorityData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '12px' }}
                    cursor={{ fill: 'var(--color-surface-2)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-[var(--color-text-muted)]">No data yet</div>
            )}
          </div>
        </div>
      )}

      {/* Pending approvals alert */}
      {goals.filter(g => g.status === 'pending_approval').length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You have <strong>{goals.filter(g => g.status === 'pending_approval').length}</strong> goal(s) awaiting approval.
          </p>
        </div>
      )}

      {/* Recent Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[var(--color-text)]">Recent Goals</h3>
          <a href="/goals" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all →</a>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : recentGoals.length === 0 ? (
          <div className="card p-8 text-center">
            <Target className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--color-text)]">No goals yet</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Go to Goals to create your first goal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentGoals.map(goal => <GoalCard key={goal._id} goal={goal} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
