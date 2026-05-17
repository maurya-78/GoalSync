import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { useDispatch, useSelector } from 'react-redux';
import { executeLogin } from '../../redux/slices/authSlice';

import {
  useNavigate,
  Navigate,
  Link
} from 'react-router-dom';

import toast from 'react-hot-toast';

import { motion } from 'framer-motion';

import {
  ShieldCheck,
  Loader2,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';

// Validation Schema
const loginSchema = zod.object({
  email: zod
    .string()
    .email({
      message: 'Please enter a valid corporate email.'
    }),

  password: zod
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters.'
    })
});

export default function Login() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user, loading } = useSelector(
    state => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Redirect if logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Submit Handler
  const onSubmit = async (data) => {

    const result = await dispatch(
      executeLogin(data)
    );

    if (executeLogin.fulfilled.match(result)) {

      toast.success(
        'Access Granted. Initializing Session...'
      );

      navigate('/dashboard');

    } else {

      toast.error(
        result.payload || 'Authentication Failed.'
      );

    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 mb-4"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
              GoalSync Portal
            </h1>

            <p className="text-xs text-slate-500 mt-2 uppercase tracking-[0.2em] font-semibold">
              Enterprise Identity Safeguard
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {/* Email */}
            <div className="space-y-2">

              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Corporate Email
              </label>

              <div className="relative group">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">

                  <Mail className="w-4 h-4" />

                </div>

                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="name@company.com"
                />

              </div>

              {errors.email && (

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-500 text-[10px] font-semibold ml-1"
                >
                  {errors.email.message}
                </motion.p>

              )}

            </div>

            {/* Password */}
            <div className="space-y-2">

              <div className="flex justify-between items-center px-1">

                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  System Cryptokey
                </label>

                <button
                  type="button"
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase"
                >
                  Forgot?
                </button>

              </div>

              <div className="relative group">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">

                  <Lock className="w-4 h-4" />

                </div>

                <input
                  type="password"
                  {...register('password')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />

              </div>

              {errors.password && (

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-500 text-[10px] font-semibold ml-1"
                >
                  {errors.password.message}
                </motion.p>

              )}

            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-4 px-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >

              {loading ? (

                <Loader2 className="w-5 h-5 animate-spin" />

              ) : (

                <>
                  Authorize Identity

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>

              )}

            </motion.button>

          </form>

          {/* Register Option */}
          <div className="text-center mt-6">

            <p className="text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Register
              </Link>

            </p>

          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">

            <p className="text-[10px] text-slate-600 font-medium">

              &copy; 2026 GoalSync Enterprise. All Rights Reserved.

            </p>

          </div>

        </div>

      </motion.div>

    </div>
  );
}