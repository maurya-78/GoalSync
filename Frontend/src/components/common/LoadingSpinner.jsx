import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return (
    <div
      className={`${sizeMap[size]} border-2 border-[var(--color-border)] border-t-primary-500 rounded-full animate-spin ${className}`}
    />
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-3 border-[var(--color-border)] border-t-primary-500 rounded-full animate-spin border-[3px]" />
      <p className="text-[var(--color-text-muted)] text-sm font-medium">Loading GoalSync...</p>
    </div>
  </div>
);

export default LoadingSpinner;
