import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Search, UserCircle, ChevronDown } from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 w-96">
        <Search className="w-4 h-4 text-slate-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search metrics or goals..." 
          className="bg-transparent border-none text-xs text-slate-200 outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
        </button>

        <div className="h-8 w-px bg-slate-800"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{user?.name}</p>
            <p className="text-[10px] text-slate-500">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <UserCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;