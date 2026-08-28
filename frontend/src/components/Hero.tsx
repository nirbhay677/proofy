import React from 'react';
import { ShieldCheck, EyeOff, Cpu, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenVault: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenVault }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[250px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-300">
            Powered by <strong className="text-indigo-400">Midnight Network</strong> & Compact Smart Contracts
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Prove You Qualify.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
            Without Revealing Your Data.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Verify 18+/21+ age, accredited investor status, credit scores, or DAO memberships. 
          Your raw credentials stay encrypted in your local vault while Midnight's ZK circuits prove threshold compliance.
        </p>

        {/* Features row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2.5">
              <EyeOff className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Zero Data Leakage</h4>
            <p className="text-xs text-slate-400 mt-1">Birth dates and bank balances are never sent to the ledger.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center mb-2.5">
              <Cpu className="w-4 h-4 text-teal-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Compact ZK Circuits</h4>
            <p className="text-xs text-slate-400 mt-1">Evaluates Halo2 proofs locally via Midnight's client runtime.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Sybil-Resistant Nullifiers</h4>
            <p className="text-xs text-slate-400 mt-1">Prevents replay attacks while preserving cross-gate unlinkability.</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            Explore Active Gates
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenVault}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            Manage Private Vault
          </button>
        </div>
      </div>
    </div>
  );
};
