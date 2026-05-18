import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGoal, updateGoal } from '../../redux/slices/goalSlice';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'individual',
  weightage: 1,
  kpiTarget: 100,
  kpiUnit: '%',
  q1Progress: 0,
  q2Progress: 0,
  q3Progress: 0,
  q4Progress: 0,
  startDate: '',
  dueDate: '',
  tags: '',
};

const GoalModal = ({ isOpen, onClose, editGoal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.goals);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editGoal) {
      setForm({
        title: editGoal.title || '',
        description: editGoal.description || '',
        priority: editGoal.priority || 'medium',
        category: editGoal.category || 'individual',
        weightage: editGoal.weightage ?? 1,
        kpiTarget: editGoal.kpiTarget ?? 100,
        kpiUnit: editGoal.kpiUnit || '%',
        q1Progress: editGoal.q1Progress ?? 0,
        q2Progress: editGoal.q2Progress ?? 0,
        q3Progress: editGoal.q3Progress ?? 0,
        q4Progress: editGoal.q4Progress ?? 0,
        startDate: editGoal.startDate ? editGoal.startDate.substring(0, 10) : '',
        dueDate: editGoal.dueDate ? editGoal.dueDate.substring(0, 10) : '',
        tags: (editGoal.tags || []).join(', '),
      });
    } else {
      setForm(defaultForm);
    }
  }, [editGoal, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');

    const payload = {
      ...form,
      weightage: Number(form.weightage),
      kpiTarget: Number(form.kpiTarget),
      q1Progress: Number(form.q1Progress),
      q2Progress: Number(form.q2Progress),
      q3Progress: Number(form.q3Progress),
      q4Progress: Number(form.q4Progress),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    const action = editGoal
      ? dispatch(updateGoal({ id: editGoal._id, data: payload }))
      : dispatch(createGoal(payload));

    const result = await action;
    if (!result.error) {
      toast.success(editGoal ? 'Goal updated!' : 'Goal created!');
      onClose();
    } else {
      toast.error(result.error.message || 'Something went wrong');
    }
  };

  const inputClass = 'input';
  const labelClass = 'label';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editGoal ? 'Edit Goal' : 'Create New Goal'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} type="button" className="btn btn-secondary btn-md">Cancel</button>
          <button onClick={handleSubmit} type="button" disabled={loading} className="btn btn-primary btn-md gap-2">
            {loading && <LoadingSpinner size="sm" />}
            {editGoal ? 'Update Goal' : 'Create Goal'}
          </button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className={labelClass}>Goal Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Enter goal title..." />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Describe this goal..." />
        </div>

        {/* Row: priority + category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              <option value="individual">Individual</option>
              <option value="team">Team</option>
              <option value="department">Department</option>
              <option value="organization">Organization</option>
            </select>
          </div>
        </div>

        {/* Row: weightage + KPI */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Weightage</label>
            <input type="number" name="weightage" value={form.weightage} onChange={handleChange} className={inputClass} min={0} max={100} />
          </div>
          <div>
            <label className={labelClass}>KPI Target</label>
            <input type="number" name="kpiTarget" value={form.kpiTarget} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>KPI Unit</label>
            <input name="kpiUnit" value={form.kpiUnit} onChange={handleChange} className={inputClass} placeholder="%, units, $" />
          </div>
        </div>

        {/* Quarterly progress */}
        <div>
          <label className={labelClass}>Quarterly Progress (%)</label>
          <div className="grid grid-cols-4 gap-3">
            {['q1Progress', 'q2Progress', 'q3Progress', 'q4Progress'].map((q, i) => (
              <div key={q}>
                <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Q{i + 1}</label>
                <input
                  type="number"
                  name={q}
                  value={form[q]}
                  onChange={handleChange}
                  className={inputClass}
                  min={0}
                  max={100}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>Tags <span className="text-[var(--color-text-muted)] font-normal">(comma separated)</span></label>
          <input name="tags" value={form.tags} onChange={handleChange} className={inputClass} placeholder="performance, kpi, sales..." />
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal;
