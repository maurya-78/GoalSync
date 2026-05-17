import React from 'react';

import {

  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell

} from 'recharts';

// ==========================================
// GOAL ANALYTICS COMPONENT
// ==========================================

export default function GoalAnalytics({

  goals = []

}) {

  // ==========================================
  // BAR CHART DATA
  // ==========================================

  const progressData = goals.map(goal => ({

    name:

      goal.title.length > 10

        ? goal.title.substring(0, 10) + '...'

        : goal.title,

    progress:

      goal.overallProgress || 0,

    weightage:

      goal.weightage || 0

  }));

  // ==========================================
  // PIE CHART DATA
  // ==========================================

  const completionData = [

    {

      name: 'Completed',

      value:

        goals.filter(

          g => g.overallProgress >= 100

        ).length

    },

    {

      name: 'In Progress',

      value:

        goals.filter(

          g =>

            g.overallProgress > 0 &&

            g.overallProgress < 100

        ).length

    },

    {

      name: 'Pending',

      value:

        goals.filter(

          g => g.overallProgress === 0

        ).length

    }

  ];

  // ==========================================
  // COLORS
  // ==========================================

  const COLORS = [

    '#10b981',
    '#6366f1',
    '#475569'

  ];

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!goals.length) {

    return (

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">

        <h2 className="text-white text-xl font-bold">

          No Analytics Available

        </h2>

        <p className="text-slate-500 mt-2">

          Create goals to visualize analytics.

        </p>

      </div>

    );

  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* ==========================================
          BAR CHART
      ========================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[400px]">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-white">

            Goal Progress Analytics

          </h2>

          <p className="text-sm text-slate-500 mt-1">

            Real-time operational performance tracking

          </p>

        </div>

        <div className="w-full h-[300px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={progressData}>

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
              />

              <YAxis stroke="#94a3b8" />

              <Tooltip />

              <Bar
                dataKey="progress"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ==========================================
          PIE CHART
      ========================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[400px]">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-white">

            Goal Distribution

          </h2>

          <p className="text-sm text-slate-500 mt-1">

            Strategic execution overview

          </p>

        </div>

        <div className="w-full h-[300px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie

                data={completionData}

                dataKey="value"
                outerRadius={110}

                label

              >

                {completionData.map(

                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />

                  )

                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}