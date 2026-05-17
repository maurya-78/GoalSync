import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { 
  ShieldAlert, Activity, Target, Trophy, 
  Users, Layers, ArrowUpRight, Zap, Clock, BrainCircuit 
} from 'lucide-react';

// Actions & Components
import { fetchGoals } from '../../redux/slices/goalSlice';
import StatCard from '../../components/dashboard/StatCard';
import GoalProgressChart from '../../components/charts/GoalProgressChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import AIInsights from '../../components/dashboard/AIInsights';

/**
 * UNIFIED COMMAND CENTER v4.0
 * ---------------------------
 * Real-time performance monitoring dashboard with weighted
 * analytics and AI-driven productivity insights.
 */

export default function UnifiedDashboard() {
  const dispatch = useDispatch();
  
  // Redux State Extraction
  const { items: goals, totalWeightage, status } = useSelector((state) => state.goals);
  const { user } = useSelector((state) => state.auth);

 useEffect(() => {
  const loadCycles = async () => {
    try {
      const response = await api.get('/cycles');
      const fetchedCycles = response.data?.cycles || [];
      if (fetchedCycles.length > 0) {
        const activeCycleId = fetchedCycles[0]._id;
        dispatch(fetchGoals(activeCycleId));
      }
    } catch (error) {
      console.log(error);
    }
  };
  loadCycles();
}, [dispatch]);

  // --- ANALYTICS ENGINE ---
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.overallProgress === 100).length;
  const pendingGoals = totalGoals - completedGoals;
  
  // Weighted Average Calculation
  const aggregateProgress = totalGoals > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.overallProgress * (g.weightage / 100)), 0)) 
    : 0;

  // Temporal Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Global Loading State
  if (status === 'loading') {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
          <div className="absolute w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. SECTOR HEADER (Hero Section) */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter font-mono uppercase italic">
            {greeting}, {user?.name?.split(' ')[0] || 'Operator'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Grid Online</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-indigo-500" /> System: Operational
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/40 border border-slate-800 p-3 rounded-3xl backdrop-blur-md">
           <div className="px-5 py-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Access Role</p>
              <p className="text-sm font-bold text-white flex items-center gap-2 italic">
                {user?.role || 'Guest'} <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </p>
           </div>
        </div>
      </header>

      {/* 2. KPI TELEMETRY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Targets" 
          value={totalGoals} 
          icon={Target} 
          trend="Real-time" 
          description="Strategic vectors in grid" 
        />
        <StatCard 
          title="Fulfillment" 
          value={`${completedGoals}/${totalGoals}`} 
          icon={Activity} 
          trend={`${aggregateProgress}% Avg`}
          trendColor="text-emerald-400"
          description="Overall success rate" 
        />
        <StatCard 
          title="System Weight" 
          value={`${totalWeightage}%`} 
          icon={Layers} 
          description={totalWeightage < 100 ? "Matrix partial" : "Matrix finalized"} 
        />
        <StatCard 
          title="Neural Sync" 
          value="98.4%" 
          icon={Trophy} 
          description="Alignment efficiency" 
        />
      </div>

      {/* 3. CENTRAL ANALYTICS ZONE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Fulfillment Matrix (Left/Center) */}
        <div className="xl:col-span-2 bg-slate-950/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Layers className="w-48 h-48" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Goal Trajectory</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Sector Analysis: Performance Vectors</p>
            </div>
            <button className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
              Full Diagnostics
            </button>
          </div>
          
          <div className="h-[350px] w-full">
            <GoalProgressChart goals={goals} />
          </div>
        </div>

        {/* Real-time Event Feed (Right) */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-8 border-b border-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Telemetry Logs</h3>
            </div>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <RecentActivity />
          </div>
        </div>
      </div>

      {/* 4. AI PRODUCTIVITY & INSIGHTS GRID */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <BrainCircuit className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">Neural Intelligence Insights</h2>
        </div>
        <AIInsights goals={goals} />
      </section>

      {/* 5. DYNAMIC SYSTEM ALERTS */}
      {(user?.role === 'Admin' || user?.role === 'Manager' || totalWeightage < 100) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-gradient-to-r from-rose-600/5 to-transparent border border-rose-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-6"
        >
          <div className="p-5 bg-rose-500/20 rounded-3xl text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-md font-black text-white uppercase italic tracking-tight">Grid Compliance Warning</h4>
            <p className="text-xs text-rose-500/80 font-bold uppercase tracking-wide mt-1 leading-relaxed">
              {totalWeightage < 100 
                ? `Operational Criticality: Cumulative weightage is at ${totalWeightage}%. System requires 100% allocation for protocol submission.`
                : "Protocol Status: Strategic grid finalized. Awaiting managerial override or verification."}
            </p>
          </div>
          <button className="px-8 py-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all shadow-lg">
            Review Protocol
          </button>
        </motion.div>
      )}

    </div>
  );
}