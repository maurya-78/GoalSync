import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import authService from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout title="Password reset!" subtitle="Your password has been changed successfully">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Redirecting you to login...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Create a strong new password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
              className="input pl-10 pr-10" placeholder="Min. 6 characters" required
            />
            <button type="button" onClick={() => setShowPass(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="label">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword} onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
              className="input pl-10 pr-10" placeholder="Repeat new password" required
            />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {form.password && form.confirmPassword && (
          <p className={`text-xs font-medium ${form.password === form.confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
            {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
          {loading ? <LoadingSpinner size="sm" /> : 'Reset Password'}
        </button>

        <Link to="/login" className="block text-center text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
