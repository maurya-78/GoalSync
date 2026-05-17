import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, Target, Users, ShieldAlert, 
  Settings, LogOut, Share2, ClipboardList 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Employee'] },
    { name: 'My Goals', path: '/goals', icon: Target, roles: ['Employee'] },
    { name: 'Shared Goals', path: '/shared-distribution', icon: Share2, roles: ['Manager', 'Admin'] },
    { name: 'Team Portfolio', path: '/team', icon: Users, roles: ['Manager', 'Admin'] },
    { name: 'Audit Logs', path: '/admin', icon: ClipboardList, roles: ['Admin'] },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-900">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">GS</div>
        <span className="text-xl font-bold text-white font-mono tracking-tight">GoalSync</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          item.roles.includes(user?.role) && (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Active Role</p>
          <span className="text-xs font-semibold text-indigo-400 font-mono">{user?.role}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;