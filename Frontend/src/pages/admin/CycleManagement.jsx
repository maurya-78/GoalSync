import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Archive, CheckCircle2, 
  AlertCircle, Trash2, Edit3, Loader2, Zap 
} from 'lucide-react';
import api from '../../services/axios'; // Centralized axios instance
import { toast } from 'react-hot-toast';

export default function CycleManagement() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Upcoming'
  });

  // Fetch all cycles
  const fetchCycles = async () => {
    try {
      const res = await api.get('/cycles');
      setCycles(res.data.data);
    } catch (err) {
      toast.error('Failed to load operational cycles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCycles(); }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cycles', formData);
      toast.success('Operational Cycle Initialized');
      setSidebarOpen(false);
      fetchCycles();
      setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'Upcoming' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Initialization failed');
    }
  };

  // Toggle Cycle Status (e.g., Activate)
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/cycles/${id}`, { status });
      toast.success(`Cycle marked as ${status}`);
      fetchCycles();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Cycle <span className="text-indigo-500">Architecture</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">
            Configure Strategic Timeframes & Guardrails
          </p>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <Plus size={16} /> New Operational Cycle
        </button>
      </header>

      {/* CYCLES DATA GRID */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Cycle Name</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeframe</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : cycles.map((cycle) => (
                <tr key={cycle._id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-6">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">{cycle.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">{cycle.description}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Calendar size={12} className="text-indigo-500" />
                      {new Date(cycle.startDate).toLocaleDateString()} — {new Date(cycle.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      cycle.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      cycle.status === 'Upcoming' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                      'bg-slate-500/10 border-slate-500/20 text-slate-400'
                    }`}>
                      {cycle.status}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-2">
                    {cycle.status !== 'Active' && (
                      <button 
                        onClick={() => handleStatusUpdate(cycle._id, 'Active')}
                        className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                        title="Activate Cycle"
                      >
                        <Zap size={14} />
                      </button>
                    )}
                    <button className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CYCLE SIDEBAR (Overlay Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60]"
            />
            <motion.aside 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-white uppercase italic">Init <span className="text-indigo-500">Cycle</span></h3>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cycle Name</label>
                  <input 
                    required type="text" placeholder="e.g., FY 2026-2027"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Date</label>
                    <input 
                      required type="date"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all text-slate-400"
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">End Date</label>
                    <input 
                      required type="date"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all text-slate-400"
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows="4" placeholder="Brief overview of the performance period..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all mt-4">
                  Deploy Operational Cycle
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple X icon replacement for Lucide
const X = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);