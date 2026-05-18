// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// // Layouts
// import DashboardLayout from './layouts/Dashboard'; // Note: Ensure filename matches (Dashboard.jsx)
// import AuthLayout from './layouts/AuthLayout';

// // Auth Pages
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register'; // Added for completeness

// // Feature Pages
// import UnifiedDashboard from './pages/dashboard/UnifiedDashboard';
// import StrategicGoals from './pages/employee/StrategicGoals';
// import TeamPortfolio from './pages/manager/TeamPortfolio';
// import SharedGoalDistribution from './pages/manager/SharedGoalDistribution';
// import AdminHQ from './pages/admin/AdminHQ';
// import GoalCycleManagement from './pages/admin/GoalCycleManagement';
// import DataReportsExport from './pages/admin/DataReportsExport';

// // Security Guard
// import ProtectedRoute from './routes/ProtectedRoute';

// export default function App() {
//   return (
//     <BrowserRouter>
//       {/* Global Toast Configuration */}
//       <Toaster 
//         position="top-right" 
//         toastOptions={{ 
//           style: { 
//             backgroundColor: '#020617', 
//             color: '#f8fafc', 
//             border: '1px solid #1e293b' 
//           } 
//         }} 
//       />

//       <Routes>
//         {/* ==========================================
//             PUBLIC ROUTES (Wrapped in AuthLayout)
//             ========================================== */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Route>
        
//         {/* ==========================================
//             PROTECTED ROUTES (Wrapped in DashboardLayout)
//             ========================================== */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }>
//           {/* Default Redirect */}
//           <Route index element={<Navigate to="/dashboard" replace />} />
          
//           {/* Common for All Roles */}
//           <Route path="dashboard" element={<UnifiedDashboard />} />

//           {/* Employee Focus */}
//           <Route path="goals" element={<StrategicGoals />} />

//           {/* Manager Focus (Protected for Managers/Admins) */}
//           <Route path="team" element={
//             <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
//               <TeamPortfolio />
//             </ProtectedRoute>
//           } />
//           <Route path="shared-distribution" element={
//             <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
//               <SharedGoalDistribution />
//             </ProtectedRoute>
//           } />

//           {/* Admin Focus (Strictly Protected for Admin Only) */}
//           <Route path="admin" element={
//             <ProtectedRoute allowedRoles={['Admin']}>
//               <AdminHQ />
//             </ProtectedRoute>
//           } />
//           <Route path="cycles" element={
//             <ProtectedRoute allowedRoles={['Admin']}>
//               <GoalCycleManagement />
//             </ProtectedRoute>
//           } />
//           <Route path="extract-reports" element={
//             <ProtectedRoute allowedRoles={['Admin']}>
//               <DataReportsExport />
//             </ProtectedRoute>
//           } />
//         </Route>

//         {/* ==========================================
//             FALLBACK & ERROR ROUTES
//             ========================================== */}
//         <Route path="/unauthorized" element={<div className="h-screen bg-slate-950 text-white flex items-center justify-center font-mono">403 | Unauthorized Access</div>} />
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';

const App = () => (
  <>
    <AppRouter />
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  </>
);

export default App;