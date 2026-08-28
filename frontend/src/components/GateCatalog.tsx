import React, { useState } from 'react';
import { Gate, VerificationRecord } from '../types';
import { ShieldAlert, Sparkles, Coins, Award, CheckCircle, ArrowUpRight, Search, PlusCircle } from 'lucide-react';
import { truncateHash } from '../lib/crypto';

interface GateCatalogProps {
  gates: Gate[];
  verifications: VerificationRecord[];
  onSelectGateForProof: (gate: Gate) => void;
  onViewBadge: (record: VerificationRecord) => void;
  openCreateModal: () => void;
}

export const GateCatalog: React.FC<GateCatalogProps> = ({
  gates,
  verifications,
  onSelectGateForProof,
  onViewBadge,
  openCreateModal,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getGateIcon = (type: Gate['type']) => {
    switch (type) {
      case 'AGE_THRESHOLD':
        return <ShieldAlert className="w-5 h-5 text-indigo-400" />;
      case 'BALANCE_THRESHOLD':
        return <Coins className="w-5 h-5 text-teal-400" />;
      case 'CREDENTIAL_SCORE':
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const getVerificationForGate = (gateId: string): VerificationRecord | undefined => {
    return verifications.find((v) => v.gateId.toLowerCase() === gateId.toLowerCase());
  };

  const filteredGates = gates.filter((gate) => {
    const matchesFilter = filterType === 'ALL' || gate.type === filterType;
    const matchesSearch =
      gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gate.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterType === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Gates ({gates.length})
          </button>
          <button
            onClick={() => setFilterType('AGE_THRESHOLD')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterType === 'AGE_THRESHOLD'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🔞 Age Gates
          </button>
          <button
            onClick={() => setFilterType('BALANCE_THRESHOLD')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterType === 'BALANCE_THRESHOLD'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            💎 Balance / VIP
          </button>
          <button
            onClick={() => setFilterType('CREDENTIAL_SCORE')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              filterType === 'CREDENTIAL_SCORE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🏆 Scores & Tiers
          </button>
        </div>

        {/* Search Bar & Create Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gates or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create Gate
          </button>
        </div>

      </div>

      {/* Gate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredGates.map((gate) => {
          const verification = getVerificationForGate(gate.id);
          const isPassIssued = !!verification;

          return (
            <div
              key={gate.id}
              className={`p-6 rounded-2xl transition-all duration-200 border ${
                isPassIssued
                  ? 'bg-gradient-to-b from-emerald-950/20 to-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-slate-900/70 border-slate-800/90 hover:border-indigo-500/40 hover:bg-slate-900/90'
              } backdrop-blur-xl flex flex-col justify-between`}
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {getGateIcon(gate.type)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">{gate.name}</h3>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>ID:</span> {truncateHash(gate.id, 8, 6)}
                      </div>
                    </div>
                  </div>

                  {isPassIssued ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      Required: {gate.type === 'AGE_THRESHOLD' ? `${gate.threshold}+ yrs` : gate.type === 'BALANCE_THRESHOLD' ? `≥ $${gate.threshold.toLocaleString()}` : `≥ ${gate.threshold}`}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  {gate.description}
                </p>
              </div>

              {/* Card Footer / Action */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-800/80 mb-4">
                  <span>Midnight Ledger: Active</span>
                  <span className="font-mono text-indigo-300">{gate.totalVerifications} proofs verified</span>
                </div>

                {isPassIssued ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewBadge(verification)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      View On-Chain ZK Pass
                    </button>
                    <button
                      onClick={() => onSelectGateForProof(gate)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      title="Re-verify with fresh nullifier"
                    >
                      Re-prove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectGateForProof(gate)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition hover:scale-[1.01]"
                  >
                    Prove Eligibility with ZK
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredGates.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Gates Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filter or create a new custom ZK gate.</p>
        </div>
      )}

    </div>
  );
};
