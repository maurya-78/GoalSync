import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Target, Trash2, Save, Lock, 
  ChevronRight, AlertCircle, CheckCircle2, Info
} from 'lucide-react';
import { fetchGoals, createGoal, updateGoalAction, deleteGoalAction } from '../../redux/slices/goalSlice';
import { toast } from 'react-hot-toast';

export default function ManageGoals() {
  const dispatch = useDispatch();
  const { items: goals, totalWeightage, isLocked, status, sheet } = useSelector((state) => state.goals);
  
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '', description: '', weightage: 20, target: ''
  });

  useEffect(() => {
    dispatch(fetchGoals('current-cycle-2026'));
  }, [dispatch]);

  // Handle Add Goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (totalWeightage + Number(newGoal.weightage) > 100) {
      return toast.error("Total weightage cannot exceed 100%");
    }
    
    const result = await dispatch(createGoal({ ...newGoal, goalSheetId: sheet._id }));
    if (!result.error) {
      toast.success("Strategic Target Added");
      setAddModalOpen(false);
      setNewGoal({ title: '', description: '', weightage: 20, target: '' });
    }
  };

  // Handle Progress Update (Quick Toggle)
  const handleProgressUpdate = (id, currentProgress) => {
    const nextProgress = currentProgress >= 100 ? 0 : currentProgress + 25;
    dispatch(updateGoalAction({ id, data: { q1Achievement: nextProgress } }));
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* 1. HEADER & STATUS */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Strategic <span className="text-indigo-500">Matrix</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            Configure individual performance vectors
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Weight Allocation</span>
            <span className={`text-xl font-black ${totalWeightage === 100 ? 'text-emerald-500' : 'text-indigo-500'}`}>
              {totalWeightage}% / 100%
            </span>
          </div>
          
          {!isLocked && (
            <button 
              onClick={() => setAddModalOpen(true)}
              disabled={totalWeightage >= 100}
              className="p-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all shadow-lg"
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      </header>

      {/* 2. GOAL GRID */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode='popLayout'>
          {goals.map((goal, index) => (
            <motion.div 
              key={goal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 md:p-8 group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-indigo-500 font-black italic">#{index + 1}</span>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{goal.title}</h3>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase">
                      Weight: {goal.weightage}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{goal.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    <Target size={12} /> Target: {goal.target}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Fulfillment</p>
                    <button 
                      onClick={() => !isLocked && handleProgressUpdate(goal._id, goal.q1.achievement)}
                      className={`text-2xl font-black italic transition-colors ${isLocked ? 'text-slate-600' : 'text-white hover:text-indigo-500'}`}
                    >
                      {goal.q1.achievement}%
                    </button>
                  </div>
                  
                  {!isLocked && (
                    <button 
                      onClick={() => dispatch(deleteGoalAction(goal._id))}
                      className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.q1.achievement}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {goals.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
            <Info className="mx-auto text-slate-700 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-500 uppercase italic">Grid Empty</h3>
            <p className="text-sm text-slate-600 mt-2">Initialize your strategic targets to begin tracking.</p>
          </div>
        )}
      </div>

      {/* 3. SUBMISSION LOCKER */}
      {totalWeightage === 100 && !isLocked && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3">
            <Lock size={18} /> Finalize & Lock Matrix
          </button>
        </div>
      )}

      {/* 4. ADD GOAL MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            />
            <motion.form 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleAddGoal}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
            >
              <h2 className="text-xl font-black text-white uppercase italic">Add <span className="text-indigo-500">Vector</span></h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Target Title</label>
                  <input 
                    required type="text" placeholder="e.g., Increase Frontend Performance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Weightage (%)</label>
                    <input 
                      required type="number" min="10" max="100" placeholder="20"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                      onChange={(e) => setNewGoal({...newGoal, weightage: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Metric/Target</label>
                    <input 
                      required type="text" placeholder="e.g., 90+ Lighthouse Score"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                      onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Strategic Description</label>
                  <textarea 
                    required rows="3" placeholder="Detailed objective..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all">
                Inject into Matrix
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}