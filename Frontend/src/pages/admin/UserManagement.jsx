import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { UserPlus, Shield, Mail, Briefcase, Trash2 } from 'lucide-react';
import ReusableTable from '../../components/tables/ReusableTable';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchUsers = () => {
    // Collect corporate employee directory
    axios.get('/management/dashboard')
      .then(res => setUsers(res.data.teamMembers || []))
      .catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const onCreateUser = (data) => {
    axios.post('/auth/register', data)
      .then(() => {
        toast.success('Corporate security profile added to IAM database.');
        reset();
        fetchUsers();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Identity schema validation failure.'));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">IAM Corporate Identity Control</h1>
        <p className="text-xs text-slate-400 mt-1">Provision corporate profiles, set authorization boundaries, and establish reporting structures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-400" /> Provision Profile
          </h3>
          <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Corporate Name</label>
              <input type="text" {...register('name', { required: true })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Corporate Routing Email</label>
              <input type="email" {...register('email', { required: true })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="jane.d@goalsync.corp" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Temporary Cryptokey</label>
              <input type="password" {...register('password', { required: true })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Authorization Role Boundary</label>
              <select {...register('role', { required: true })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                <option value="Employee">Employee (Strategic Core)</option>
                <option value="Manager">Manager (Review Cluster)</option>
                <option value="Admin">Admin (System Overlord)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
              Provision Profile
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <ReusableTable
            headers={['Identity Member', 'Email Vector', 'Clearance Level', 'Operational Status']}
            data={users}
            renderRow={(u) => (
              <tr key={u._id} className="hover:bg-slate-900/30 transition-all">
                <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {u.name}
                </td>
                <td className="px-6 py-4 font-mono text-slate-400">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    u.role === 'Admin' ? 'bg-rose-950/40 border-rose-800 text-rose-400' :
                    u.role === 'Manager' ? 'bg-amber-950/40 border-amber-800 text-amber-400' :
                    'bg-indigo-950/40 border-indigo-800 text-indigo-400'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
                  <span className="text-[11px] text-slate-400 font-medium">Active Session Route</span>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );
}