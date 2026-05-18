import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, fetchAnalytics } from '../../redux/slices/goalSlice';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getProgressColor } from '../../utils/helpers';

const COLORS = ['#4f6ef7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-xl">
      {label && <p className="font-semibold mb-1 text-[var(--color-text)]">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { goals, analytics, loading } = useSelector((s) => s.goals);

  useEffect(() => {
    dispatch(fetchGoals({}));
    dispatch(fetchAnalytics());
  }, []);

  // Quarterly trend per goal
  const quarterlyData = [
    { q: 'Q1', avg: Math.round(goals.reduce((s, g) => s + g.q1Progress, 0) / (goals.length || 1)) },
    { q: 'Q2', avg: Math.round(goals.reduce((s, g) => s + g.q2Progress, 0) / (goals.length || 1)) },
    { q: 'Q3', avg: Math.round(goals.reduce((s, g) => s + g.q3Progress, 0) / (goals.length || 1)) },
    { q: 'Q4', avg: Math.round(goals.reduce((s, g) => s + g.q4Progress, 0) / (goals.length || 1)) },
  ];

  const statusData = (analytics?.statusStats || []).map(s => ({
    name: s._id?.replace(/_/g, ' '),
    value: s.count
  }));

  const priorityData = (analytics?.priorityStats || []).map(p => ({
    name: p._id,
    count: p.count
  }));

  // Progress distribution buckets
  const buckets = [
    { range: '0–25%', count: goals.filter(g => g.overallProgress <= 25).length },
    { range: '26–50%', count: goals.filter(g => g.overallProgress > 25 && g.overallProgress <= 50).length },
    { range: '51–75%', count: goals.filter(g => g.overallProgress > 50 && g.overallProgress <= 75).length },
    { range: '76–100%', count: goals.filter(g => g.overallProgress > 75).length },
  ];

  const stats = analytics?.progressStats || {};

  if (loading) return <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Analytics</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Detailed insights across all your goals</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Goals', value: stats.totalGoals ?? goals.length, color: 'text-primary-600' },
          { label: 'Completed', value: stats.completedGoals ?? 0, color: 'text-emerald-600' },
          { label: 'Avg Progress', value: `${Math.round(stats.avgProgress ?? 0)}%`, color: 'text-amber-600' },
          { label: 'Pending', value: goals.filter(g => g.status === 'pending_approval').length, color: 'text-rose-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-5 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quarterly Trend */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Quarterly Progress Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={quarterlyData}>
            <defs>
              <linearGradient id="gradQ" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="q" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="avg" name="Avg Progress %" stroke="#4f6ef7" strokeWidth={2.5} fill="url(#gradQ)" dot={{ fill: '#4f6ef7', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Pie */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Goals by Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-sm text-[var(--color-text-muted)] py-16">No data</p>}
        </div>

        {/* Priority Bar */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Goals by Priority</h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Goals" radius={[6, 6, 0, 0]}>
                  {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-sm text-[var(--color-text-muted)] py-16">No data</p>}
        </div>
      </div>

      {/* Progress Distribution */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Progress Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={buckets} barSize={50}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Goals" radius={[6, 6, 0, 0]}>
              {buckets.map((b, i) => (
                <Cell key={i} fill={
                  i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : i === 2 ? '#4f6ef7' : '#10b981'
                } />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Goal Progress Heatmap-style list */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Goal Progress Overview</h3>
        {goals.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-text-muted)] py-8">No goals to display</p>
        ) : (
          <div className="space-y-3">
            {goals.slice(0, 10).map(goal => (
              <div key={goal._id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[var(--color-text)] truncate max-w-[60%]">{goal.title}</span>
                  <span className="text-xs font-bold text-[var(--color-text)]">{goal.overallProgress}%</span>
                </div>
                <div className="progress-track h-2">
                  <div
                    className={`progress-bar bg-gradient-to-r ${getProgressColor(goal.overallProgress)}`}
                    style={{ width: `${goal.overallProgress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
