import React, { useState } from 'react';
import { Check, X, Edit2 } from 'lucide-react';

export default function InlineEditField({ value, onSave, label, type = 'text', min, max }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    if (type === 'number') {
      const num = Number(currentValue);
      if (min !== undefined && num < min) return;
      if (max !== undefined && num > max) return;
    }
    onSave(currentValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 group">
        <span className="font-medium text-slate-200">{value}</span>
        <button 
          onClick={() => setIsEditing(true)} 
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-indigo-400 transition-all"
          title={`Edit ${label}`}
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 z-10">
      <input
        type={type}
        min={min}
        max={max}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none w-24 font-mono"
        autoFocus
      />
      <button onClick={handleSave} className="p-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded hover:bg-emerald-900 transition-all">
        <Check className="w-3 h-3" />
      </button>
      <button onClick={() => { setCurrentValue(value); setIsEditing(false); }} className="p-1 bg-slate-900 text-slate-400 border border-slate-800 rounded hover:bg-slate-800 transition-all">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}