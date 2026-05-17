import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { LayoutDashboard, Target, Users, ShieldAlert, UserCheck, Calendar, Download, Share2, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 p-4 z-50">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white tracking-wider text-sm">GS</div>
          <span className="text-xl font-bold tracking-tight text-white font-mono">GoalSync</span>
        </div>
        
        <nav className="space-y-1">
          <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider px-3 mb-1">Main Console</span>
          <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
            <LayoutDashboard className="w-3.5 h-3.5" /> Analytics Dashboard
          </NavLink>
          <NavLink to="/goals" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
            <Target className="w-3.5 h-3.5" /> Strategic Objectives
          </NavLink>

          {(user?.role === 'Manager' || user?.role === 'Admin') && (
            <>
              <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider px-3 pt-4 mb-1">Management Node</span>
              <NavLink to="/team" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <Users className="w-3.5 h-3.5" /> Team Portfolios
              </NavLink>
              <NavLink to="/shared-distribution" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <Share2 className="w-3.5 h-3.5" /> Cascade Metrics
              </NavLink>
            </>
          )}

          {user?.role === 'Admin' && (
            <>
              <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider px-3 pt-4 mb-1">Administrative Control</span>
              <NavLink to="/admin" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <ShieldAlert className="w-3.5 h-3.5" /> System Audit Streams
              </NavLink>
              <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <UserCheck className="w-3.5 h-3.5" /> Identity & IAM Profiles
              </NavLink>
              <NavLink to="/admin/cycles" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <Calendar className="w-3.5 h-3.5" /> Temporal Cycles
              </NavLink>
            </>
          )}

          <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider px-3 pt-4 mb-1">Data Processing</span>
          <NavLink to="/extract-reports" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
            <Download className="w-3.5 h-3.5" /> Extract Ledgers
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <div className="px-3 py-2 mb-2 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active Credentials</p>
          <p className="text-xs font-bold text-slate-200 truncate mt-0.5">{user?.name}</p>
          <span className="inline-block mt-1 text-[9px] bg-slate-800 border border-slate-700 text-indigo-400 font-bold px-2 py-0.5 rounded-md font-mono">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-all">
          <LogOut className="w-3.5 h-3.5" /> Exit Session
        </button>
      </div>
    </aside>
  );
}