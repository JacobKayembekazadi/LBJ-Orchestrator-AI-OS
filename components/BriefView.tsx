
import React from 'react';
import { OrchestratorBrief, UsageGuide } from '../types';

interface Props {
  brief: OrchestratorBrief;
  usageGuide: UsageGuide;
}

export const BriefView: React.FC<Props> = ({ brief, usageGuide }) => {
  return (
    <div className="space-y-6">
      {/* Brief Section */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden font-mono shadow-2xl">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500">--- ORCHESTRATOR BRIEF ---</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"></div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">User Intent:</span>
            <p className="text-sm text-slate-200 leading-relaxed">{brief.userIntent}</p>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">Key Context:</span>
            <p className="text-sm text-slate-300 leading-relaxed italic">{brief.keyContext}</p>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">Recommended System(s):</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {brief.recommendedSystems.map(sys => (
                <span key={sys} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/30 rounded uppercase font-bold">
                  {sys}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">Reason for Routing:</span>
            <p className="text-sm text-slate-300 leading-relaxed">{brief.reasonForRouting}</p>
          </div>
        </div>
        <div className="bg-slate-800/50 px-4 py-1.5 border-t border-slate-700/50">
          <span className="text-[10px] font-bold tracking-widest text-slate-600">-------------------------</span>
        </div>
      </div>

      {/* Usage Guide Section */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden font-mono shadow-2xl">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500">--- HOW TO USE THE SYSTEM ---</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20"></div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">System to Open:</span>
              <p className="text-sm text-blue-400 font-bold leading-relaxed">{usageGuide.systemToOpen}</p>
            </div>
            <div>
              <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">What to Paste/Upload:</span>
              <p className="text-sm text-slate-300 leading-relaxed">{usageGuide.whatToPasteOrUpload}</p>
            </div>
            <div>
              <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">System Task:</span>
              <p className="text-sm text-slate-300 leading-relaxed">{usageGuide.whatThisSystemWillDo}</p>
            </div>
            <div>
              <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">Deliverable:</span>
              <p className="text-sm text-emerald-400 font-bold leading-relaxed underline underline-offset-4">{usageGuide.whatYoullGetAtTheEnd}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 px-4 py-1.5 border-t border-slate-700/50">
          <span className="text-[10px] font-bold tracking-widest text-slate-600">---------------------------</span>
        </div>
      </div>
    </div>
  );
};
