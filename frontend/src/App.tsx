import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { GateCatalog } from './components/GateCatalog';
import { CredentialVault } from './components/CredentialVault';
import { VerifierTerminal } from './components/VerifierTerminal';
import { ContractViewer } from './components/ContractViewer';
import { ZkProofModal } from './components/ZkProofModal';
import { VerificationBadge } from './components/VerificationBadge';
import { CreateGateModal } from './components/CreateGateModal';
import { MidnightClient } from './lib/midnight-client';
import { Gate, VerificationRecord, UserVaultData } from './types';
import { ShieldCheck, Github, ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const client = MidnightClient.getInstance();

  // App Navigation State
  const [activeTab, setActiveTab] = useState<'gates' | 'vault' | 'verifier' | 'contract'>('gates');

  // Midnight Wallet State
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true);
  const [walletAddress] = useState<string>('0xmid7a810992384fabce9812903847');
  const [dustBalance, setDustBalance] = useState<number>(45.80);

  // App Data
  const [gates, setGates] = useState<Gate[]>(client.getGates());
  const [verifications, setVerifications] = useState<VerificationRecord[]>(client.getVerifications());
  const [vault, setVault] = useState<UserVaultData>(client.getVault());

  // Modal States
  const [selectedGateForProof, setSelectedGateForProof] = useState<Gate | null>(null);
  const [activeBadgeRecord, setActiveBadgeRecord] = useState<VerificationRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Refresh data helper
  const refreshData = () => {
    setGates([...client.getGates()]);
    setVerifications([...client.getVerifications()]);
    setVault({ ...client.getVault() });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggleWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  const handleProofComplete = (record: VerificationRecord) => {
    setSelectedGateForProof(null);
    refreshData();
    setDustBalance((prev) => Math.max(0, prev - 0.05)); // Slight transaction fee
    setActiveBadgeRecord(record);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletAddress={walletAddress}
        isWalletConnected={isWalletConnected}
        onToggleWallet={handleToggleWallet}
        dustBalance={dustBalance}
        openCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section (Only shown on 'gates' tab for landing feel) */}
        {activeTab === 'gates' && (
          <>
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('gate-catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenVault={() => setActiveTab('vault')}
            />
            <StatsBar
              totalGates={gates.length}
              totalVerifications={gates.reduce((acc, g) => acc + g.totalVerifications, 0)}
              activePassesCount={verifications.length}
            />
          </>
        )}

        {/* Tab 1: Gate Catalog */}
        {activeTab === 'gates' && (
          <div id="gate-catalog-section">
            <GateCatalog
              gates={gates}
              verifications={verifications}
              onSelectGateForProof={(gate) => setSelectedGateForProof(gate)}
              onViewBadge={(rec) => setActiveBadgeRecord(rec)}
              openCreateModal={() => setIsCreateModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Encrypted Private Vault */}
        {activeTab === 'vault' && (
          <CredentialVault onVaultUpdated={refreshData} />
        )}

        {/* Tab 3: Verifier Terminal */}
        {activeTab === 'verifier' && (
          <VerifierTerminal gates={gates} verifications={verifications} />
        )}

        {/* Tab 4: Compact Smart Contract Source */}
        {activeTab === 'contract' && (
          <ContractViewer />
        )}

      </main>

      {/* Modals */}
      {selectedGateForProof && (
        <ZkProofModal
          gate={selectedGateForProof}
          vault={vault}
          onClose={() => setSelectedGateForProof(null)}
          onProofComplete={handleProofComplete}
        />
      )}

      {activeBadgeRecord && (
        <VerificationBadge
          record={activeBadgeRecord}
          onClose={() => setActiveBadgeRecord(null)}
        />
      )}

      {isCreateModalOpen && (
        <CreateGateModal
          onClose={() => setIsCreateModalOpen(false)}
          onGateCreated={refreshData}
          creatorAddress={walletAddress}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">Proofy</span>
            <span>— Midnight Network Zero-Knowledge Age & Eligibility Protocol</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 transition flex items-center gap-1"
            >
              Midnight Docs <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/nirbhay677"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 transition flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" /> nirbhay677
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
