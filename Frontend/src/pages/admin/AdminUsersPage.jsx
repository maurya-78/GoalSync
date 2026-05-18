import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Pencil, Trash2, ShieldCheck, Users } from 'lucide-react';
import adminService from '../../services/adminService';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { roleColors, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const roleOptions = ['employee', 'manager', 'admin'];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', role: 'employee', designation: '', phone: '', isActive: true });

  const load = async () => {
    setLoading(true);
    try { const r = await adminService.getAllUsers(); setUsers(r.data.users); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ name: u.name, role: u.role, designation: u.designation || '', phone: u.phone || '', isActive: u.isActive });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await adminService.updateUser(editUser._id, editForm);
      toast.success('User updated');
      setEditUser(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteTarget._id);
      toast.success('User deleted');
      setDeleteTarget(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
    finally { setDeleting(false); }
  };

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">User Management</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{users.length} total users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search users..." />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description="Try adjusting your search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                  {['User', 'Role', 'Designation', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} src={u.avatar} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">{u.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${roleColors[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{u.designation || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(u)} className="btn-ghost p-1.5 rounded-lg" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(u)} className="btn-ghost p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User" size="sm"
        footer={
          <>
            <button onClick={() => setEditUser(null)} className="btn btn-secondary btn-md">Cancel</button>
            <button onClick={saveEdit} disabled={saving} className="btn btn-primary btn-md gap-2">
              {saving && <LoadingSpinner size="sm" />} Save
            </button>
          </>
        }>
        <div className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="label">Role</label>
            <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))} className="input">
              {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Designation</label>
            <input value={editForm.designation} onChange={e => setEditForm(p => ({ ...p, designation: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="input" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={editForm.isActive} onChange={e => setEditForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-primary-600" />
            <label htmlFor="isActive" className="text-sm text-[var(--color-text)]">Active account</label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        loading={deleting} title="Delete User"
        message={`Delete "${deleteTarget?.name}"? All associated data may be affected. This cannot be undone.`}
        confirmLabel="Delete User"
      />
    </div>
  );
};

export default AdminUsersPage;
