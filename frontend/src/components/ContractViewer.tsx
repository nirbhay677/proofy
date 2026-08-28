import React, { useState } from 'react';
import { FileCode2, Copy, Check, ShieldCheck, Cpu, Layers } from 'lucide-react';

export const ContractViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const compactCode = `// Proofy: Zero-Knowledge Age & Eligibility Gate Smart Contract
// Platform: Midnight Network
// Language: Compact (.compact)
// Description: Allows users to prove age, financial, or credential thresholds without revealing underlying private values.

pragma language_version >= 0.20.0;

export enum GateType {
    AGE_THRESHOLD,      // Proves: (CurrentYear - BirthYear) >= RequiredAge
    BALANCE_THRESHOLD,  // Proves: SecretBalance >= RequiredBalance
    CREDENTIAL_SCORE,   // Proves: SecretScore >= RequiredScore
    MEMBERSHIP_TIER     // Proves: SecretTier >= RequiredTier
}

export struct GateConfig {
    gate_id: Bytes<32>,
    creator: Bytes<32>,
    gate_type: GateType,
    min_threshold: Uint<32>,
    name_hash: Bytes<32>,
    is_active: Boolean,
    total_verifications: Uint<32>
}

export struct VerificationRecord {
    nullifier: Bytes<32>,
    gate_id: Bytes<32>,
    verified_at_epoch: Uint<32>,
    is_valid: Boolean
}

// -------------------------------------------------------------
// PUBLIC ON-CHAIN LEDGER STATE
// -------------------------------------------------------------
export ledger gates: Map<Bytes<32>, GateConfig>;
export ledger verifications: Map<Bytes<32>, VerificationRecord>;
export ledger total_gates_created: Uint<32>;
export ledger total_proofs_verified: Uint<32>;
export ledger contract_admin: Bytes<32>;

// -------------------------------------------------------------
// PRIVATE WITNESS DECLARATIONS (Local Client Execution)
// -------------------------------------------------------------
witness get_secret_value(): Uint<32>;
witness get_user_secret_salt(): Bytes<32>;
witness get_user_identity_commitment(): Bytes<32>;

// -------------------------------------------------------------
// SMART CONTRACT CIRCUITS / TRANSITIONS
// -------------------------------------------------------------
export circuit verify_eligibility(
    gate_id: Bytes<32>,
    current_epoch_or_year: Uint<32>
): Bytes<32> {
    assert gates.member(gate_id) "Proofy: Gate does not exist";
    const gate = gates.lookup(gate_id);
    assert gate.is_active "Proofy: Gate is currently deactivated";

    const secret_raw_val = get_secret_value();
    const user_salt = get_user_secret_salt();
    const user_identity = get_user_identity_commitment();

    // ZERO-KNOWLEDGE CONSTRAINTS: Validate threshold based on gate type
    if (gate.gate_type == GateType.AGE_THRESHOLD) {
        assert current_epoch_or_year >= secret_raw_val "Proofy: Invalid birth year in future";
        const calculated_age = current_epoch_or_year - secret_raw_val;
        assert calculated_age >= gate.min_threshold "Proofy: Age does not meet required threshold";
    } else {
        assert secret_raw_val >= gate.min_threshold "Proofy: Value does not meet required threshold";
    }

    // Compute unique deterministic nullifier: H(GateID, Salt, IdentityKey)
    const nullifier = persistent_hash<Vector<3, Bytes<32>>>([
        gate_id,
        user_salt,
        user_identity
    ]);

    assert !verifications.member(nullifier) "Proofy: Pass already issued for this identity";

    const record = VerificationRecord {
        nullifier: nullifier,
        gate_id: gate_id,
        verified_at_epoch: current_epoch_or_year,
        is_valid: true
    };
    verifications.insert(nullifier, record);

    return nullifier;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(compactCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Midnight Compact Smart Contract
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                  proofy.compact
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official Compact source code defining Midnight's public ledger state and private ZK witness circuits.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard' : 'Copy Compact Code'}
          </button>
        </div>

        {/* 3 Pillars */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5" /> 1. Public Ledger State
            </div>
            <p className="text-slate-400 text-[11px]">
              Holds registered gate IDs, thresholds, and single-use nullifiers visible to all verifiers.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="font-bold text-teal-300 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 2. Private Witness
            </div>
            <p className="text-slate-400 text-[11px]">
              Extracts DOB, salary, or credit score locally from client storage without internet broadcast.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5" /> 3. ZK Circuit Constraints
            </div>
            <p className="text-slate-400 text-[11px]">
              Enforces <code>secret &gt;= threshold</code> and outputs an un-linkable cryptographic badge.
            </p>
          </div>
        </div>
      </div>

      {/* Code Block */}
      <div className="rounded-2xl bg-[#0b1120] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-slate-300">contracts/proofy.compact</span>
          </span>
          <span>Compact v0.20+</span>
        </div>
        <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{compactCode}</code>
        </pre>
      </div>

    </div>
  );
};
