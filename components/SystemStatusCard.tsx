
import React from 'react';
import { SystemStatus } from '../types';

interface Props {
  system: SystemStatus;
}

export const SystemStatusCard: React.FC<Props> = ({ system }) => {
  const statusColors = {
    active: 'bg-emerald-500',
    idle: 'bg-slate-700',
    offline: 'bg-rose-500'
  };

  const ringColors = {
    active: 'ring-emerald-500/20',
    idle: 'ring-slate-700/20',
    offline: 'ring-rose-500/20'
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
          {system.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColors[system.status]} ${system.status === 'active' ? 'animate-pulse' : ''}`}></span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            {system.status}
          </span>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
        {system.description}
      </p>
      <div className={`mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden`}>
        <div 
          className={`h-full transition-all duration-500 ${system.status === 'active' ? `bg-${system.color} w-full` : 'bg-slate-700 w-0'}`}
        />
      </div>
    </div>
  );
};
