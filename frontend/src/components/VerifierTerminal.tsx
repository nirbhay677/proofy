import React, { useState } from 'react';
import { MidnightClient } from '../lib/midnight-client';
import { VerificationRecord, Gate } from '../types';
import { Search, CheckCircle2, XCircle, Terminal, Shield, Code2 } from 'lucide-react';
import { truncateHash } from '../lib/crypto';

interface VerifierTerminalProps {
  gates: Gate[];
  verifications: VerificationRecord[];
}

export const VerifierTerminal: React.FC<VerifierTerminalProps> = ({ gates, verifications }) => {
  const [nullifierInput, setNullifierInput] = useState<string>('');
  const [selectedGateId, setSelectedGateId] = useState<string>(gates[0]?.id || '');
  const [queryResult, setQueryResult] = useState<{ searched: boolean; record?: VerificationRecord }>({ searched: false });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const client = MidnightClient.getInstance();

  const handleVerify = () => {
    if (!nullifierInput.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      const record = client.getVerificationByNullifier(nullifierInput.trim());
      setQueryResult({ searched: true, record });
      setIsVerifying(false);
    }, 500);
  };

  const handleQuickFill = (record: VerificationRecord) => {
    setNullifierInput(record.nullifier);
    setSelectedGateId(record.gateId);
    setQueryResult({ searched: true, record });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl mb-8">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Third-Party Verifier Terminal
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                dApp / API PORTAL
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Query Midnight's public ledger to verify whether a user's nullifier holds a valid ZK eligibility badge.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Query Interface */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              Query Nullifier Pass
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Target Gate
                </label>
                <select
                  value={selectedGateId}
                  onChange={(e) => setSelectedGateId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500"
                >
                  {gates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Threshold: {g.threshold})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  User Nullifier Hash
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nullifierInput}
                    onChange={(e) => setNullifierInput(e.target.value)}
                    placeholder="e.g. 0x8f2c0199e87123..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying || !nullifierInput.trim()}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? 'Querying Midnight Ledger...' : 'Verify on Midnight Ledger'}
              </button>
            </div>

            {/* Verification Result Card */}
            {queryResult.searched && (
              <div className="mt-6 pt-6 border-t border-slate-800 animate-fadeIn">
                {queryResult.record ? (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-3">
                      <CheckCircle2 className="w-5 h-5" />
                      ELIGIBILITY PROOF VERIFIED (VALID)
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Gate:</span>
                        <span className="text-white font-bold">{queryResult.record.gateName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Block Height:</span>
                        <span className="text-indigo-400">#{queryResult.record.blockHeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Verified At:</span>
                        <span>{new Date(queryResult.record.verifiedAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Private Data Leaked:</span>
                        <span className="text-emerald-400 font-bold">0 bytes</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40">
                    <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm mb-1">
                      <XCircle className="w-5 h-5" />
                      NO VALID PROOF FOUND
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      This nullifier is either not registered or does not satisfy the specified gate.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Code Integration Example */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Developer Compact SDK Integration (For External dApps)
            </h3>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto">
{`// 1. External dApp imports Proofy contract
import { ProofyContract } from '@proofy/midnight-sdk';

// 2. Query badge state on-chain
const isEligible = await proofyContract.check_badge_validity({
  nullifier: userProvidedNullifier,
  gate_id: GATE_18_PLUS_AGE_ID
});

if (isEligible) {
  // Grant access to DeFi pool or restricted feature
  grantAccess();
}`}
            </pre>
          </div>

        </div>

        {/* Right Col: Recent On-Chain Passes for Quick Testing */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              Recent On-Chain Passes ({verifications.length})
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Click any verified pass below to test the query engine instantly:
            </p>

            {verifications.length > 0 ? (
              <div className="space-y-2.5">
                {verifications.map((v) => (
                  <button
                    key={v.nullifier}
                    onClick={() => handleQuickFill(v)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white group-hover:text-indigo-400 transition">
                        {v.gateName}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">#Block {v.blockHeight}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {truncateHash(v.nullifier, 8, 6)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No passes verified yet. Head to "Explore Gates" and prove eligibility to see items here!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
