import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';

// REDUX ACTIONS
import { 
  fetchGoals, 
  createGoal, 
  updateGoalProgress, 
  submitGoalSheet 
} from '../../redux/slices/goalSlice';

// COMPONENTS
import GoalCard from '../../components/GoalCard';
import GoalAnalytics from '../../components/dashboard/GoalAnalytics';

// ICONS
import {
  Plus,
  CheckCircle,
  ShieldCheck,
  Pencil,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function StrategicGoals() {
  const dispatch = useDispatch();
  
  // ==========================================
  // REDUX STATE MANAGEMENT
  // ==========================================
  const { 
    items: goals = [], 
    sheet = null,
    status = 'idle',
    totalWeightage = 0,
    isLocked = false,
    error = null 
  } = useSelector((state) => state.goals || {});

  // ==========================================
  // SAFE ERROR RENDERER (Prevents [object Error] Crash)
  // ==========================================
  const renderError = () => {
    if (!error) return null;
    
    // Extracting string message safely
    const errorMessage = typeof error === 'object' 
      ? (error.message || JSON.stringify(error)) 
      : String(error);
    
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold my-4">
        <AlertCircle size={16} />
        <span>System Error: {errorMessage}</span>
      </div>
    );
  };

  // ==========================================
  // LOCAL STATE (UI Control Only)
  // ==========================================
  const [cycleId, setCycleId] = useState('');
  const [cycles, setCycles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // FORM STATE
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weightage, setWeightage] = useState(10);
  const [target, setTarget] = useState('');

  // ==========================================
  // 1. INITIAL LOAD: OPERATIONAL CYCLES
  // ==========================================
  useEffect(() => {
    const loadCycles = async () => {
      try {
        const response = await api.get('/cycles');
        const fetchedCycles = response.data.data || response.data.cycles || [];
        setCycles(fetchedCycles);
        if (fetchedCycles.length > 0) {
          const activeCycle = fetchedCycles.find(c => c.status === 'Active') || fetchedCycles[0];
          setCycleId(activeCycle._id);
        }
      } catch (err) {
        toast.error('Unable to initialize operational cycles.');
      }
    };
    loadCycles();
  }, []);

  // ==========================================
  // 2. SYNC REDUX STORE (When Cycle Changes)
  // ==========================================
  useEffect(() => {
    if (cycleId) {
      dispatch(fetchGoals(cycleId));
    }
  }, [cycleId, dispatch]);

  // ==========================================
  // 3. FORM LOGIC
  // ==========================================
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setWeightage(10);
    setTarget('');
    setEditingGoal(null);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description);
    setWeightage(goal.weightage);
    setTarget(goal.target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleSubmitGoal = async (e) => {
    e.preventDefault();
 
    if (!sheet || !sheet._id) {
      return toast.error("Operational framework not initialized. Please wait for the matrix to sync.");
    }

    // 2. WEIGHTAGE VALIDATION
    const weightNum = Number(weightage);
    const currentTotalWithoutSelf = editingGoal 
      ? totalWeightage - editingGoal.weightage 
      : totalWeightage;

    if (currentTotalWithoutSelf + weightNum > 100) {
      return toast.error(`Weightage overflow. Capacity left: ${100 - currentTotalWithoutSelf}%`);
    }

    try {
      setSubmitting(true);
      const goalData = { title, description, weightage: weightNum, target };
      
      if (editingGoal) {
        // Update existing goal
        await dispatch(updateGoalProgress({ id: editingGoal._id, data: goalData })).unwrap();
        toast.success('Strategic vector updated.');
      } else {
        // Create new goal using safe sheet._id
        await dispatch(createGoal({ ...goalData, goalSheetId: sheet._id })).unwrap();
        toast.success('New strategic target injected.');
      }
      resetForm();
    } catch (err) {
      // Safe error message extraction
      const msg = typeof err === 'object' ? (err.message || 'Operation failed') : String(err);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSheet = async () => {
    if (totalWeightage !== 100) {
      return toast.error('Matrix must reach 100% allocation before submission.');
    }
    try {
      await dispatch(submitGoalSheet(sheet._id)).unwrap();
      toast.success('Operational Matrix locked and submitted.');
    } catch (err) {
      const msg = typeof err === 'object' ? err.message : err;
      toast.error(msg || 'Submission failed.');
    }
  };

  // ==========================================
  // 5. RENDER LOGIC (Loading State)
  // ==========================================
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse text-indigo-400 text-sm font-black uppercase tracking-[0.3em]">
          Synchronizing Enterprise Matrix...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-8 text-slate-200 space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white italic uppercase">
            Strategic <span className="text-indigo-500">Vectors</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mt-2 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Grid Status: {isLocked ? 'Immutable' : 'Active Deployment'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={cycleId}
            onChange={(e) => setCycleId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none focus:border-indigo-500"
          >
            {cycles.map(cycle => (
              <option key={cycle._id} value={cycle._id}>{cycle.name}</option>
            ))}
          </select>
          {sheet && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-2 shadow-lg">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Allocation</p>
              <p className={`text-xl font-black ${totalWeightage === 100 ? 'text-emerald-500' : 'text-indigo-400'}`}>
                {totalWeightage}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ERROR DISPLAY (Safe Call) */}
      {renderError()}

      {/* MAIN OPERATIONAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT CONTROL PANEL */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 space-y-6 backdrop-blur-md">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Framework Control</h2>

            {isLocked && (
              <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <p className="text-xs text-rose-200 leading-relaxed font-medium">
                  Matrix locked for review. Operational parameters are now immutable.
                </p>
              </div>
            )}

            {!isLocked && (
              <form onSubmit={handleSubmitGoal} className="space-y-4">
                <input
                  required type="text" placeholder="Objective Title" value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                />
                <textarea
                  required rows={3} placeholder="Strategic Description..." value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm resize-none focus:border-indigo-500 outline-none transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Weight %</label>
                    <input
                      type="number" min={10} max={100} value={weightage}
                      onChange={(e) => setWeightage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Success Metric</label>
                    <input
                      type="text" placeholder="KPI Target" value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <button
  type="submit" 
  disabled={submitting || !sheet?._id} 
  className={`w-full rounded-xl py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
    !sheet?._id 
      ? 'bg-slate-800 cursor-not-allowed text-slate-600' 
      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/10'
  }`}
>
  {submitting ? (
    <Loader2 className="animate-spin w-4 h-4" />
  ) : editingGoal ? (
    <Pencil size={14} />
  ) : (
    <Plus size={14} />
  )}
  {editingGoal ? 'Update Target' : 'Inject Strategic Goal'}
</button>
              </form>
            )}

            {sheet?.status === 'Draft' && totalWeightage === 100 && !isLocked && (
              <button
                onClick={handleSubmitSheet}
                className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle size={14} /> Finalize Operational Matrix
              </button>
            )}
          </div>
        </div>

        {/* RIGHT DATA PANEL */}
        <div className="lg:col-span-2 space-y-6">
          {goals.length === 0 ? (
            <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center">
              <h2 className="text-xl font-black text-slate-400 uppercase italic">Grid Inactive</h2>
              <p className="text-xs text-slate-600 mt-4 font-bold uppercase tracking-widest">
                No strategic vectors detected in current cycle.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {goals.map(goal => (
                <GoalCard key={goal._id} goal={goal} onEdit={handleEditGoal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ANALYTICS */}
      <div className="pt-8 border-t border-slate-900">
        {/* Pass as array to be extra safe */}
        {Array.isArray(goals) && <GoalAnalytics goals={goals} />}
      </div>

    </div>
  );
}