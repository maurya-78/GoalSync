import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Target, Percent, Lock, Unlock, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function StrategicGoals() {
  const [cycleId, setCycleId] = useState('');
  const [cycles, setCycles] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [goals, setGoals] = useState([]);
  
  // Quick Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weightage, setWeightage] = useState(15);
  const [target, setTarget] = useState('');

  useEffect(() => {
    axios.get('/admin/cycles').then(res => {
      setCycles(res.data);
      if (res.data.length > 0) setCycleId(res.data[0]._id);
    });
  }, []);

  const loadGoalSheet = () => {
    if (!cycleId) return;
    axios.get(`/goals/sheet?cycleId=${cycleId}`)
      .then(res => {
        setSheet(res.data.sheet);
        setGoals(res.data.goals);
      })
      .catch(() => toast.error('Error fetching target sheet frameworks.'));
  };

  useEffect(() => {
    loadGoalSheet();
  }, [cycleId]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    axios.post('/goals', { goalSheetId: sheet._id, title, description, weightage, target })
      .then(res => {
        toast.success('Core performance node injected into matrix configuration.');
        setTitle(''); setDescription(''); setTarget('');
        loadGoalSheet();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Validation layer block.'));
  };

  const handleDeleteGoal = (id) => {
    axios.delete(`/goals/${id}`)
      .then(() => {
        toast.success('Strategic node removed.');
        loadGoalSheet();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Access lock rejection.'));
  };

  const handleUpdateQuarterlyAchievement = (goalId, qFieldName, value) => {
    axios.put(`/goals/${goalId}`, { [qFieldName]: Number(value) })
      .then(() => {
        toast.success('Target execution progression trace captured.');
        loadGoalSheet();
      })
      .catch(err => toast.error('Check-in mutation error.'));
  };

  const handleFinalizeSheet = () => {
    axios.put(`/goals/sheet/submit/${sheet._id}`)
      .then(() => {
        toast.success('Strategy vector submitted for structural synchronization.');
        loadGoalSheet();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Framework schema check failed.'));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Strategic Framework Vectors</h1>
          <p className="text-xs text-slate-400 mt-1">Configure individual corporate vectors against system validation targets.</p>
        </div>
        <div>
          <select value={cycleId} onChange={(e) => setCycleId(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500">
            <option value="">Select Target Evaluation Horizon</option>
            {cycles.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {sheet && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Framework Directives Matrix</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sheet.isLocked ? 'bg-rose-950/40 border-rose-800 text-rose-400' : 'bg-indigo-950/40 border-indigo-800 text-indigo-400'}`}>
                {sheet.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Aggregated Structural Allocation</span>
                <span className={`font-bold ${sheet.totalWeightage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{sheet.totalWeightage}% / 100%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className={`h-full transition-all duration-300 ${sheet.totalWeightage === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(sheet.totalWeightage, 100)}%` }} />
              </div>
            </div>

            {!sheet.isLocked ? (
              <form onSubmit={handleAddGoal} className="space-y-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Strategy Objective Node</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="e.g., Core API Processing Pipeline Throughput Optimization" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Technical Context & Boundary Metrics</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Break down technical implementation constraints and architecture metrics..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Matrix Allocation Vector (%)</label>
                    <input type="number" min={10} max={100} value={weightage} onChange={(e) => setWeightage(e.target.value)} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Baseline Criteria</label>
                    <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="p99 Latency < 180ms" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-indigo-900/50 hover:border-indigo-500 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
                  <Plus className="w-4 h-4" /> Register Node Matrix
                </button>
              </form>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 text-slate-400 text-xs">
                <Lock className="w-4 h-4 text-rose-400 shrink-0" /> Strategy matrix schema validation finalized. Direct structure updates are administrative overrides only.
              </div>
            )}

            {sheet.status === 'Draft' && sheet.totalWeightage === 100 && (
              <button onClick={handleFinalizeSheet} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10">
                <CheckCircle className="w-4 h-4" /> Finalize & Submit Matrix Strategy
              </button>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {goals.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">No strategic vector assignments registered for this horizon scope.</div>
            ) : (
              goals.map(g => (
                <div key={g._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-semibold text-slate-200">{g.title}</h4>
                        {g.isShared && <span className="text-[9px] bg-emerald-950 border border-emerald-900 text-emerald-400 font-bold px-2 py-0.5 rounded-full">Shared Matrix</span>}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{g.description}</p>
                    </div>
                    {!sheet.isLocked && !g.isShared && (
                      <button onClick={() => handleDeleteGoal(g._id)} className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-rose-950/30 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Allocation Unit</span>
                      <span className="font-bold text-slate-300 flex items-center gap-1 mt-0.5"><Percent className="w-3 h-3 text-indigo-400" /> {g.weightage}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Target Metric Baseline</span>
                      <span className="font-bold text-slate-300 flex items-center gap-1 mt-0.5"><Target className="w-3 h-3 text-indigo-400" /> {g.target}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Aggregate Convergence</span>
                      <span className="font-bold text-emerald-400 block mt-0.5">{g.overallProgress}% Complete</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Quarterly Evaluation Tracking Traces</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['q1', 'q2', 'q3', 'q4'].map((q) => (
                        <div key={q} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{q.toUpperCase()} Trace</span>
                          <input type="number" min={0} max={100} value={g[`${q}Achievement`]} onChange={(e) => handleUpdateQuarterlyAchievement(g._id, `${q}Achievement`, e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500" placeholder="%" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}