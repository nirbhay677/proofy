export type GateType = 'AGE_THRESHOLD' | 'BALANCE_THRESHOLD' | 'CREDENTIAL_SCORE' | 'MEMBERSHIP_TIER';

export interface Gate {
  id: string;
  name: string;
  description: string;
  type: GateType;
  threshold: number;
  creator: string;
  isActive: boolean;
  totalVerifications: number;
  iconName: string;
  createdAt: number;
}

export interface UserVaultData {
  birthYear: number;
  portfolioBalance: number;
  creditScore: number;
  membershipTier: number;
  identitySalt: string;
  identityCommitment: string;
}

export interface VerificationRecord {
  nullifier: string;
  gateId: string;
  gateName: string;
  gateType: GateType;
  threshold: number;
  verifiedAt: number;
  proofHash: string;
  isValid: boolean;
  blockHeight: number;
}

export type ProofStepState = 'idle' | 'running' | 'success' | 'error';

export interface ProofStep {
  id: string;
  title: string;
  description: string;
  state: ProofStepState;
  log?: string;
}
