import React, { useState } from 'react';
import Modal from '../common/Modal';
import goalService from '../../services/goalService';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, goal, onReviewed }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async (status) => {
    setLoading(true);
    try {
      await goalService.reviewGoal(goal._id, { status, feedback });
      toast.success(`Goal ${status === 'approved' ? 'approved' : 'rejected'}`);
      onReviewed?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review goal');
    } finally {
      setLoading(false);
    }
  };

  if (!goal) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Goal"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary btn-md">Cancel</button>
          <button
            onClick={() => handleReview('rejected')}
            disabled={loading}
            className="btn btn-danger btn-md gap-1.5"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={() => handleReview('approved')}
            disabled={loading}
            className="btn btn-primary btn-md gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-[var(--color-surface-2)] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">{goal.title}</h3>
          {goal.description && <p className="text-xs text-[var(--color-text-muted)]">{goal.description}</p>}
        </div>
        <div>
          <label className="label">Feedback <span className="text-[var(--color-text-muted)] font-normal">(optional)</span></label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="input"
            placeholder="Add feedback for the employee..."
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
