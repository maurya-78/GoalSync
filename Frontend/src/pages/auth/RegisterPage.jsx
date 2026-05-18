import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Briefcase } from 'lucide-react';
import AuthLayout from './AuthLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'employee' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { dispatch(clearError()); }, []);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    const { confirmPassword, ...payload } = form;
    dispatch(registerUser(payload));
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join GoalSync and start tracking your goals">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input name="name" value={form.name} onChange={handleChange} className="input pl-10" placeholder="John Doe" required />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="label">Email address *</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input pl-10" placeholder="you@company.com" required />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="label">Role</label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <select name="role" value={form.role} onChange={handleChange} className="input pl-10">
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="label">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              name="password" type={showPass ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              className="input pl-10 pr-10" placeholder="Min. 6 characters" required
            />
            <button type="button" onClick={() => setShowPass(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="label">Confirm Password *</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              name="confirmPassword" type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword} onChange={handleChange}
              className="input pl-10 pr-10" placeholder="Repeat your password" required
            />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password strength indicator */}
        {form.password && (
          <div>
            <div className="flex gap-1 mb-1">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  form.password.length >= i * 3
                    ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-primary-500' : 'bg-emerald-500'
                    : 'bg-[var(--color-border)]'
                }`} />
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {form.password.length < 6 ? 'Too short' : form.password.length < 9 ? 'Fair' : form.password.length < 12 ? 'Good' : 'Strong'}
            </p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
          {loading ? <LoadingSpinner size="sm" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
        </button>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
