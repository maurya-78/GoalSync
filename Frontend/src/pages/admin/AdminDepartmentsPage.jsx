import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import adminService from '../../services/adminService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '' };

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await adminService.getDepartments(); setDepartments(r.data.departments); }
    catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditDept(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d) => { setEditDept(d); setForm({ name: d.name, description: d.description || '' }); setModalOpen(true); };

  const save = async () => {
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editDept) await adminService.updateDepartment(editDept._id, form);
      else await adminService.createDepartment(form);
      toast.success(editDept ? 'Department updated' : 'Department created');
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await adminService.deleteDepartment(deleteTarget._id); toast.success('Department deleted'); setDeleteTarget(null); load(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Departments</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{departments.length} departments</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-md gap-2"><Plus className="w-4 h-4" />New Department</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : departments.length === 0 ? (
        <div className="card">
          <EmptyState icon={Building2} title="No departments" description="Create departments to organize your teams." action={<button onClick={openCreate} className="btn btn-primary btn-md gap-2"><Plus className="w-4 h-4" />Create Department</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(d => (
            <div key={d._id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(d)} className="btn-ghost p-1.5 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget(d)} className="btn-ghost p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">{d.name}</h3>
              {d.description && <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">{d.description}</p>}
              {d.head && <p className="text-xs text-[var(--color-text-muted)] mt-2">Head: {d.head.name}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editDept ? 'Edit Department' : 'Create Department'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn btn-secondary btn-md">Cancel</button><button onClick={save} disabled={saving} className="btn btn-primary btn-md gap-2">{saving && <LoadingSpinner size="sm" />}{editDept ? 'Update' : 'Create'}</button></>}>
        <div className="space-y-3">
          <div><label className="label">Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input" placeholder="e.g. Engineering" /></div>
          <div><label className="label">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input" placeholder="Brief description..." /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Department" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} confirmLabel="Delete" />
    </div>
  );
};

export default AdminDepartmentsPage;
