import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { ShieldCheck, Cpu, Unlock, RefreshCw } from 'lucide-react';

export default function AdminHQ() {
  const [logs, setLogs] = useState([]);

  const loadAuditLogs = () => {
    axios.get('/admin/audit-logs')
      .then(res => setLogs(res.data))
      .catch(() => toast.error('Error establishing link telemetry connection to system log nodes.'));
  };

  useEffect(() => { loadAuditLogs(); }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-950 border border-indigo-800/60 rounded-xl flex items-center justify-center text-indigo-400"><Cpu className="w-5 h-5" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Enterprise Audit Log Trace Engine</h1>
            <p className="text-xs text-slate-400 mt-0.5">Administrative cryptographic trace logging across target models.</p>
          </div>
        </div>
        <button onClick={loadAuditLogs} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"><RefreshCw className="w-4 h-4" /></button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System Log Ledger Pool</span>
          <span className="text-[10px] bg-slate-950 text-indigo-400 px-2 py-0.5 rounded border border-slate-800 font-mono">Status: Stream Online</span>
        </div>
        <div className="divide-y divide-slate-900 max-h-[500px] overflow-y-auto font-mono">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-600">No transaction traces written to persistence streams.</div>
          ) : (
            logs.map(l => (
              <div key={l._id} className="p-4 hover:bg-slate-900/40 transition-all flex flex-col md:flex-row justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">[{l.action}]</span>
                    <span className="text-slate-200 font-semibold">{l.performedBy?.name || 'System Network Daemon'}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Entity Object Scope: <span className="text-slate-300 font-semibold">{l.entityType}</span> ({l.entityId})</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-500 text-[10px] block">{new Date(l.createdAt).toISOString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}