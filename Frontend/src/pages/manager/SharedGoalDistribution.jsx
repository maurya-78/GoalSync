import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Share2, Users, Target, HelpCircle, Loader2 } from 'lucide-react';

export default function SharedGoalDistribution() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [teams, setTeams] = useState([]);

  // Fetching teams from the management dashboard data
  useEffect(() => {
    axios.get('/management/dashboard')
      .then(res => {
        const distinctTeams = res.data.teamMembers.reduce((acc, current) => {
          if (current.team && !acc.some(t => t._id === current.team._id)) {
            acc.push(current.team);
          }
          return acc;
        }, []);
        setTeams(distinctTeams);
      })
      .catch(() => toast.error("Could not load team structures."));
  }, []);

  const onDistribute = async (data) => {
    try {
      await axios.post('/management/shared', {
        teamId: data.teamId,
        title: data.title,
        description: data.description,
        defaultWeightage: Number(data.defaultWeightage),
        target: data.target
      });
      toast.success('Strategy successfully cascaded to all team members.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Broadcast failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-600/20 rounded-xl">
          <Share2 className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Shared Strategy Injection</h1>
          <p className="text-xs text-slate-400 mt-1">Cascade read-only key results across organizational units.</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-xl flex gap-3 text-xs text-indigo-300 leading-relaxed">
          <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
          <span>
            <strong>Policy Notice:</strong> Distributed goals are <strong>Locked</strong> for employees. 
            They can only adjust the weightage within their 100% limit.
          </span>
        </div>

        <form onSubmit={handleSubmit(onDistribute)} className="space-y-5">
          {/* Team Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Team Cluster</label>
            <select 
              {...register('teamId', { required: true })} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Select Organizational Unit</option>
              {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Global Objective Title</label>
            <input 
              type="text" 
              {...register('title', { required: true })} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" 
              placeholder="e.g., Q2 Technical Debt Reduction" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Context & Instructions</label>
            <textarea 
              {...register('description', { required: true })} 
              rows={3} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" 
              placeholder="Specify requirements for all team members..." 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weightage */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Default Allocation (%)</label>
              <input 
                type="number" 
                min={10} 
                max={50} 
                defaultValue={15}
                {...register('defaultWeightage', { required: true })} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" 
              />
            </div>
            {/* Target */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Success Metric</label>
              <input 
                type="text" 
                {...register('target', { required: true })} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" 
                placeholder="e.g., > 95% test coverage" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 mt-4"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Share2 className="w-4 h-4" /> Cascade Strategic Goal</>}
          </button>
        </form>
      </div>
    </div>
  );
}