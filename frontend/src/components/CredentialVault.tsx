import React, { useState, useEffect } from 'react';
import { Lock, Key, RefreshCw, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { UserVaultData } from '../types';
import { MidnightClient } from '../lib/midnight-client';
import { generateRandomHex, truncateHash } from '../lib/crypto';

interface CredentialVaultProps {
  onVaultUpdated: () => void;
}

export const CredentialVault: React.FC<CredentialVaultProps> = ({ onVaultUpdated }) => {
  const client = MidnightClient.getInstance();
  const [vault, setVault] = useState<UserVaultData>(client.getVault());
  const [isSaved, setIsSaved] = useState(false);
  const [showValues, setShowValues] = useState(false);

  useEffect(() => {
    setVault(client.getVault());
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await client.updateVault(vault);
    setIsSaved(true);
    onVaultUpdated();
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRegenerateSalt = async () => {
    const newSalt = generateRandomHex(16);
    const updated = await client.updateVault({ identitySalt: newSalt });
    setVault(updated);
    onVaultUpdated();
  };

  const applyPreset = async (preset: 'eligible' | 'underage' | 'whale') => {
    let presetData: Partial<UserVaultData> = {};
    if (preset === 'eligible') {
      presetData = { birthYear: 1999, portfolioBalance: 25000, creditScore: 740, membershipTier: 3 };
    } else if (preset === 'underage') {
      presetData = { birthYear: 2011, portfolioBalance: 1200, creditScore: 580, membershipTier: 1 };
    } else if (preset === 'whale') {
      presetData = { birthYear: 1988, portfolioBalance: 150000, creditScore: 820, membershipTier: 5 };
    }

    const updated = await client.updateVault(presetData);
    setVault(updated);
    setIsSaved(true);
    onVaultUpdated();
    setTimeout(() => setIsSaved(false), 2500);
  };

  const currentAge = 2026 - vault.birthYear;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Encrypted Private Vault
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                  LOCAL ONLY (WITNESS)
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                These values are stored strictly inside your browser and fed into Midnight's private witness engine.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowValues(!showValues)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white"
          >
            {showValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showValues ? 'Mask Credentials' : 'Show Credentials'}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Quick Test Profiles:</span>
          <button
            onClick={() => applyPreset('eligible')}
            className="px-2.5 py-1 text-xs rounded-md bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/40"
          >
            🧑 Adult (Age 27, $25k)
          </button>
          <button
            onClick={() => applyPreset('underage')}
            className="px-2.5 py-1 text-xs rounded-md bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/40"
          >
            🧒 Underage Tester (Age 15, $1.2k)
          </button>
          <button
            onClick={() => applyPreset('whale')}
            className="px-2.5 py-1 text-xs rounded-md bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40"
          >
            🐋 VIP Whale (Age 38, $150k)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Birth Year */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200">
                Birth Year (Confidential)
              </label>
              <span className="text-xs text-indigo-400 font-mono">
                Calculated Age: {currentAge} yrs
              </span>
            </div>
            <input
              type={showValues ? 'number' : 'password'}
              value={vault.birthYear}
              onChange={(e) => setVault({ ...vault, birthYear: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="e.g. 1999"
              required
            />
            <p className="text-[11px] text-slate-400">Used for 18+ and 21+ Age Verification circuits.</p>
          </div>

          {/* Portfolio Balance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200">
                Portfolio Balance ($ USD)
              </label>
              <span className="text-xs text-teal-400 font-mono">
                ${vault.portfolioBalance.toLocaleString()}
              </span>
            </div>
            <input
              type={showValues ? 'number' : 'password'}
              value={vault.portfolioBalance}
              onChange={(e) => setVault({ ...vault, portfolioBalance: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="e.g. 25000"
              required
            />
            <p className="text-[11px] text-slate-400">Used for Accredited Investor and liquidity threshold gates.</p>
          </div>

          {/* Credit Score */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">
              DeFi / Credit Score (300 - 850)
            </label>
            <input
              type={showValues ? 'number' : 'password'}
              value={vault.creditScore}
              onChange={(e) => setVault({ ...vault, creditScore: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="e.g. 740"
              required
            />
            <p className="text-[11px] text-slate-400">Used for lending protocol gatekeeping.</p>
          </div>

          {/* Membership Tier */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">
              DAO / Membership Tier Level
            </label>
            <input
              type={showValues ? 'number' : 'password'}
              value={vault.membershipTier}
              onChange={(e) => setVault({ ...vault, membershipTier: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="e.g. 3"
              required
            />
            <p className="text-[11px] text-slate-400">Used for Tier-based governance and exclusive Discord/Telegram gates.</p>
          </div>

        </div>

        {/* Cryptographic Secrets Section */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            Cryptographic Salt & Identity Commitment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Secret Identity Salt:</span>
                <button
                  type="button"
                  onClick={handleRegenerateSalt}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Re-roll
                </button>
              </div>
              <div className="text-slate-200 truncate">{truncateHash(vault.identitySalt, 10, 8)}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 mb-1">Public Identity Commitment:</div>
              <div className="text-indigo-300 truncate">{truncateHash(vault.identityCommitment || '0xCalculating...', 10, 8)}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            End-to-End Client-Side Witness Protection
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition"
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                Saved to Local Vault!
              </>
            ) : (
              'Save Vault Credentials'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
