import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { UserCheck, MessageSquare, Check, X, ShieldAlert } from 'lucide-react';

export default function TeamPortfolio() {
  const [data, setData] = useState(null);
  const [comments, setComments] = useState({});

  const loadTeamData = () => {
    axios.get('/management/dashboard')
      .then(res => setData(res.data))
      .catch(() => toast.error('Error fetching structural operational alignment portfolio dependencies.'));
  };

  useEffect(() => { loadTeamData(); }, []);

  const handleProcessReview = (sheetId, action) => {
    axios.put(`/management/review/${sheetId}`, {
      action,
      managerComments: comments[sheetId] || 'Corporate strategy alignment structural evaluation verified.'
    })
    .then(() => {
      toast.success(`Operational matrix ${action === 'Approve' ? 'authorized' : 'returned to formulation draft'}.`);
      loadTeamData();
    })
    .catch(() => toast.error('Review submission fault.'));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Team Portfolio Strategy Control</h1>
        <p className="text-xs text-slate-400 mt-1">Audit, process exceptions, adjust weights, and sign off on active subordinate directives.</p>
      </div>

      {!data ? (
        <div className="text-xs text-slate-500">Awaiting secure pipeline deployment arrays...</div>
      ) : (
        <div className="space-y-6">
          {data.sheets.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">No organizational performance frameworks staged for authorization.</div>
          ) : (
            data.sheets.map(s => (
              <div key={s._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><UserCheck className="w-4 h-4 text-indigo-400" /> {s.employee?.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.employee?.email} • Aggregate Matrix Alloc: <span className="text-indigo-400 font-bold">{s.totalWeightage}%</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-md font-mono">{s.status}</span>
                  </div>
                </div>

                {s.status === 'Pending Approval' && (
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/60 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium"><MessageSquare className="w-4 h-4 text-slate-500" /> Administrative Adjustment Feedback Trace</div>
                    <input type="text" placeholder="Add alignment instructions or feedback comments..." value={comments[s._id] || ''} onChange={(e) => setComments({...comments, [s._id]: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" />
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => handleProcessReview(s._id, 'Reject')} className="bg-slate-950 hover:bg-rose-950/30 text-rose-400 border border-rose-900/50 hover:border-rose-500 font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Reject & Return to Formulation</button>
                      <button onClick={() => handleProcessReview(s._id, 'Approve')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/10"><Check className="w-3.5 h-3.5" /> Authorize & Lock Framework</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}