import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Target, AlertCircle, 
  ChevronRight, Filter, Download, PieChart as PieIcon 
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import QuarterlyTrendChart from '../../components/charts/QuarterlyTrendChart';
import GoalProgressChart from '../../components/charts/GoalProgressChart';
import toast from 'react-hot-toast';

export default function TeamAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/management/dashboard');
        setAnalytics(response.data);
      } catch (err) {
        toast.error("Telemetry link failed. Could not fetch team insights.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Transformation for Quarterly Chart
  const trendData = [
    { quarter: 'Q1', progress: 40 },
    { quarter: 'Q2', progress: 55 },
    { quarter: 'Q3', progress: 70 },
    { quarter: 'Q4', progress: 85 },
  ];

  if (loading) return <div className="text-slate-500 font-mono animate-pulse">Scanning Team Metrics...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-mono flex items-center gap-2">
            <TrendingUp className="text-indigo-500 w-6 h-6" /> Managerial Intelligence
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Team Performance & Workload Analytics</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
            <Filter className="w-4 h-4" />
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" /> Generate Ops Report
          </button>
        </div>
      </div>

      {/* Top Level Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Direct Reports" value={analytics?.teamMembers?.length || '0'} icon={Users} description="Active Workforce" />
        <StatCard title="Team Avg. Progress" value="68%" icon={Target} trendColor="text-emerald-400" description="+12% from last month" />
        <StatCard title="Overdue Goals" value="4" icon={AlertCircle} trendColor="text-rose-500" description="Immediate action required" />
        <StatCard title="Review Velocity" value="2.4 days" icon={TrendingUp} description="Avg. Approval Time" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Quarters */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Quarterly Trajectory</h3>
              <p className="text-[10px] text-slate-500 italic">Aggregated team performance over time.</p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-600" />
          </div>
          <QuarterlyTrendChart data={trendData} />
        </div>

        {/* Goal Type Distribution */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
           <div className="mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Operational Focus</h3>
              <p className="text-[10px] text-slate-500 italic">Strategic vs Routine goal distribution.</p>
            </div>
            <GoalProgressChart data={[
              { name: 'Strategic', value: 60 },
              { name: 'Operational', value: 30 },
              { name: 'Developmental', value: 10 }
            ]} />
        </div>
      </div>

      {/* Member Performance Spotlight */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-900">
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Workforce Spotlight</h3>
        </div>
        <div className="divide-y divide-slate-900">
          {analytics?.teamMembers?.map((member, idx) => (
            <motion.div 
              key={member._id}
              whileHover={{ x: 5 }}
              className="p-5 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold text-xs uppercase">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{member.name}</h4>
                  <p className="text-[10px] text-slate-500">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Goal Health</div>
                  <div className="w-32 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx % 2 === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${80 - (idx * 10)}%` }}
                    ></div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}