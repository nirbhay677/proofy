import React, { useState } from 'react';
import { GateType } from '../types';
import { MidnightClient } from '../lib/midnight-client';
import { X, Sparkles, PlusCircle, Shield } from 'lucide-react';

interface CreateGateModalProps {
  onClose: () => void;
  onGateCreated: () => void;
  creatorAddress: string;
}

export const CreateGateModal: React.FC<CreateGateModalProps> = ({
  onClose,
  onGateCreated,
  creatorAddress,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GateType>('AGE_THRESHOLD');
  const [threshold, setThreshold] = useState<number>(18);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const client = MidnightClient.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || threshold <= 0) return;

    setIsSubmitting(true);
    await client.createGate(name, description, type, threshold, creatorAddress);
    setIsSubmitting(false);
    onGateCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 rounded-3xl bg-[#0b1120] border border-indigo-500/30 shadow-2xl overflow-hidden">
        
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">
              Deploy New ZK Gate
            </h2>
            <p className="text-xs text-slate-400">
              Register a custom eligibility requirement on Midnight's public ledger.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-semibold text-slate-200 block mb-1.5">Gate Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Genesis DAO Voting Gate (Tier 2+)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-200 block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe who qualifies and what access is unlocked..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-200 block mb-1.5">Gate Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GateType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-indigo-500"
              >
                <option value="AGE_THRESHOLD">🔞 Age Threshold (Yrs)</option>
                <option value="BALANCE_THRESHOLD">💎 Balance Threshold ($)</option>
                <option value="CREDENTIAL_SCORE">🏆 Credit / Score</option>
                <option value="MEMBERSHIP_TIER">🛡️ Membership Tier</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-200 block mb-1.5">
                Minimum Threshold
              </label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-indigo-500 font-mono"
                required
                min={1}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-slate-400">
            <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Smart contract circuit will strictly enforce <code>val &gt;= {threshold}</code> in zero knowledge.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {isSubmitting ? 'Deploying Gate...' : 'Deploy to Midnight'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
