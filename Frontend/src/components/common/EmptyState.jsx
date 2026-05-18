import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    {Icon && (
      <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[var(--color-text-muted)]" />
      </div>
    )}
    <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{title}</h3>
    {description && <p className="text-sm text-[var(--color-text-muted)] mb-4 max-w-sm">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
