import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  LineChart as LineIcon
} from 'lucide-react';

/**
 * AI PRODUCTIVITY INSIGHTS
 * ------------------------
 * Analyzes Redux goals state to provide strategic suggestions
 * and performance telemetry.
 */

const AIInsights = ({ goals = [] }) => {
  // Logic: Calculate insights based on goal data
  const lowProgressGoals = goals.filter(g => g.overallProgress < 30 && g.weightage > 20);
  const highWeightagePending = goals.find(g => g.weightage >= 40 && g.overallProgress < 100);

  const suggestions = [
    {
      id: 1,
      type: 'optimization',
      label: 'Priority Shift',
      text: highWeightagePending 
        ? `Accelerate "${highWeightagePending.title}". High structural weightage detected.`
        : 'Goal distribution is balanced. Maintain current velocity.',
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10'
    },
    {
      id: 2,
      type: 'warning',
      label: 'Velocity Alert',
      text: lowProgressGoals.length > 0 
        ? `${lowProgressGoals.length} high-impact goals are showing stagnant trajectory.` 
        : 'All strategic vectors are on track for Q2 completion.',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. SYSTEM RECOMMENDATIONS */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Neural Suggestions</h3>
        </div>

        <div className="space-y-4">
          {suggestions.map((s) => (
            <motion.div 
              key={s.id}
              whileHover={{ x: 5 }}
              className="flex gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 group cursor-default"
            >
              <div className={`p-3 rounded-xl ${s.bg} ${s.color} h-fit`}>
                <s.icon size={18} />
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>
                  {s.label}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed mt-1">
                  {s.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. PERFORMANCE ANALYSIS GRID */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Graphic */}
        <div className="absolute -bottom-10 -right-10 opacity-5">
           <LineIcon size={200} className="text-indigo-500" />
        </div>

        <div className="space-y-1 relative z-10">
          <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Weekly Efficiency</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Operational Pulse: Week 21</p>
        </div>

        <div className="mt-8 space-y-6 relative z-10">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-4xl font-black text-white italic">72%</span>
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">+8% Velocity</span>
              </div>
            </div>
            
            {/* Minimalist Bar Chart Representation */}
            <div className="flex items-end gap-1.5 h-16">
               {[40, 60, 45, 90, 65, 80, 72].map((h, i) => (
                 <div 
                   key={i} 
                   className={`w-1.5 rounded-full ${i === 6 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-800'}`} 
                   style={{ height: `${h}%` }}
                 />
               ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex gap-4">
             <div className="flex-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Peak Output</p>
                <p className="text-xs font-bold text-slate-200">14:00 - 16:00 HRS</p>
             </div>
             <div className="flex-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Grid Status</p>
                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle size={12} /> OPTIMAL
                </p>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AIInsights;