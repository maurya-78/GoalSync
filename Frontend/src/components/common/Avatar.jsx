import React from 'react';
import { getInitials } from '../../utils/helpers';

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
};

const colorMap = [
  'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
];

const Avatar = ({ name = '', src, size = 'md', className = '' }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorIdx = name ? name.charCodeAt(0) % colorMap.length : 0;
  const colorClass = colorMap[colorIdx];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-[var(--color-border)] flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
