import React from 'react';
import { Bell, Search, Workflow } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 w-72">
        <Search className="w-4 h-4 text-slate-500 mr-2" />
        <input type="text" placeholder="Search target metrics..." className="bg-transparent border-none text-xs text-slate-200 outline-none w-full" />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>
        <div className="h-8 w-px bg-slate-800" />
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg">
          <Workflow className="w-3.5 h-3.5 text-emerald-400" /> Operational Cluster Active
        </div>
      </div>
    </header>
  );
}