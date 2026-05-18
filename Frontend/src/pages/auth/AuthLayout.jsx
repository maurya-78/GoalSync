import React from 'react';
import { Target } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-[var(--color-bg)] bg-grid flex flex-col">
    {/* Top bar */}
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
          <Target className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">
          Goal<span className="text-primary-600">Sync</span>
        </span>
      </div>
      <ThemeToggle />
    </div>

    {/* Card */}
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-slide-up">
        {/* Glow decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative card p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">{title}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
