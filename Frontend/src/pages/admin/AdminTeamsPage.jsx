import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Briefcase, Users } from 'lucide-react';
import adminService from '../../services/adminService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Avatar from '../../components/common/Avatar';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '' };

const AdminTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await adminService.getTeams(); setTeams(r.data.teams); }
    catch { toast.error('Failed to load teams'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTeam(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (t) => { setEditTeam(t); setForm({ name: t.name, description: t.description || '' }); setModalOpen(true); };

  const save = async () => {
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editTeam) await adminService.updateTeam(editTeam._id, form);
      else await adminService.createTeam(form);
      toast.success(editTeam ? 'Team updated' : 'Team created');
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await adminService.deleteTeam(deleteTarget._id); toast.success('Team deleted'); setDeleteTarget(null); load(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Teams</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{teams.length} teams</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-md gap-2"><Plus className="w-4 h-4" />New Team</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : teams.length === 0 ? (
        <div className="card">
          <EmptyState icon={Briefcase} title="No teams" description="Create teams to group employees together." action={<button onClick={openCreate} className="btn btn-primary btn-md gap-2"><Plus className="w-4 h-4" />Create Team</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(t => (
            <div key={t._id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(t)} className="btn-ghost p-1.5 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget(t)} className="btn-ghost p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">{t.name}</h3>
              {t.description && <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2">{t.description}</p>}
              {t.manager && (
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={t.manager.name} src={t.manager.avatar} size="xs" />
                  <span className="text-xs text-[var(--color-text-muted)]">{t.manager.name} (Manager)</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <Users className="w-3 h-3 text-[var(--color-text-muted)]" />
                <span className="text-xs text-[var(--color-text-muted)]">{t.members?.length || 0} members</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTeam ? 'Edit Team' : 'Create Team'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn btn-secondary btn-md">Cancel</button><button onClick={save} disabled={saving} className="btn btn-primary btn-md gap-2">{saving && <LoadingSpinner size="sm" />}{editTeam ? 'Update' : 'Create'}</button></>}>
        <div className="space-y-3">
          <div><label className="label">Team Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input" placeholder="e.g. Frontend Team" /></div>
          <div><label className="label">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input" placeholder="What does this team do?" /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Team" message={`Delete team "${deleteTarget?.name}"? This cannot be undone.`} confirmLabel="Delete Team" />
    </div>
  );
};

export default AdminTeamsPage;
