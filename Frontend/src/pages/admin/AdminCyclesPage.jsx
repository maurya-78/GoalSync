import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const emptyForm = { name: '', year: new Date().getFullYear(), startDate: '', endDate: '', isActive: false };

const AdminCyclesPage = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCycle, setEditCycle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await adminService.getCycles(); setCycles(r.data.cycles); }
    catch { toast.error('Failed to load cycles'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditCycle(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c) => { setEditCycle(c); setForm({ name: c.name, year: c.year, startDate: c.startDate?.substring(0, 10), endDate: c.endDate?.substring(0, 10), isActive: c.isActive }); setModalOpen(true); };

  const save = async () => {
    if (!form.name || !form.startDate || !form.endDate) return toast.error('Please fill all required fields');
    setSaving(true);
    try {
      if (editCycle) await adminService.updateCycle(editCycle._id, form);
      else await adminService.createCycle(form);
      toast.success(editCycle ? 'Cycle updated' : 'Cycle created');
      setModalOpen(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await adminService.deleteCycle(deleteTarget._id); toast.success('Cycle deleted'); setDeleteTarget(null); load(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Cycle Management</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Manage business performance cycles</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-md gap-2">
          <Plus className="w-4 h-4" /> New Cycle
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : cycles.length === 0 ? (
          <EmptyState icon={RefreshCw} title="No cycles yet" description="Create your first performance cycle." action={<button onClick={openCreate} className="btn btn-primary btn-md gap-2"><Plus className="w-4 h-4" />Create Cycle</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                  {['Name', 'Year', 'Start Date', 'End Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {cycles.map(c => (
                  <tr key={c._id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {c.isActive && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                        <span className="text-sm font-medium text-[var(--color-text)]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{c.year}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{formatDate(c.startDate)}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{formatDate(c.endDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${c.isActive ? 'badge-success' : 'badge-gray'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(c)} className="btn-ghost p-1.5 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteTarget(c)} className="btn-ghost p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCycle ? 'Edit Cycle' : 'Create Cycle'} size="sm"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary btn-md">Cancel</button>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md gap-2">
              {saving && <LoadingSpinner size="sm" />} {editCycle ? 'Update' : 'Create'}
            </button>
          </>
        }>
        <div className="space-y-3">
          <div><label className="label">Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input" placeholder="e.g. FY 2025-26" /></div>
          <div><label className="label">Year *</label><input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="input" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Start Date *</label><input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="input" /></div>
            <div><label className="label">End Date *</label><input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="input" /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="cycleActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-primary-600" />
            <label htmlFor="cycleActive" className="text-sm text-[var(--color-text)]">Set as active cycle</label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Cycle" message={`Delete cycle "${deleteTarget?.name}"? This cannot be undone.`} confirmLabel="Delete Cycle" />
    </div>
  );
};

export default AdminCyclesPage;
