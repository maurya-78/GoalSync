import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title || 'Confirm Action'}
    size="sm"
    footer={
      <>
        <button onClick={onClose} className="btn btn-secondary btn-md">Cancel</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn btn-danger btn-md"
        >
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </>
    }
  >
    <div className="flex gap-4 items-start py-2">
      <div className="w-10 h-10 bg-red-100 dark:bg-red-950 rounded-xl flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{message}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;
