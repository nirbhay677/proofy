import React, { useState } from 'react';
import { Gate, ProofStep, VerificationRecord, UserVaultData } from '../types';
import { MidnightClient } from '../lib/midnight-client';
import { X, ShieldCheck, Cpu, CheckCircle2, AlertCircle, Loader2, Lock, EyeOff } from 'lucide-react';

interface ZkProofModalProps {
  gate: Gate;
  vault: UserVaultData;
  onClose: () => void;
  onProofComplete: (record: VerificationRecord) => void;
}

export const ZkProofModal: React.FC<ZkProofModalProps> = ({
  gate,
  vault,
  onClose,
  onProofComplete,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<ProofStep[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const client = MidnightClient.getInstance();

  const handleStartProof = async () => {
    setIsRunning(true);
    setErrorMsg(null);

    const result = await client.executeProofPipeline(gate, (updatedSteps) => {
      setSteps(updatedSteps);
    });

    setIsRunning(false);

    if (result.success && result.record) {
      setTimeout(() => {
        onProofComplete(result.record!);
      }, 1000);
    } else if (result.error) {
      setErrorMsg(result.error);
    }
  };

  const getPrivateInputValue = () => {
    if (gate.type === 'AGE_THRESHOLD') {
      const age = 2026 - vault.birthYear;
      return { label: 'Private Birth Year', value: `${vault.birthYear} (${age} yrs old)` };
    }
    if (gate.type === 'BALANCE_THRESHOLD') {
      return { label: 'Private Liquid Balance', value: `$${vault.portfolioBalance.toLocaleString()}` };
    }
    if (gate.type === 'CREDENTIAL_SCORE') {
      return { label: 'Private Credit Score', value: `${vault.creditScore}` };
    }
    return { label: 'Private Membership Tier', value: `Tier ${vault.membershipTier}` };
  };

  const privateInput = getPrivateInputValue();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 rounded-3xl bg-[#0b1120] border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 overflow-hidden">
        
        {/* Glowing header accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-teal-400 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isRunning}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">
              Midnight ZK Proof Synthesizer
            </h2>
            <p className="text-xs text-slate-400">
              Target Gate: <strong className="text-indigo-300">{gate.name}</strong>
            </p>
          </div>
        </div>

        {/* Private Witness Data Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Lock className="w-3.5 h-3.5" />
              Local Witness Input (Client Only)
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <EyeOff className="w-3 h-3" /> 0% Network Exposure
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400">{privateInput.label}</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {privateInput.value}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Required Threshold</div>
              <div className="text-sm font-mono font-bold text-indigo-400 mt-0.5">
                {gate.type === 'AGE_THRESHOLD' ? `≥ ${gate.threshold} yrs` : gate.type === 'BALANCE_THRESHOLD' ? `≥ $${gate.threshold.toLocaleString()}` : `≥ ${gate.threshold}`}
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Proof Execution */}
        {steps.length > 0 ? (
          <div className="space-y-3 mb-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  step.state === 'running'
                    ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                    : step.state === 'success'
                    ? 'bg-slate-900/40 border-emerald-500/20 text-slate-300'
                    : step.state === 'error'
                    ? 'bg-red-950/30 border-red-500/30 text-red-300'
                    : 'bg-slate-900/20 border-slate-800/40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {step.state === 'running' && (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    )}
                    {step.state === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {step.state === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    {step.state === 'idle' && (
                      <div className="w-4 h-4 rounded-full border border-slate-700" />
                    )}
                    <span className="text-xs font-semibold">{step.title}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {step.state}
                  </span>
                </div>

                {step.log && (
                  <div className="mt-2 text-[11px] font-mono text-slate-300 pl-6 border-l border-slate-700/50">
                    {step.log}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 mb-6 text-center">
            <ShieldCheck className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-200">Ready to Synthesize Zero-Knowledge Proof</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Compact will compute a cryptographic proof verifying you meet the threshold without revealing your exact number.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Proof Generation Aborted</div>
              <div className="mt-0.5 text-red-200">{errorMsg}</div>
              <div className="mt-2 text-[11px] text-red-400">
                Tip: Go to your <strong>Private Vault</strong> to adjust your credentials for testing.
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStartProof}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Proof...
              </>
            ) : (
              'Generate & Submit Proof'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
