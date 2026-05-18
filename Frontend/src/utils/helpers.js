export const getStatusBadge = (status) => {
  const map = {
    draft: 'badge-gray',
    pending_approval: 'badge-warning',
    approved: 'badge-primary',
    in_progress: 'badge-info',
    completed: 'badge-success',
    rejected: 'badge-danger',
  };
  return map[status] || 'badge-gray';
};

export const getPriorityBadge = (priority) => {
  const map = {
    low: 'badge-gray',
    medium: 'badge-primary',
    high: 'badge-warning',
    critical: 'badge-danger',
  };
  return map[priority] || 'badge-gray';
};

export const formatStatus = (status) =>
  status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const getProgressColor = (progress) => {
  if (progress >= 80) return 'from-emerald-500 to-emerald-400';
  if (progress >= 50) return 'from-primary-500 to-primary-400';
  if (progress >= 25) return 'from-amber-500 to-amber-400';
  return 'from-red-500 to-red-400';
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const roleColors = {
  admin: 'badge-danger',
  manager: 'badge-primary',
  employee: 'badge-success',
};
