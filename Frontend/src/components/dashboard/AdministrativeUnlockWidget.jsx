import React, { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Unlock, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdministrativeUnlockWidget({ sheetId, onActionComplete }) {
  const [processing, setProcessing] = useState(false);

  const requestExplicitOverrideUnlock = () => {
    if (!window.confirm("CONFIRM COMMAND: Force override explicit framework state locks? User data will revert back into editable formulation loops.")) return;
    
    setProcessing(true);
    axios.put(`/admin/unlock/${sheetId}`)
      .then(() => {
        toast.success('State constraint override processing verified. Matrix target set back into formulation loop.');
        if (onActionComplete) onActionComplete();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Administrative path error.'))
      .finally(() => setProcessing(false));
  };

  return (
    <div className="bg-rose-950/10 border border-rose-900/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h5 className="text-xs font-bold text-rose-400 font-mono">System Integrity Override</h5>
          <p className="text-[10px] text-slate-400 leading-normal max-w-md">Bypass active model protections to modify targets. This action writes a state change trace directly into the system audit logs.</p>
        </div>
      </div>
      <button
        onClick={requestExplicitOverrideUnlock}
        disabled={processing}
        className="bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-800/60 hover:border-rose-500 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-40"
      >
        {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />} Force Unlock Frame
      </button>
    </div>
  );
}