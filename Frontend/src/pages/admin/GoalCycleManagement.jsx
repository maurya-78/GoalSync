import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Calendar, Plus, Layers, ShieldCheck } from 'lucide-react';
import ReusableTable from '../../components/tables/ReusableTable';

export default function GoalCycleManagement() {
  const [cycles, setCycles] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCycles = () => {
    axios.get('/admin/cycles')
      .then(res => setCycles(res.data))
      .catch(() => toast.error('Error contacting cycle state infrastructure.'));
  };

  useEffect(() => { fetchCycles(); }, []);

  const onSubmit = (data) => {
    axios.post('/admin/cycles', data)
      .then(() => {
        toast.success('Enterprise framework alignment cycle opened successfully.');
        reset();
        fetchCycles();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Error executing cycle creation.'));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Corporate Evaluation Cycles</h1>
        <p className="text-xs text-slate-400 mt-1">Configure systemic temporal windows for strategic target allocation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Init Alignment Cycle
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cycle Label name</label>
              <input type="text" {...register('name', { required: true })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="e.g., FY 2026 Q3 Strategic Horizon" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Launch Window Timestamp</label>
              <input type="date" {...register('startDate', { required: true })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Sunset Window Deadline</label>
              <input type="date" {...register('endDate', { required: true })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10">
              <Plus className="w-4 h-4" /> Deploy Cycle State
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <ReusableTable
            headers={['Temporal Cycle Context', 'Launch Date', 'Target Horizon Lockout', 'System State']}
            data={cycles}
            renderRow={(cycle) => (
              <tr key={cycle._id} className="hover:bg-slate-900/30 transition-all">
                <td className="px-6 py-4 font-semibold text-white">{cycle.name}</td>
                <td className="px-6 py-4 font-mono text-slate-400">{new Date(cycle.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-mono text-slate-400">{new Date(cycle.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-950/40 border-emerald-800 text-emerald-400`}>
                    <ShieldCheck className="w-3 h-3" /> Active Infrastructure
                  </span>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );
}