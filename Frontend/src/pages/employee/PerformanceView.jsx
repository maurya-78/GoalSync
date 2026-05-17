import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, TrendingUp, Target, 
  Award, MessageSquare, Star, 
  ChevronRight, Calendar 
} from 'lucide-react';
import axios from '../../api/axios';
import WeightageSummaryChart from '../../components/charts/WeightageSummaryChart';
import GoalProgressChart from '../../components/charts/GoalProgressChart';
import toast from 'react-hot-toast';

export default function PerformanceView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get('/goals/sheet');
        setData(res.data);
      } catch (err) {
        toast.error("Could not synchronize performance telemetry.");
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) return <div className="p-10 text-slate-500 font-mono animate-pulse">Assembling Performance Scorecard...</div>;

  // Data for Charts
  const chartData = data?.goals.map(g => ({ name: g.title, value: g.weightage })) || [];
  const overallProgress = data?.goals.reduce((acc, g) => acc + (g.progress * (g.weightage / 100)), 0).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Top Banner: Hero Achievement */}
      <div className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 shadow-2xl shadow-indigo-600/20">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="w-40 h-40" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-white tracking-tight">Performance Summary</h1>
            <p className="text-indigo-100/70 text-sm mt-1 font-medium">Goal Cycle: FY 2026-27 | Strategic Alignment</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl">
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-indigo-100 tracking-widest">Total Score</p>
              <p className="text-3xl font-black text-white font-mono">{overallProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visual Analytics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target className="w-4 h-4" /> Focus Distribution
            </h3>
            <WeightageSummaryChart data={chartData} />
          </div>

          <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h4 className="text-sm font-bold text-white">Manager's Insight</h4>
             </div>
             <p className="text-xs text-slate-400 italic leading-relaxed">
                "{data?.feedback || 'Manager has not provided formal feedback yet. Keep updating your progress to trigger a review.'}"
             </p>
          </div>
        </div>

        {/* Right Column: Goal Breakdown Scorecard */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Achievement Breakdown
          </h3>
          
          {data?.goals.map((goal, idx) => (
            <motion.div 
              key={goal._id}
              whileHover={{ x: 10 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between group"
            >
              <div className="flex gap-4">
                <div className="text-lg font-black text-slate-800 group-hover:text-indigo-500 transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-200">{goal.title}</h4>
                    <div className="flex gap-3 mt-1">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Star className="w-3 h-3" /> Weight: {goal.weightage}%
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" /> Target: {goal.target}
                        </span>
                    </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                    <span className={`text-sm font-mono font-bold ${goal.progress > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {goal.progress}%
                    </span>
                    <div className="w-24 h-1 bg-slate-900 rounded-full mt-1 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${goal.progress > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${goal.progress}%` }}
                        />
                    </div>
                </div>
                <button className="p-2 bg-slate-900 rounded-lg text-slate-600 hover:text-white transition-all">
                    <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Action Footer */}
          <div className="mt-8 flex justify-center">
             <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">
                <Calendar className="w-4 h-4" /> View Historical Performance Cycle
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}