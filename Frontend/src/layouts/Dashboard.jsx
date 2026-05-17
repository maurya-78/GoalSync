import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Path adjusted to your 'components/common' folder
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Security Gate: Agar user logged in nahi hai, toh login portal par redirect karein
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR (Fixed) */}
      <Sidebar />

      {/* 2. MAIN WORKSPACE (Flex-column to stack Navbar and Content) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 3. TOP NAVIGATION BAR */}
        <Navbar />

        {/* 4. DYNAMIC VIEWPORT (Where pages are rendered) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            {/* Framer Motion ya basic transitions ke liye transition wrapper yahan de sakte hain */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Optional: Mobile Overlay if Sidebar is open on small screens */}
      {/* <div className="md:hidden fixed inset-0 bg-black/50 z-20 hidden"></div> */}
    </div>
  );
};

export default Dashboard;