// ==========================================
// FILE: Frontend/src/pages/employee/StrategicGoals.jsx
// ==========================================

import React, {

  useEffect,
  useState

} from 'react';

import api from '../../services/api';

import toast from 'react-hot-toast';

// COMPONENTS
import GoalCard from '../../components/GoalCard';

import GoalAnalytics from '../../components/dashboard/GoalAnalytics';

// ICONS
import {

  Plus,
  CheckCircle,
  ShieldCheck,
  Pencil

} from 'lucide-react';

// ==========================================
// STRATEGIC GOALS PAGE
// ==========================================

export default function StrategicGoals() {

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  const [cycleId, setCycleId] = useState('');
  const [cycles, setCycles] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // ==========================================
  // FORM STATE
  // ==========================================

  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');

  const [weightage, setWeightage] = useState(10);

  const [target, setTarget] = useState('');

  // ==========================================
  // LOAD CYCLES
  // ==========================================

  useEffect(() => {

    const loadCycles = async () => {

      try {

        const response = await api.get('/cycles');

        const fetchedCycles = response.data.cycles || [];

        setCycles(fetchedCycles);

        // ======================================
        // AUTO SELECT FIRST CYCLE
        // ======================================

        if (fetchedCycles.length > 0) {

          setCycleId(

            fetchedCycles[0]._id

          );

        }

      } catch (error) {

        toast.error(

          'Unable to initialize operational cycles.'

        );

      }

    };

    loadCycles();

  }, []);

  // ==========================================
  // LOAD GOALSHEET
  // ==========================================

  const loadGoalSheet = async () => {

    if (!cycleId) return;

    try {

      setLoading(true);

      const response = await api.get(

        `/goals/sheet?cycleId=${cycleId}`

      );

      setSheet(

        response.data.sheet

      );

      setGoals(

        response.data.goals || []

      );

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        'Strategic framework synchronization failed.'

      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // RELOAD WHEN CYCLE CHANGES
  // ==========================================

  useEffect(() => {

    loadGoalSheet();

  }, [cycleId]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {

    setTitle('');

    setDescription('');

    setWeightage(10);

    setTarget('');

    setEditingGoal(null);

  };

  // ==========================================
  // EDIT GOAL
  // ==========================================

  const handleEditGoal = (goal) => {

    setEditingGoal(goal);

    setTitle(goal.title);

    setDescription(goal.description);

    setWeightage(goal.weightage);

    setTarget(goal.target);

    // ======================================
    // SCROLL TO FORM
    // ======================================

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  };

  // ==========================================
  // CREATE / UPDATE GOAL
  // ==========================================

  const handleSubmitGoal = async (e) => {

    e.preventDefault();

    try {

      setSubmitting(true);

      // ======================================
      // UPDATE EXISTING GOAL
      // ======================================

      if (editingGoal) {

        await api.put(

          `/goals/${editingGoal._id}`,

          {

            title,

            description,

            weightage: Number(weightage),

            target

          }

        );

        toast.success(

          'Strategic goal updated successfully.'

        );

      }

      // ======================================
      // CREATE NEW GOAL
      // ======================================

      else {

        await api.post(

          '/goals',

          {

            goalSheetId: sheet._id,

            title,

            description,

            weightage: Number(weightage),

            target

          }

        );

        toast.success(

          'Strategic goal created successfully.'

        );

      }

      // ======================================
      // RESET FORM
      // ======================================

      resetForm();

      // ======================================
      // RELOAD DATA
      // ======================================

      loadGoalSheet();

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        'Goal operation failed.'

      );

    } finally {

      setSubmitting(false);

    }

  };

  // ==========================================
  // SUBMIT GOALSHEET
  // ==========================================

  const handleSubmitSheet = async () => {

    try {

      await api.put(

        `/goals/sheet/submit/${sheet._id}`

      );

      toast.success(

        'GoalSheet submitted successfully.'

      );

      loadGoalSheet();

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        'GoalSheet submission failed.'

      );

    }

  };

  // ==========================================
  // LOADING UI
  // ==========================================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <div className="animate-pulse text-indigo-400 text-xl font-bold">

          Synchronizing Enterprise Matrix...

        </div>

      </div>

    );

  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="min-h-screen bg-slate-950 p-6 lg:p-8 text-slate-200 space-y-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* LEFT */}

        <div>

          <h1 className="text-4xl font-black tracking-tight text-white">

            Strategic

            <span className="text-indigo-500">

              {' '}Vectors

            </span>

          </h1>

          <p className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center gap-2">

            <ShieldCheck className="w-3 h-3 text-emerald-500" />

            Enterprise Operational Matrix

          </p>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* CYCLE SELECT */}

          <select

            value={cycleId}

            onChange={(e) =>

              setCycleId(

                e.target.value

              )

            }

            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm"

          >

            {cycles.map(cycle => (

              <option

                key={cycle._id}

                value={cycle._id}

              >

                {cycle.name}

              </option>

            ))}

          </select>

          {/* TOTAL WEIGHTAGE */}

          {sheet && (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3">

              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">

                Total Allocation

              </p>

              <p className="text-2xl font-black text-indigo-400">

                {sheet.totalWeightage}%

              </p>

            </div>

          )}

        </div>

      </div>

      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ======================================
            LEFT PANEL
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 h-fit">

          {/* PANEL HEADER */}

          <div className="flex justify-between items-center">

            <h2 className="text-sm font-bold uppercase text-slate-400">

              Framework Control

            </h2>

            <span className="text-xs text-indigo-400">

              {sheet?.status}

            </span>

          </div>

          {/* LOCK WARNING */}

          {sheet?.isLocked && (

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-sm text-rose-400">

              This GoalSheet is locked by management review.

            </div>

          )}

          {/* GOAL FORM */}

          {!sheet?.isLocked && (

            <form

              onSubmit={handleSubmitGoal}

              className="space-y-4"

            >

              {/* TITLE */}

              <input

                type="text"

                placeholder="Goal Title"

                value={title}

                onChange={(e) =>

                  setTitle(

                    e.target.value

                  )

                }

                required

                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"

              />

              {/* DESCRIPTION */}

              <textarea

                rows={4}

                placeholder="Goal Description"

                value={description}

                onChange={(e) =>

                  setDescription(

                    e.target.value

                  )

                }

                required

                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 resize-none"

              />

              {/* GRID */}

              <div className="grid grid-cols-2 gap-4">

                {/* WEIGHTAGE */}

                <input

                  type="number"

                  min={10}

                  max={100}

                  value={weightage}

                  onChange={(e) =>

                    setWeightage(

                      e.target.value

                    )

                  }

                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"

                />

                {/* TARGET */}

                <input
                  type="text"
                  placeholder="Target"
                  value={target}
                  onChange={(e) =>
                    setTarget(
                      e.target.value )}
className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"/>
              </div>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all"
              >
                {editingGoal ? (

                  <>

                    <Pencil className="w-4 h-4" />

                    Update Goal

                  </>

                ) : (

                  <>

                    <Plus className="w-4 h-4" />

                    Add Strategic Goal

                  </>

                )}

              </button>

            </form>

          )}

          {/* SUBMIT SHEET */}
          {sheet?.status === 'Draft' &&
            sheet?.totalWeightage === 100 &&
            !sheet?.isLocked && (
            <button
              onClick={handleSubmitSheet}
              className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Submit GoalSheet
            </button>

          )}

        </div>

        {/* ======================================
            GOALS SECTION
        ====================================== */}

        <div className="lg:col-span-2 space-y-5">
          {goals.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
              <h2 className="text-2xl font-bold text-white">
                No Strategic Goals Found
              </h2>
              <p className="text-slate-500 mt-3">
                Create your first strategic goal to initialize enterprise tracking.
              </p>
            </div>
          ) : (
            goals.map(goal => (
              <GoalCard key={goal._id} goal={goal}  onEdit={handleEditGoal} />
            ))
          )}
        </div>
      </div>

      {/* ======================================
          ANALYTICS
      ====================================== */}

      <GoalAnalytics goals={goals} />
    </div>
  );
}