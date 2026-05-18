import React, { useState, useEffect } from 'react';
import { Users, Target } from 'lucide-react';
import api from '../../services/api';
import Avatar from '../../components/common/Avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { roleColors, formatDate, getProgressColor } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const ManagerTeamPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [memberGoals, setMemberGoals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const usersRes = await api.get('/admin/users');
        const team = usersRes.data.users.filter(u => u.manager?._id === user._id || u.manager === user._id);
        setMembers(team);

        // Load goals for each member
        const goalsRes = await api.get('/goals');
        const byOwner = {};
        goalsRes.data.goals.forEach(g => {
          const ownerId = g.owner?._id || g.owner;
          if (!byOwner[ownerId]) byOwner[ownerId] = [];
          byOwner[ownerId].push(g);
        });
        setMemberGoals(byOwner);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">My Team</h2>
        <p className="text-sm text-[var(--color-text-muted)]">{members.length} team member{members.length !== 1 ? 's' : ''}</p>
      </div>

      {members.length === 0 ? (
        <div className="card">
          <EmptyState icon={Users} title="No team members" description="No employees are assigned to you yet. Ask your admin to assign team members." />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {members.map(member => {
            const goals = memberGoals[member._id] || [];
            const avgProgress = goals.length ? Math.round(goals.reduce((s, g) => s + g.overallProgress, 0) / goals.length) : 0;
            const completed = goals.filter(g => g.status === 'completed').length;

            return (
              <div key={member._id} className="card p-5">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar name={member.name} src={member.avatar} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[var(--color-text)]">{member.name}</h3>
                      <span className={`badge ${roleColors[member.role]}`}>{member.role}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{member.email}</p>
                    {member.designation && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{member.designation}</p>}
                  </div>
                  <span className={`badge flex-shrink-0 ${member.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  {[
                    { label: 'Goals', value: goals.length },
                    { label: 'Completed', value: completed },
                    { label: 'Avg Progress', value: `${avgProgress}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[var(--color-surface-2)] rounded-xl py-2.5">
                      <p className="text-base font-bold text-[var(--color-text)]">{value}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[var(--color-text-muted)]">Overall progress</span>
                    <span className="text-xs font-bold text-[var(--color-text)]">{avgProgress}%</span>
                  </div>
                  <div className="progress-track h-2">
                    <div className={`progress-bar bg-gradient-to-r ${getProgressColor(avgProgress)}`} style={{ width: `${avgProgress}%` }} />
                  </div>
                </div>

                {/* Pending goals */}
                {goals.filter(g => g.status === 'pending_approval').length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
                    <Target className="w-3.5 h-3.5 flex-shrink-0" />
                    {goals.filter(g => g.status === 'pending_approval').length} goal(s) pending your review
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagerTeamPage;
