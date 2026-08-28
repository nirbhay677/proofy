import React, { useState } from 'react';
import { VerificationRecord } from '../types';
import { ShieldCheck, CheckCircle2, Copy, Check, Download, X, QrCode } from 'lucide-react';

interface VerificationBadgeProps {
  record: VerificationRecord;
  onClose: () => void;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ record, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyNullifier = () => {
    navigator.clipboard.writeText(record.nullifier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `proofy_pass_${record.gateName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0b1120] border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 overflow-hidden">
        
        {/* Top Emerald Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero-Knowledge Pass Verified
          </div>
          <h2 className="text-xl font-bold text-white">{record.gateName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Confirmed on Midnight Network Block #{record.blockHeight}
          </p>
        </div>

        {/* Pass Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 relative overflow-hidden mb-6">
          
          {/* Watermark Logo */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <span className="text-slate-400">Eligibility Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> COMPLIANT & VERIFIED
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <span className="text-slate-400">Required Threshold:</span>
              <span className="font-mono font-semibold text-slate-200">
                {record.gateType === 'AGE_THRESHOLD' ? `${record.threshold}+ Years` : record.gateType === 'BALANCE_THRESHOLD' ? `≥ $${record.threshold.toLocaleString()}` : `≥ ${record.threshold}`}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <span className="text-slate-400">Data Disclosed:</span>
              <span className="font-mono text-emerald-400 font-semibold">0.00% (Strictly ZK)</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>On-Chain Nullifier:</span>
                <button
                  onClick={handleCopyNullifier}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 break-all">
                {record.nullifier}
              </div>
            </div>
          </div>

          {/* Simulated QR Code representation */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-slate-950 shrink-0">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">
              This QR contains your cryptographic proof nullifier. Present this to any verifier or physical checkpoint.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            Export Proof JSON
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
