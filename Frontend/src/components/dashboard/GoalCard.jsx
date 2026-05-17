import React, {
  useState
} from 'react';

import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  Percent,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

import {
  updateGoalAction
} from '../../redux/slices/goalSlice';

import toast from 'react-hot-toast';

export default function GoalCard({ goal }) {

  const dispatch = useDispatch();

  const { isLocked } = useSelector(
    state => state.goals
  );

  const [loadingQuarter, setLoadingQuarter] =
    useState(null);

  // ==========================================
  // QUICK QUARTER UPDATE
  // ==========================================

  const handleQuickUpdate = async (
    quarter,
    achievement,
    status = 'On Track'
  ) => {

    try {

      setLoadingQuarter(quarter);

      await dispatch(

        updateGoalAction({

          id: goal._id,

          data: {

            [quarter]: {

              achievement: Number(
                achievement
              ),

              status

            }

          }

        })

      ).unwrap();

      toast.success(
        `${quarter.toUpperCase()} updated`
      );

    } catch (error) {

      toast.error(
        error || 'Telemetry sync failed.'
      );

    } finally {

      setLoadingQuarter(null);

    }

  };

  // ==========================================
  // PROGRESS COLOR
  // ==========================================

  const getProgressColor = () => {

    if (goal.overallProgress >= 100)
      return 'bg-emerald-500';

    if (goal.overallProgress >= 60)
      return 'bg-indigo-500';

    return 'bg-amber-500';

  };

  return (

    <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-lg">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex justify-between items-start gap-4 mb-6">

        <div>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">

            {goal.title}

          </h3>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed">

            {goal.description}

          </p>

        </div>

        {/* Weightage */}

        <div className="text-right">

          <span className="text-3xl font-black italic text-indigo-500">

            {goal.weightage}%

          </span>

          <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">

            Weight

          </p>

        </div>

      </div>

      {/* ==========================================
          META
      ========================================== */}

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">

          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">

            Target

          </p>

          <p className="mt-2 text-sm font-bold text-slate-200 flex items-center gap-2">

            <TrendingUp className="w-4 h-4 text-indigo-400" />

            {goal.target}

          </p>

        </div>

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">

          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">

            Overall Progress

          </p>

          <p className="mt-2 text-sm font-black text-emerald-400 flex items-center gap-2">

            <Percent className="w-4 h-4" />

            {goal.overallProgress}%

          </p>

        </div>

      </div>

      {/* ==========================================
          QUARTERS
      ========================================== */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        {['q1', 'q2', 'q3', 'q4'].map((q) => (

          <div

            key={q}

            className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3"

          >

            {/* Quarter Label */}

            <div className="flex items-center justify-between">

              <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">

                {q.toUpperCase()}

              </p>

              {goal[q]?.status === 'Delayed' && (

                <AlertTriangle className="w-3 h-3 text-amber-400" />

              )}

            </div>

            {/* Achievement */}

            <input

              type="number"

              min={0}

              max={100}

              disabled={
                isLocked ||
                loadingQuarter === q
              }

              defaultValue={
                goal[q]?.achievement || 0
              }

              onBlur={(e) =>

                handleQuickUpdate(

                  q,

                  e.target.value,

                  goal[q]?.status ||

                  'On Track'

                )

              }

              className="bg-transparent w-full text-xl font-black text-white outline-none focus:text-indigo-400 disabled:opacity-50"

            />

            {/* Status */}

            <select

              disabled={
                isLocked ||
                loadingQuarter === q
              }

              value={
                goal[q]?.status ||

                'Not Started'
              }

              onChange={(e) =>

                handleQuickUpdate(

                  q,

                  goal[q]?.achievement || 0,

                  e.target.value

                )

              }

              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"

            >

              <option>
                Not Started
              </option>

              <option>
                On Track
              </option>

              <option>
                Delayed
              </option>

              <option>
                Completed
              </option>

            </select>

          </div>

        ))}

      </div>

      {/* ==========================================
          PROGRESS BAR
      ========================================== */}

      <div className="mt-6">

        <div className="flex items-center justify-between text-xs mb-2">

          <span className="text-slate-500 uppercase tracking-wider font-bold">

            Completion Matrix

          </span>

          <span className="font-black text-slate-400">

            {goal.overallProgress}%

          </span>

        </div>

        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">

          <div

            className={`h-full ${getProgressColor()} transition-all duration-700`}

            style={{
              width: `${goal.overallProgress}%`
            }}

          />

        </div>

      </div>

    </div>

  );

}