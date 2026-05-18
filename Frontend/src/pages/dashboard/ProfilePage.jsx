import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile, changePassword } from '../../redux/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { Camera, Save, Lock, Eye, EyeOff, User, Mail, Phone, Briefcase, FileText } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { roleColors, formatDate } from '../../utils/helpers';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    designation: user?.designation || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(profileForm));
    if (!result.error) toast.success('Profile updated!');
    else toast.error(result.error.message || 'Update failed');
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error('Passwords do not match');
    const result = await dispatch(changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword }));
    if (!result.error) {
      toast.success('Password changed!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else toast.error(result.error.message || 'Failed to change password');
  };

  const tabs = [
    { key: 'profile', label: 'Profile Info' },
    { key: 'password', label: 'Change Password' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar name={user?.name} src={profileForm.avatar} size="2xl" />
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              onClick={() => toast('Upload avatar — integrate with Cloudinary or similar service', { icon: '📷' })}>
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">{user?.name}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge ${roleColors[user?.role]}`}>{user?.role}</span>
              {user?.designation && <span className="text-xs text-[var(--color-text-muted)]">{user?.designation}</span>}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Member since {formatDate(user?.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Form */}
      {tab === 'profile' && (
        <div className="card p-6">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="input pl-10" placeholder="Your full name" />
                </div>
              </div>
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="input pl-10" placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Designation</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input value={profileForm.designation} onChange={e => setProfileForm(p => ({ ...p, designation: e.target.value }))}
                  className="input pl-10" placeholder="e.g. Senior Engineer" />
              </div>
            </div>

            <div>
              <label className="label">Avatar URL</label>
              <div className="relative">
                <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input value={profileForm.avatar} onChange={e => setProfileForm(p => ({ ...p, avatar: e.target.value }))}
                  className="input pl-10" placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className="label">Bio</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--color-text-muted)]" />
                <textarea value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  rows={3} className="input pl-10" placeholder="A short bio about yourself..." />
              </div>
            </div>

            {/* Read-only info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Email <span className="text-[var(--color-text-muted)] font-normal">(read-only)</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input value={user?.email || ''} readOnly className="input pl-10 opacity-60 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="label">Role <span className="text-[var(--color-text-muted)] font-normal">(read-only)</span></label>
                <input value={user?.role || ''} readOnly className="input opacity-60 cursor-not-allowed capitalize" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={loading} className="btn btn-primary btn-md gap-2">
                {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Form */}
      {tab === 'password' && (
        <div className="card p-6">
          <form onSubmit={handlePasswordSave} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Current Password', show: showPass.current, toggle: () => setShowPass(p => ({ ...p, current: !p.current })) },
              { key: 'newPassword', label: 'New Password', show: showPass.new, toggle: () => setShowPass(p => ({ ...p, new: !p.new })) },
              { key: 'confirmPassword', label: 'Confirm New Password', show: showPass.confirm, toggle: () => setShowPass(p => ({ ...p, confirm: !p.confirm })) },
            ].map(({ key, label, show, toggle }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type={show ? 'text' : 'password'}
                    value={passForm[key]}
                    onChange={e => setPassForm(p => ({ ...p, [key]: e.target.value }))}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}

            {passForm.newPassword && passForm.confirmPassword && (
              <p className={`text-xs font-medium ${passForm.newPassword === passForm.confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                {passForm.newPassword === passForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={loading} className="btn btn-primary btn-md gap-2">
                {loading ? <LoadingSpinner size="sm" /> : <Lock className="w-4 h-4" />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;