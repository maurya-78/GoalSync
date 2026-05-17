import React from 'react';

export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-12 bg-slate-800 rounded-xl w-full" />
      <div className="space-y-2">
        {[...Array(rows)].map((_, idx) => (
          <div key={idx} className="h-16 bg-slate-800/60 rounded-xl w-full" />
        ))}
      </div>
    </div>
  );
}