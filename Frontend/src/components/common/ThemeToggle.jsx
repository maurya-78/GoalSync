import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../redux/slices/uiSlice';
import { Sun, Moon, Monitor } from 'lucide-react';

const themes = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'auto', label: 'Auto', icon: Monitor },
];

const ThemeToggle = ({ compact = false }) => {
  const dispatch = useDispatch();
  const { theme, resolvedTheme } = useSelector((s) => s.ui);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = themes.find((t) => t.key === theme) || themes[2];
  const Icon = current.icon;

  if (compact) {
    return (
      <button
        onClick={() => {
          const next = resolvedTheme === 'dark' ? 'light' : 'dark';
          dispatch(setTheme(next));
        }}
        className="btn-ghost p-2 rounded-xl"
        title="Toggle theme"
      >
        {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-secondary btn-sm gap-1.5"
      >
        <Icon className="w-3.5 h-3.5" />
        {current.label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 card py-1 shadow-2xl z-50 animate-scale-in">
          {themes.map(({ key, label, icon: TIcon }) => (
            <button
              key={key}
              onClick={() => { dispatch(setTheme(key)); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                theme === key
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-medium'
                  : 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              <TIcon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
