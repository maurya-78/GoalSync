import React from 'react';
import { MoreVertical, Trash2, Edit, CheckCircle, Clock, Tag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Avatar from '../common/Avatar';
import { getStatusBadge, getPriorityBadge, formatStatus, getProgressColor, formatDate } from '../../utils/helpers';

const GoalCard = ({ goal, onEdit, onDelete, onReview, showOwner = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const quarters = [
    { label: 'Q1', value: goal.q1Progress },
    { label: 'Q2', value: goal.q2Progress },
    { label: 'Q3', value: goal.q3Progress },
    { label: 'Q4', value: goal.q4Progress },
  ];

  return (
    <div className="card-hover p-5 group animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={getStatusBadge(goal.status)}>{formatStatus(goal.status)}</span>
            <span className={getPriorityBadge(goal.priority)}>{goal.priority}</span>
          </div>
          <h3 className="text-sm font-semibold text-[var(--color-text)] leading-snug line-clamp-2">{goal.title}</h3>
        </div>

        {/* Menu */}
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="btn-ghost p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 card py-1 shadow-2xl z-20 animate-scale-in">
              {onEdit && (
                <button
                  onClick={() => { onEdit(goal); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Goal
                </button>
              )}
              {onReview && (goal.status === 'pending_approval') && (
                <button
                  onClick={() => { onReview(goal); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Review
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => { onDelete(goal); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2 leading-relaxed">{goal.description}</p>
      )}

      {/* Overall progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--color-text-muted)]">Overall Progress</span>
          <span className="text-xs font-bold text-[var(--color-text)]">{goal.overallProgress}%</span>
        </div>
        <div className="progress-track h-1.5">
          <div
            className={`progress-bar bg-gradient-to-r ${getProgressColor(goal.overallProgress)}`}
            style={{ width: `${goal.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Quarterly */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {quarters.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="progress-track h-1 mb-1">
              <div
                className={`progress-bar bg-gradient-to-r ${getProgressColor(value)}`}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)]">{label} {value}%</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          {showOwner && goal.owner && (
            <div className="flex items-center gap-1.5">
              <Avatar name={goal.owner.name} src={goal.owner.avatar} size="xs" />
              <span className="text-xs text-[var(--color-text-muted)]">{goal.owner.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
          {goal.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">{formatDate(goal.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
