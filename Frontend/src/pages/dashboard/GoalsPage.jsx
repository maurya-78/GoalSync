import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, deleteGoal } from '../../redux/slices/goalSlice';
import { Plus, Search, Filter, LayoutGrid, List, Target } from 'lucide-react';
import GoalCard from '../../components/goals/GoalCard';
import GoalModal from '../../components/goals/GoalModal';
import ReviewModal from '../../components/goals/ReviewModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const GoalsPage = () => {
  const dispatch = useDispatch();
  const { goals, loading } = useSelector((s) => s.goals);
  const { isAdmin, isManager } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [reviewGoal, setReviewGoal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { dispatch(fetchGoals({})); }, []);

  const filtered = goals.filter(g => {
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filters.status || g.status === filters.status;
    const matchPriority = !filters.priority || g.priority === filters.priority;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleEdit = (goal) => { setEditGoal(goal); setModalOpen(true); };
  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteGoal(deleteTarget._id));
    setDeleting(false);
    if (!result.error) { toast.success('Goal deleted'); setDeleteTarget(null); }
    else toast.error('Failed to delete goal');
  };

  const handleModalClose = () => { setModalOpen(false); setEditGoal(null); };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Goals</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{filtered.length} goal{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-md gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Search goals..."
          />
        </div>
        <button onClick={() => setShowFilters(p => !p)} className={`btn btn-secondary btn-md gap-2 ${showFilters ? 'border-primary-500 text-primary-600' : ''}`}>
          <Filter className="w-4 h-4" /> Filters
        </button>
        <div className="flex items-center gap-1 border border-[var(--color-border)] rounded-xl p-1">
          <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary-100 text-primary-600 dark:bg-primary-950' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-primary-100 text-primary-600 dark:bg-primary-950' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 animate-slide-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="label">Status</label>
              <select value={filters.status} onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))} className="input">
                <option value="">All statuses</option>
                <option value="draft">Draft</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select value={filters.priority} onChange={(e) => setFilters(p => ({ ...p, priority: e.target.value }))} className="input">
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => setFilters({ status: '', priority: '' })} className="btn btn-secondary btn-md w-full">Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Goals grid/list */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals found"
          description={search || filters.status || filters.priority ? "Try adjusting your filters." : "Click 'New Goal' to create your first goal."}
          action={
            <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-md gap-2">
              <Plus className="w-4 h-4" /> Create Goal
            </button>
          }
        />
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
          {filtered.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              showOwner={isAdmin || isManager}
              onEdit={handleEdit}
              onDelete={(g) => setDeleteTarget(g)}
              onReview={isManager || isAdmin ? (g) => setReviewGoal(g) : null}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <GoalModal isOpen={modalOpen} onClose={handleModalClose} editGoal={editGoal} />
      <ReviewModal
        isOpen={!!reviewGoal}
        onClose={() => setReviewGoal(null)}
        goal={reviewGoal}
        onReviewed={() => dispatch(fetchGoals({}))}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Goal"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Goal"
      />
    </div>
  );
};

export default GoalsPage;
