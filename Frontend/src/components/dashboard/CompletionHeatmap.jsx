import React from 'react';

export default function CompletionHeatmap({ teamsData = [] }) {
  const getHeatmapColor = (value) => {
    if (value >= 90) return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
    if (value >= 70) return 'bg-indigo-500/20 border-indigo-500 text-indigo-400';
    if (value >= 40) return 'bg-amber-500/20 border-amber-500 text-amber-400';
    return 'bg-rose-500/20 border-rose-500 text-rose-400';
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cross-Department Completion Map</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">Real-time completion health categorized by organizational unit alignment thresholds.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {teamsData.map((team, idx) => (
          <div key={idx} className={`p-4 border rounded-xl flex flex-col justify-between h-24 transition-all ${getHeatmapColor(team.progress)}`}>
            <span className="text-[11px] font-bold uppercase tracking-wide truncate">{team.name}</span>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono">{team.progress}%</span>
              <span className="block text-[9px] text-slate-400 mt-0.5">{team.count} active directives</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}