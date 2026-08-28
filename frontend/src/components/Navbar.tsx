import React from 'react';
import { ShieldCheck, Wallet, Lock, Activity, Sparkles } from 'lucide-react';
import { truncateHash } from '../lib/crypto';

interface NavbarProps {
  activeTab: 'gates' | 'vault' | 'verifier' | 'contract';
  setActiveTab: (tab: 'gates' | 'vault' | 'verifier' | 'contract') => void;
  walletAddress: string;
  isWalletConnected: boolean;
  onToggleWallet: () => void;
  dustBalance: number;
  openCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  walletAddress,
  isWalletConnected,
  onToggleWallet,
  dustBalance,
  openCreateModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('gates')}>
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#070b14] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Proofy
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                MIDNIGHT ZK
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Zero-Knowledge Eligibility & Age Gate</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('gates')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'gates'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Explore Gates
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Private Vault
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'verifier'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Verifier Terminal
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'contract'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Compact Code
          </button>
        </nav>

        {/* Actions & Wallet */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + New Gate
          </button>

          {isWalletConnected ? (
            <div className="flex items-center gap-2 p-1.5 pr-3 bg-slate-900/90 border border-slate-800 rounded-xl">
              <div className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-xs font-mono text-indigo-300">
                {dustBalance.toFixed(2)} DUST
              </div>
              <button
                onClick={onToggleWallet}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white"
                title="Click to disconnect"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {truncateHash(walletAddress, 6, 4)}
              </button>
            </div>
          ) : (
            <button
              onClick={onToggleWallet}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Wallet className="w-4 h-4" />
              Connect Midnight Wallet
            </button>
          )}
        </div>

      </div>

      {/* Mobile Sub Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 bg-slate-950/80 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('gates')}
          className={`py-1.5 px-3 rounded-md ${activeTab === 'gates' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          Gates
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`py-1.5 px-3 rounded-md ${activeTab === 'vault' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          Vault
        </button>
        <button
          onClick={() => setActiveTab('verifier')}
          className={`py-1.5 px-3 rounded-md ${activeTab === 'verifier' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          Verifier
        </button>
        <button
          onClick={() => setActiveTab('contract')}
          className={`py-1.5 px-3 rounded-md ${activeTab === 'contract' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          Compact
        </button>
      </div>
    </header>
  );
};
