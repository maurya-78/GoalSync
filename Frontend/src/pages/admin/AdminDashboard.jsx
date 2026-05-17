import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { motion } from 'framer-motion';
import { 
  Users, Target, ShieldCheck, Activity, 
  ArrowUpRight, Download, RefreshCcw 
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import CompletionHeatmap from '../../components/dashboard/CompletionHeatmap';
import GoalProgressChart from '../../components/charts/GoalProgressChart';
import ReusableTable from '../../components/tables/ReusableTable';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, logsRes] = await Promise.all([
        axios.get('/admin/metrics-report'),
        axios.get('/admin/audit-logs')
      ]);
      setMetrics(metricsRes.data);
      setLogs(logsRes.data.slice(0, 5)); // Only show last 5 activities
    } catch (error) {
      toast.error("Failed to sync system telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Mock data for heatmap (In production, derive from metrics)
  const heatmapData = [
    { name: 'Engineering', progress: 88, count: 42 },
    { name: 'Marketing', progress: 62, count: 18 },
    { name: 'Sales', progress: 94, count: 25 },
    { name: 'Product', progress: 45, count: 12 },
  ];

  const pieData = [
    { name: 'Approved', value: metrics?.criticalSheetsCount || 0 },
    { name: 'Pending', value: metrics?.outstandingSheetsCount || 0 },
    { name: 'Draft', value: metrics?.draftSheetsCount || 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-mono">System HQ</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Organization-Wide Strategic Oversight</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchAdminData}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" /> Export Global Report
          </button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Workforce" 
          value="1,240" 
          icon={Users} 
          description="Active Identities" 
        />
        <StatCard 
          title="Approved Frameworks" 
          value={metrics?.criticalSheetsCount || '0'} 
          icon={ShieldCheck} 
          trendColor="text-emerald-400"
          description="Locked & Validated" 
        />
        <StatCard 
          title="Global Progress" 
          value="72.4%" 
          icon={Activity} 
          trendColor="text-indigo-400"
          description="Avg. Achievement" 
        />
        <StatCard 
          title="Pending Reviews" 
          value={metrics?.outstandingSheetsCount || '0'} 
          icon={Target} 
          trendColor="text-amber-400"
          description="Action Required" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview Chart */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Framework Adoption</h3>
            <p className="text-[10px] text-slate-600 font-medium italic">Status distribution of all active goal sheets.</p>
          </div>
          <GoalProgressChart data={pieData} />
        </div>

        {/* Heatmap Section */}
        <div className="lg:col-span-2">
          <CompletionHeatmap teamsData={heatmapData} />
        </div>
      </div>

      {/* Recent Audit Logs Snapshot */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-900 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Security Logs</h3>
          <button className="text-[10px] font-bold text-indigo-400 hover:underline">View All Activities</button>
        </div>
        <ReusableTable 
          headers={['Action', 'Performed By', 'Entity', 'Timestamp']}
          data={logs}
          renderRow={(log) => (
            <tr key={log._id} className="hover:bg-slate-900/30 transition-colors border-b border-slate-900/50 last:border-0">
              <td className="px-6 py-4 font-mono text-indigo-400">{log.action}</td>
              <td className="px-6 py-4 text-white font-medium">{log.performedBy?.name || 'System'}</td>
              <td className="px-6 py-4 text-slate-500">{log.entityType}</td>
              <td className="px-6 py-4 text-[10px] text-slate-600">{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}