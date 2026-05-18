import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../redux/slices/uiSlice';
import { Sun, Moon, Monitor, Bell, Shield, Palette } from 'lucide-react';

const Section = ({ title, icon: Icon, children }) => (
  <div className="card p-6">
    <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[var(--color-border)]">
      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-600" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
    </div>
    {children}
  </div>
);

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.ui);

  const themes = [
    { key: 'light', label: 'Light', desc: 'Clean and bright interface', icon: Sun },
    { key: 'dark', label: 'Dark', desc: 'Easy on the eyes', icon: Moon },
    { key: 'auto', label: 'Auto', desc: 'Follows your system setting', icon: Monitor },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Settings</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your preferences</p>
      </div>

      {/* Theme */}
      <Section title="Appearance" icon={Palette}>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ key, label, desc, icon: Icon }) => (
            <button
              key={key}
              onClick={() => dispatch(setTheme(key))}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                theme === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
                  : 'border-[var(--color-border)] hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${theme === key ? 'text-primary-600' : 'text-[var(--color-text-muted)]'}`} />
              <p className={`text-sm font-semibold ${theme === key ? 'text-primary-700 dark:text-primary-300' : 'text-[var(--color-text)]'}`}>{label}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <div className="space-y-3">
          {[
            { label: 'Goal approved/rejected', desc: 'Get notified when your goals are reviewed' },
            { label: 'Goal due date reminders', desc: 'Reminders before goal deadlines' },
            { label: 'Team updates', desc: 'Updates from your team members' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-5 bg-[var(--color-border)] peer-checked:bg-primary-600 rounded-full peer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <div className="space-y-3">
          {[
            { label: 'Two-factor authentication', desc: 'Extra layer of security (coming soon)', disabled: true },
            { label: 'Login activity alerts', desc: 'Get notified of new logins' },
          ].map(({ label, desc, disabled }) => (
            <div key={label} className={`flex items-center justify-between py-2 ${disabled ? 'opacity-50' : ''}`}>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled={disabled} />
                <div className="w-10 h-5 bg-[var(--color-border)] peer-checked:bg-primary-600 rounded-full peer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </Section>

      {/* Version */}
      <div className="text-center py-2">
        <p className="text-xs text-[var(--color-text-muted)]">GoalSync v1.0.0 • Enterprise Goal Management Platform</p>
      </div>
    </div>
  );
};

export default SettingsPage;