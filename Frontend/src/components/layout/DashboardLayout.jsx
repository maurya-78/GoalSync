// ==========================================
// FILE: src/layouts/DashboardLayout.jsx
// ==========================================

import React from 'react';

import {

  Outlet,
  Navigate

} from 'react-router-dom';

import { useSelector } from 'react-redux';

// ==========================================
// COMPONENT IMPORTS
// ==========================================

import Sidebar from '../components/layout/Sidebar';

import Navbar from '../components/layout/Navbar';

// ==========================================
// DASHBOARD LAYOUT
// ==========================================

const DashboardLayout = () => {

  // ==========================================
  // AUTH STATE
  // ==========================================

  const {

    user

  } = useSelector(

    (state) => state.auth

  );

  // ==========================================
  // PROTECTED ACCESS
  // ==========================================

  if (!user) {

    return (

      <Navigate

        to="/login"

        replace

      />

    );

  }

  // ==========================================
  // MAIN LAYOUT
  // ==========================================

  return (

    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <Sidebar />

      {/* ==========================================
          MAIN CONTENT SECTION
      ========================================== */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* ==========================================
            TOP NAVBAR
        ========================================== */}

        <Navbar />

        {/* ==========================================
            PAGE CONTENT
        ========================================== */}

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">

          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">

            {/* ==========================================
                ROUTE CONTENT
            ========================================== */}

            <Outlet />

          </div>

        </main>

      </div>

    </div>

  );

};

export default DashboardLayout;