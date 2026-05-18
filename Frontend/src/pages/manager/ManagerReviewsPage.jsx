import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals } from '../../redux/slices/goalSlice';
import { Shield, CheckCircle, Clock } from 'lucide-react';
import GoalCard from '../../components/goals/GoalCard';
import ReviewModal from '../../components/goals/ReviewModal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManagerReviewsPage = () => {
  const dispatch = useDispatch();
  const { goals, loading } = useSelector((s) => s.goals);
  const [reviewGoal, setReviewGoal] = useState(null);
  const [tab, setTab] = useState('pending');

  useEffect(() => { dispatch(fetchGoals({})); }, []);

  const pendingGoals = goals.filter(g => g.status === 'pending_approval');
  const reviewedGoals = goals.filter(g => ['approved', 'rejected'].includes(g.status));
  const displayed = tab === 'pending' ? pendingGoals : reviewedGoals;

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Goal Reviews</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Review and approve/reject team goals</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 dark:bg-amber-950 rounded-xl flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-[var(--color-text)]">{pendingGoals.length}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Pending review</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-[var(--color-text)]">{goals.filter(g => g.status === 'approved').length}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Approved</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 dark:bg-red-950 rounded-xl flex items-center justify-center">
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-[var(--color-text)]">{goals.filter(g => g.status === 'rejected').length}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Rejected</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {[
          { key: 'pending', label: `Pending (${pendingGoals.length})` },
          { key: 'reviewed', label: `Reviewed (${reviewedGoals.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key ? 'border-primary-500 text-primary-600' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Goals */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : displayed.length === 0 ? (
        <EmptyState
          icon={Shield}
          title={tab === 'pending' ? 'No pending reviews' : 'No reviewed goals yet'}
          description={tab === 'pending' ? 'All caught up! No goals need your attention.' : 'Approve or reject goals to see them here.'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              showOwner
              onReview={tab === 'pending' ? (g) => setReviewGoal(g) : null}
            />
          ))}
        </div>
      )}

      <ReviewModal
        isOpen={!!reviewGoal}
        onClose={() => setReviewGoal(null)}
        goal={reviewGoal}
        onReviewed={() => dispatch(fetchGoals({}))}
      />
    </div>
  );
};

export default ManagerReviewsPage;
