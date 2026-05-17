import React from 'react';

import {
  Target,
  TrendingUp,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export default function GoalTable({

  goals = []

}) {

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusColor = (status) => {

    switch (status) {

      case 'Completed':
        return 'bg-emerald-500';

      case 'On Track':
        return 'bg-indigo-500';

      case 'Delayed':
        return 'bg-amber-500';

      default:
        return 'bg-slate-700';

    }

  };

  // ==========================================
  // PROGRESS COLOR
  // ==========================================

  const getProgressColor = (progress) => {

    if (progress >= 100)
      return 'bg-emerald-500';

    if (progress >= 60)
      return 'bg-indigo-500';

    return 'bg-amber-500';

  };

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (goals.length === 0) {

    return (

      <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-20 text-center">

        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">

            <Target className="w-10 h-10 text-indigo-400" />

          </div>

        </div>

        <h2 className="text-2xl font-black text-white">

          No Strategic Goals

        </h2>

        <p className="text-slate-500 mt-3">

          Initialize operational vectors to populate analytics.

        </p>

      </div>

    );

  }

  // ==========================================
  // MAIN TABLE
  // ==========================================

  return (

    <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1000px] text-left">

          {/* ==========================================
              TABLE HEAD
          ========================================== */}

          <thead className="bg-slate-950/60 border-b border-slate-800">

            <tr>

              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">

                Strategic Target

              </th>

              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">

                Target KPI

              </th>

              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">

                Weight

              </th>

              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">

                Quarterly Status

              </th>

              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">

                Efficiency

              </th>

            </tr>

          </thead>

          {/* ==========================================
              TABLE BODY
          ========================================== */}

          <tbody className="divide-y divide-slate-800/50">

            {goals.map((goal) => (

              <tr

                key={goal._id}

                className="hover:bg-slate-800/20 transition-all duration-200"

              >

                {/* ==========================================
                    TITLE
                ========================================== */}

                <td className="p-6">

                  <div className="space-y-2">

                    <div className="flex items-center gap-3">

                      <p className="font-black text-white text-sm">

                        {goal.title}

                      </p>

                      {goal.isHighImpact && (

                        <span className="text-[9px] uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-full font-black">

                          High Impact

                        </span>

                      )}

                    </div>

                    <p className="text-xs text-slate-500 max-w-md leading-relaxed">

                      {goal.description}

                    </p>

                  </div>

                </td>

                {/* ==========================================
                    TARGET
                ========================================== */}

                <td className="p-6">

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-300">

                    <TrendingUp className="w-4 h-4 text-indigo-400" />

                    {goal.target}

                  </div>

                </td>

                {/* ==========================================
                    WEIGHTAGE
                ========================================== */}

                <td className="p-6">

                  <div className="flex items-center gap-2">

                    <ShieldCheck className="w-4 h-4 text-indigo-400" />

                    <span className="font-mono text-indigo-400 text-sm font-black">

                      {goal.weightage}%

                    </span>

                  </div>

                </td>

                {/* ==========================================
                    QUARTERS
                ========================================== */}

                <td className="p-6">

                  <div className="flex items-center gap-3">

                    {['q1', 'q2', 'q3', 'q4'].map((q, index) => (

                      <div
                        key={index}
                        className="flex flex-col items-center gap-2"
                      >

                        <div

                          className={`w-3 h-3 rounded-full ${getStatusColor(

                            goal[q]?.status

                          )}`}

                        />

                        <span className="text-[9px] text-slate-600 uppercase font-black">

                          {q}

                        </span>

                      </div>

                    ))}

                  </div>

                </td>

                {/* ==========================================
                    PROGRESS
                ========================================== */}

                <td className="p-6">

                  <div className="space-y-2 min-w-[140px]">

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-black text-white">

                        {goal.overallProgress}%

                      </span>

                      {goal.overallProgress < 40 && (

                        <AlertTriangle className="w-3 h-3 text-amber-400" />

                      )}

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div

                        className={`h-full ${getProgressColor(

                          goal.overallProgress

                        )} transition-all duration-500`}

                        style={{
                          width: `${goal.overallProgress}%`
                        }}

                      />

                    </div>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}