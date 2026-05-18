import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', trend, trendValue }) => {
  const colorMap = {
    primary: 'bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    danger: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
    info: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
  };

  return (
    <div className="stat-card animate-slide-up">
      <div className={`p-3 rounded-xl ${colorMap[color]} flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-[var(--color-text)] mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
