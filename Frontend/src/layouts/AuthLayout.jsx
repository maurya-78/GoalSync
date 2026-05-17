import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  const { user } = useSelector((state) => state.auth);

  // Redirection: Agar user logged in hai toh use Auth pages nahi dikhne chahiye
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden">
      {/* Background Decorative Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="z-10"
      >
        <div className="flex justify-center mb-6">
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              <ShieldCheck className="w-3 h-3 text-indigo-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Identity Portal</span>
           </div>
        </div>
        
        {/* Child components (Login/Register) yahan render honge */}
        <Outlet />
      </motion.div>

      <footer className="mt-10 text-center text-slate-600 text-[10px] font-mono">
        &copy; 2026 GoalSync Systems. v1.0.4-LOCKED
      </footer>
    </div>
  );
}