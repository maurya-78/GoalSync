import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import authService from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a password reset link">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">
              We sent a reset link to <span className="font-semibold text-[var(--color-text)]">{email}</span>.
              Check your inbox and click the link to reset your password.
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">The link expires in 15 minutes.</p>
          </div>
          <button onClick={() => setSent(false)} className="btn btn-secondary btn-md w-full">
            Try a different email
          </button>
          <Link to="/login" className="block text-sm text-primary-600 font-medium hover:text-primary-700">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input pl-10" placeholder="you@company.com" required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
          {loading ? <LoadingSpinner size="sm" /> : 'Send reset link'}
        </button>

        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
