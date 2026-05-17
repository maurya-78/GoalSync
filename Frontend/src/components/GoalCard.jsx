import React from 'react';
import { updateGoalProgress } from '../redux/slices/goalSlice';
import { useDispatch } from 'react-redux';
import {Pencil,Trash2} from 'lucide-react';
import {deleteGoalAction} from '../redux/slices/goalSlice';

// ==========================================
// GOAL CARD COMPONENT
// ==========================================

export default function GoalCard({
  goal,
  onEdit

}) {

  const dispatch = useDispatch();

  // ==========================================
  // DELETE GOAL
  // ==========================================

  const handleDelete = () => {

    const confirmed = window.confirm(

      'Are you sure you want to delete this strategic goal?'

    );

    if (confirmed) {

      dispatch(

        deleteGoalAction(goal._id)

      );

    }

  };

  // ==========================================
  // QUARTERLY UPDATE
  // ==========================================

  const handleQuickUpdate = (

    quarter,
    value

  ) => {

    dispatch(

      updateGoalProgress({

        id: goal._id,

        updates: {

          [quarter]: {

            achievement: Number(value),

            status: 'On Track'

          }

        }

      })

    );

  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all group">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex justify-between items-start mb-6">

        {/* LEFT CONTENT */}

        <div>

          <h3 className="text-lg font-bold text-white uppercase tracking-tight">

            {goal.title}

          </h3>

          <p className="text-xs text-slate-500 mt-1">

            {goal.description}

          </p>

        </div>

        {/* RIGHT ACTIONS */}

        <div className="flex items-center gap-3">

          {/* EDIT */}

          <button

            onClick={() => onEdit(goal)}

            className="text-slate-500 hover:text-indigo-400 transition-all"

          >

            <Pencil size={18} />

          </button>

          {/* DELETE */}

          <button

            onClick={handleDelete}

            className="text-slate-500 hover:text-rose-400 transition-all"

          >

            <Trash2 size={18} />

          </button>

        </div>

      </div>

      {/* ==========================================
          WEIGHTAGE
      ========================================== */}

      <div className="mb-6">

        <div className="flex items-center justify-between">

          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">

            Strategic Weightage

          </p>

          <span className="text-xl font-black text-indigo-400">

            {goal.weightage}%

          </span>

        </div>

      </div>

      {/* ==========================================
          QUARTERLY TRACKING
      ========================================== */}

      <div className="grid grid-cols-4 gap-3">
        {['q1', 'q2', 'q3', 'q4'].map((q) => (
          <div key={q} className="bg-slate-950 p-4 rounded-2xl border border-slate-800" >
            <p className="text-[9px] font-black text-slate-600 uppercase mb-2"> {q} </p>
            <input type="number" min="0"  max="100"
              defaultValue={goal[q]?.achievement || 0}
              onBlur={(e) =>
                handleQuickUpdate(q,
                  e.target.value
                )
              }
              className="bg-transparent w-full text-sm font-bold text-white outline-none focus:text-indigo-400"
            />
          </div>
        ))}
      </div>

      {/* ==========================================
          PROGRESS BAR
      ========================================== */}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500"
              style={{
                width: `${goal.overallProgress || 0}%`
              }}
            />
          </div>
        </div>
        <span className="text-xs font-black font-mono text-slate-400">

          {goal.overallProgress || 0}%

        </span>

      </div>

    </div>

  );

}