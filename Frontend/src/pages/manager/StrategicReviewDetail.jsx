import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import InlineEditField from '../../components/forms/InlineEditField';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

export default function StrategicReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState(null);
  const [goals, setGoals] = useState([]);
  const [feedback, setFeedback] = useState('');

  const loadSheetDetails = () => {
    setLoading(true);
    axios.get(`/management/dashboard`)
      .then(res => {
        const foundSheet = res.data.sheets.find(s => s._id === id);
        if (foundSheet) {
          setSheet(foundSheet);
          return axios.get(`/goals/sheet?cycleId=${foundSheet.cycle}`);
        }
        throw new Error('Target framework sheet index out of bounds.');
      })
      .then(res => {
        if (res) setGoals(res.data.goals);
      })
      .catch((err) => toast.error(err.message || 'Error tracking strategic context mapping.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSheetDetails(); }, [id]);

  const handleInlineGoalSave = (goalId, field, updatedValue) => {
    axios.put(`/goals/${goalId}`, { [field]: updatedValue })
      .then(() => {
        toast.success('Strategy variable updated in live matrix grid.');
        loadSheetDetails();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Mutation validation block.'));
  };

  const executeDecision = (action) => {
    axios.put(`/management/review/${id}`, { action, managerComments: feedback })
      .then(() => {
        toast.success(`Strategic matrix resolution recorded as: ${action}`);
        navigate('/team');
      })
      .catch(() => toast.error('Error recording strategy decision state.'));
  };

  if (loading) return <LoadingSkeleton rows={5} />;
  if (!sheet) return <div className="text-xs text-rose-400">Strategic schema trace lost.</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/team')} className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reviewing: {sheet.employee?.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Aggregated Framework Allocations: <span className="text-indigo-400 font-mono font-bold">{sheet.totalWeightage}%</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          {goals.map(g => (
            <div key={g._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{g.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{g.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-900/60 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Weightage Allocation</span>
                  <InlineEditField type="number" min={10} max={100} value={g.weightage} onSave={(val) => handleInlineGoalSave(g._id, 'weightage', val)} label="Weightage" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Target Operational Bounds</span>
                  <InlineEditField type="text" value={g.target} onSave={(val) => handleInlineGoalSave(g._id, 'target', val)} label="Target Metric" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Calculated Achievement</span>
                  <span className="font-bold font-mono text-emerald-400 block mt-1">{g.overallProgress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3">Review Action Hub</h3>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Strategic Alignment Feedback Directive</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              placeholder="Provide constructive context or technical baseline optimization requirements..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => executeDecision('Reject')} className="w-full bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 border border-rose-900/50 rounded-xl py-2.5 text-xs font-bold transition-all">
              Reject Framework
            </button>
            <button onClick={() => executeDecision('Approve')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-lg shadow-indigo-600/10">
              Approve & Lock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}