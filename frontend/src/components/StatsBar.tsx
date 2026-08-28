import React from 'react';
import { Layers, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

interface StatsBarProps {
  totalGates: number;
  totalVerifications: number;
  activePassesCount: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalGates,
  totalVerifications,
  activePassesCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
        
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{totalGates}</div>
            <div className="text-xs text-slate-400">Active ZK Gates</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{totalVerifications}</div>
            <div className="text-xs text-slate-400">Proofs Verified</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">0 Bytes</div>
            <div className="text-xs text-slate-400">Private Data Leaked</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{activePassesCount}</div>
            <div className="text-xs text-slate-400">Your Active Passes</div>
          </div>
        </div>

      </div>
    </div>
  );
};
