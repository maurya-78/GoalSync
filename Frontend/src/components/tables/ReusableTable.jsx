import React from 'react';

export default function ReusableTable({ headers, data, renderRow, emptyMessage = "No tracking records found in this frame." }) {
  return (
    <div className="w-full overflow-x-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/40">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-500 font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
}