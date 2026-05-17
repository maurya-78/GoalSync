import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, trendColor = "text-indigo-400" }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-slate-700 transition-all shadow-md">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight mt-1">{value}</p>
        {description && <p className="text-[11px] text-slate-400 font-medium">{description}</p>}
      </div>
      <div className={`p-3 bg-slate-900 rounded-lg border border-slate-800/60 ${trendColor}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}