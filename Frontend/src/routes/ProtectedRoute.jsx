import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-mono">Verifying Credentials...</div>;
  }

  // 1. Agar user logged in nahi hai
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Agar user ke paas required role nahi hai (e.g. Employee trying to access Admin HQ)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;