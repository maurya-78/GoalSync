import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import api from '../../services/api';

// 1. Validation Schema using Zod
const registerSchema = zod.object({
  name: zod.string().min(2, { message: 'Full name is required.' }),
  email: zod.string().email({ message: 'Please enter a valid corporate email.' }),
  password: zod.string().min(6, { message: 'Security cryptokey must be at least 6 characters.' }),
  role: zod.enum(['Employee', 'Manager', 'Admin'], { message: 'Please select a valid role.' })
});

export default function Register() {
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Employee' }
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      await api.post('/auth/register', data);
      toast.success('Identity Created. Please login to authorize.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Identity creation failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="w-7 h-7 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Create Identity</h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-semibold">Join GoalSync Operational Grid</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  {...register('name')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" 
                  placeholder="Rahul Verma" 
                />
              </div>
              {errors.name && <p className="text-rose-500 text-[9px] font-bold ml-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email" 
                  {...register('email')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" 
                  placeholder="rahul@company.com" 
                />
              </div>
              {errors.email && <p className="text-rose-500 text-[9px] font-bold ml-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Cryptokey</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="password" 
                  {...register('password')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" 
                  placeholder="••••••••" 
                />
              </div>
              {errors.password && <p className="text-rose-500 text-[9px] font-bold ml-1">{errors.password.message}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">System Role</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <select 
                  {...register('role')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-4">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-4 px-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Create System Identity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </motion.button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-xs text-slate-500">
              Already possess an identity? {' '}
              <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Authorize Here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}