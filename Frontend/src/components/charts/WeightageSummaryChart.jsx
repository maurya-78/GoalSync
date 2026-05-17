import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const WeightageSummaryChart = ({ data }) => {
  const COLORS = ['#818cf8', '#60a5fa', '#34d399', '#fbbf24', '#f87171'];

  return (
    <div className="h-[250px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Text for Total */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-white">100%</span>
        <span className="text-[10px] text-slate-500 uppercase">Total Weight</span>
      </div>
    </div>
  );
};

export default WeightageSummaryChart;