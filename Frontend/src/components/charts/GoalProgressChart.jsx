import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

/**
 * MERGED STRATEGIC GOAL CHART
 * ---------------------------
 * Combines minimalist clean code with futuristic enterprise aesthetics.
 */

const GoalProgressChart = ({ goals = [] }) => {
  // Logic to process the data (Support for both raw data and goals array)
  const completed = goals.filter(g => g.overallProgress === 100).length;
  const inProgress = goals.filter(g => g.overallProgress > 0 && g.overallProgress < 100).length;
  const notStarted = goals.filter(g => g.overallProgress === 0).length;

  const chartData = [
    { name: 'Completed', value: completed || 0, color: '#10b981' },
    { name: 'In Progress', value: inProgress || 0, color: '#6366f1' },
    { name: 'Not Started', value: notStarted || 0, color: '#94a3b8' },
  ];

  // Custom Futuristic Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Telemetry</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
            <span className="text-sm font-bold text-white">{payload[0].name}: {payload[0].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="hover:opacity-80 transition-all cursor-pointer outline-none"
                style={{ filter: `drop-shadow(0 0 6px ${entry.color}33)` }}
              />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter ml-1">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Percentage - Pure Enterprise Aesthetic */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Efficiency</span>
        <span className="text-2xl font-black text-white italic">
          {goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0}%
        </span>
      </div>
    </div>
  );
};

export default GoalProgressChart;