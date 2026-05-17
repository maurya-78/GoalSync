import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  MessageSquare, 
  RefreshCcw, 
  PlusCircle, 
  Clock,
  ArrowRight
} from 'lucide-react';

/**
 * Enterprise Audit Stream
 * -----------------------
 * Displays real-time telemetry of goal updates and team activities.
 */

const activities = [
  {
    id: 1,
    type: 'update',
    title: 'UI Redesign Goal updated',
    time: '2h ago',
    icon: RefreshCcw,
    color: 'text-indigo-400',
    dot: 'bg-indigo-500'
  },
  {
    id: 2,
    type: 'complete',
    title: 'Marketing Plan completed',
    time: '5h ago',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    dot: 'bg-emerald-500'
  },
  {
    id: 3,
    type: 'team',
    title: 'New team member added',
    time: '1d ago',
    icon: PlusCircle,
    color: 'text-blue-400',
    dot: 'bg-blue-500'
  },
  {
    id: 4,
    type: 'review',
    title: 'Quarterly Review scheduled',
    time: '2d ago',
    icon: MessageSquare,
    color: 'text-amber-400',
    dot: 'bg-amber-500'
  }
];

export default function RecentActivity() {
  return (
    <div className="flex flex-col h-full bg-slate-950/20">
      <div className="space-y-1">
        {activities.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-900/40 transition-all cursor-pointer group"
          >
            {/* Minimalist Timeline Indicator */}
            <div className="mt-1.5 relative flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${item.dot} shadow-[0_0_8px_rgba(255,255,255,0.2)] z-10`} />
              {idx !== activities.length - 1 && (
                <div className="absolute top-2 w-[1px] h-12 bg-slate-800" />
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[13px] font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-tighter whitespace-nowrap">
                  <Clock className="w-2.5 h-2.5" />
                  {item.time}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <item.icon className={`w-3 h-3 ${item.color}`} />
                <span className="text-[10px] text-slate-500 font-medium">System Telemetry Log</span>
              </div>
            </div>

            {/* Subtle Hover Action */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-auto pt-4 px-4 pb-4 border-t border-slate-900">
        <button className="w-full py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-indigo-400 hover:bg-indigo-500/5 rounded-xl transition-all border border-transparent hover:border-indigo-500/10">
          View all activity log
        </button>
      </div>
    </div>
  );
}