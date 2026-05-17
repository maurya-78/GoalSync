import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Plus, CheckCircle2, Clock, 
  AlertCircle, Scale, Save, Trash2, Loader2 
} from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function MyGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch User's Current Goal Sheet
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get('/goals/sheet');
        setGoals(res.data?.goals || []);
      } catch (err) {
        toast.error("Failed to synchronize your performance grid.");
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // 2. Add New Goal Row
  const addGoal = () => {
    if (goals.length >= 7) {
      return toast.error("Maximum limit of 7 strategic goals reached.");
    }
    setGoals([...goals, { 
      title: '', 
      description: '', 
      weightage: 0, 
      target: '', 
      status: 'Draft',
      isNew: true 
    }]);
  };

  // 3. Weightage Calculation Logic
  const totalWeightage = goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);

  const handleUpdate = (index, field, value) => {
    const updated = [...goals];
    updated[index][field] = value;
    setGoals(updated);
  };

  const saveSheet = async () => {
    if (totalWeightage !== 100) {
      return toast.error(`Weightage total must be exactly 100%. Current: ${totalWeightage}%`);
    }
    
    setIsSaving(true);
    try {
      await axios.post('/goals/sheet', { goals });
      toast.success("Strategic framework updated and locked.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sync failed.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500 font-mono p-10 animate-pulse">Initializing Identity Workspace...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header & Weightage Shield */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-mono">My Strategic Grid</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Annual Performance Framework & Objectives</p>
        </div>

        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all ${totalWeightage === 100 ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-600/10 border-rose-500/30 text-rose-400'}`}>
          <Scale className="w-5 h-5" />
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-tighter leading-none">Total Weightage</p>
            <p className="text-xl font-black font-mono">{totalWeightage}%</p>
          </div>
          {totalWeightage === 100 && <CheckCircle2 className="w-5 h-5 ml-2 animate-bounce" />}
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {goals.map((goal, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 group hover:border-indigo-500/50 transition-all shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Status Icon */}
                <div className="md:col-span-1 flex flex-col items-center pt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                    {idx + 1}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="md:col-span-8 space-y-4">
                  <input 
                    type="text" 
                    value={goal.title}
                    onChange={(e) => handleUpdate(idx, 'title', e.target.value)}
                    placeholder="Goal Objective (e.g., Increase System Uptime)"
                    className="w-full bg-transparent border-b border-slate-800 text-lg font-bold text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-all pb-1"
                  />
                  <textarea 
                    value={goal.description}
                    onChange={(e) => handleUpdate(idx, 'description', e.target.value)}
                    placeholder="Provide specific details about the target achievement..."
                    className="w-full bg-transparent text-sm text-slate-400 placeholder-slate-700 focus:outline-none resize-none"
                    rows={2}
                  />
                </div>

                {/* Metrics & Weightage */}
                <div className="md:col-span-3 space-y-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weightage (%)</label>
                    <input 
                      type="number" 
                      value={goal.weightage}
                      onChange={(e) => handleUpdate(idx, 'weightage', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-indigo-400 font-mono text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success Metric</label>
                    <input 
                      type="text" 
                      value={goal.target}
                      onChange={(e) => handleUpdate(idx, 'target', e.target.value)}
                      placeholder="e.g. 99.9%"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <button 
            onClick={addGoal}
            className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            Append Strategic Objective
          </button>
          
          <button 
            onClick={saveSheet}
            disabled={isSaving || totalWeightage !== 100}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Commit Changes to Ledger</>}
          </button>
        </div>
      </div>
    </div>
  );
}