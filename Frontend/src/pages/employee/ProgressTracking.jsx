import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Save, MessageSquare, 
  CheckCircle2, Loader2, Info 
} from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProgressTracking() {
  const [goalSheet, setGoalSheet] = useState(null);
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchActiveSheet();
  }, []);

  const fetchActiveSheet = async () => {
    try {
      const res = await axios.get('/goals/sheet');
      setGoalSheet(res.data);
      // Initializing updates state with current progress values
      const initialUpdates = {};
      res.data?.goals.forEach(g => {
        initialUpdates[g._id] = { progress: g.progress || 0, comment: '' };
      });
      setUpdates(initialUpdates);
    } catch (err) {
      toast.error("Failed to load active goal sheet.");
    } finally {
      setLoading(false);
    }
  };

  const handleProgressChange = (goalId, value) => {
    setUpdates(prev => ({
      ...prev,
      [goalId]: { ...prev[goalId], progress: Number(value) }
    }));
  };

  const handleCommentChange = (goalId, value) => {
    setUpdates(prev => ({
      ...prev,
      [goalId]: { ...prev[goalId], comment: value }
    }));
  };

  const submitProgress = async () => {
    setIsUpdating(true);
    try {
      // In a real scenario, you'd send an array of updates
      const updateData = Object.keys(updates).map(id => ({
        goalId: id,
        progress: updates[id].progress,
        comment: updates[id].comment
      }));

      await axios.patch('/goals/progress', { updates: updateData });
      toast.success("Progress telemetry synced successfully.");
      fetchActiveSheet();
    } catch (err) {
      toast.error("Telemetry sync failed. Try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-500 font-mono animate-pulse">Scanning Achievement Metrics...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-mono">Performance Pulse</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Track and update achievement across strategic goals</p>
        </div>
        <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Sheet Status</span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold">
                {goalSheet?.status?.toUpperCase() || 'LOCKED'}
            </span>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="space-y-4">
        {goalSheet?.goals.map((goal) => (
          <div key={goal._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Goal Detail (Left) */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                    <h3 className="text-sm font-bold text-white">{goal.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{goal.description}</p>
                <div className="flex gap-4 pt-2">
                    <div className="px-2 py-1 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">
                        Weight: <span className="text-white font-mono">{goal.weightage}%</span>
                    </div>
                    <div className="px-2 py-1 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">
                        Target: <span className="text-indigo-400 font-mono">{goal.target}</span>
                    </div>
                </div>
              </div>

              {/* Progress Slider (Middle) */}
              <div className="lg:col-span-3 flex flex-col justify-center space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Achievement</span>
                    <span className="text-sm font-black text-white font-mono">{updates[goal._id]?.progress}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={updates[goal._id]?.progress || 0}
                  onChange={(e) => handleProgressChange(goal._id, e.target.value)}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
                    <span>Started</span>
                    <span>Completed</span>
                </div>
              </div>

              {/* Update Feedback (Right) */}
              <div className="lg:col-span-4 relative">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Progress Narrative</label>
                <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-3 h-3 text-slate-600" />
                    <textarea 
                        value={updates[goal._id]?.comment || ''}
                        onChange={(e) => handleCommentChange(goal._id, e.target.value)}
                        placeholder="What changed since last sync?"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500 resize-none h-16"
                    />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between bg-indigo-600/5 border border-indigo-500/10 p-6 rounded-2xl">
        <div className="flex items-center gap-3 text-indigo-400">
            <Info className="w-5 h-5" />
            <p className="text-xs font-medium">Updates will be logged in the audit trail and visible to your Manager.</p>
        </div>
        <button 
          onClick={submitProgress}
          disabled={isUpdating}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Sync All Progress</>}
        </button>
      </div>
    </div>
  );
}