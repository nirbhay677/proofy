import { Gate, UserVaultData, VerificationRecord, ProofStep } from '../types';
import { generateRandomHex, computeNullifier, computeIdentityCommitment, sha256 } from './crypto';

const INITIAL_GATES: Gate[] = [
  {
    id: '0x8f2c0199e87123aa45b89100fae19034cb9910d8ef77321a00912cb84ef0119a',
    name: '18+ Age Eligibility Gate',
    description: 'Proves user is 18 years or older without revealing date of birth or birth year.',
    type: 'AGE_THRESHOLD',
    threshold: 18,
    creator: '0xmid199201994a8bc983',
    isActive: true,
    totalVerifications: 142,
    iconName: 'ShieldAlert',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: '0x33ca8190fe329910ba1248099ffcae129840134bcad980124890afeb881239cd',
    name: '21+ Regulated Age Gate',
    description: 'Compliant ZK proof for age-restricted DeFi protocols and high-stakes prediction markets.',
    type: 'AGE_THRESHOLD',
    threshold: 21,
    creator: '0xmid883910332810aa72',
    isActive: true,
    totalVerifications: 89,
    iconName: 'Sparkles',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '0x491823901caef908123bcada981034feab01923841098efcad981023948bcae1',
    name: 'Accredited VIP Investor ($10k+)',
    description: 'Prove liquid portfolio exceeds $10,000 without revealing total balance or wallet contents.',
    type: 'BALANCE_THRESHOLD',
    threshold: 10000,
    creator: '0xmidvip992810293847',
    isActive: true,
    totalVerifications: 56,
    iconName: 'Coins',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '0x99201934baefca81290384fe90123984caebfa01923841029384918230912834',
    name: 'DeFi Credit Score 700+',
    description: 'Zero-knowledge proof of creditworthiness exceeding 700 for uncollateralized lending.',
    type: 'CREDENTIAL_SCORE',
    threshold: 700,
    creator: '0xmidlend10293849102',
    isActive: true,
    totalVerifications: 34,
    iconName: 'Award',
    createdAt: Date.now() - 86400000 * 1,
  },
];

const VAULT_STORAGE_KEY = 'proofy_user_vault_v1';
const LEDGER_STORAGE_KEY = 'proofy_midnight_ledger_v1';
const GATES_STORAGE_KEY = 'proofy_gates_v1';

// In-memory fallback for Node.js / CI / Vitest test runners
const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  } else {
    memoryStore[key] = value;
  }
}

export class MidnightClient {
  private static instance: MidnightClient;
  private currentYear = 2026;

  private constructor() {
    this.initDefaultStorage();
  }

  public static getInstance(): MidnightClient {
    if (!MidnightClient.instance) {
      MidnightClient.instance = new MidnightClient();
    }
    return MidnightClient.instance;
  }

  private initDefaultStorage(): void {
    if (!safeGetItem(VAULT_STORAGE_KEY)) {
      const defaultSalt = generateRandomHex(16);
      const defaultVault: UserVaultData = {
        birthYear: 1999, // 27 years old in 2026
        portfolioBalance: 25000, // $25k
        creditScore: 740,
        membershipTier: 3,
        identitySalt: defaultSalt,
        identityCommitment: '',
      };
      safeSetItem(VAULT_STORAGE_KEY, JSON.stringify(defaultVault));
      // Calculate async commitment
      computeIdentityCommitment(defaultSalt).then((com) => {
        defaultVault.identityCommitment = com;
        safeSetItem(VAULT_STORAGE_KEY, JSON.stringify(defaultVault));
      });
    }

    if (!safeGetItem(GATES_STORAGE_KEY)) {
      safeSetItem(GATES_STORAGE_KEY, JSON.stringify(INITIAL_GATES));
    }

    if (!safeGetItem(LEDGER_STORAGE_KEY)) {
      safeSetItem(LEDGER_STORAGE_KEY, JSON.stringify([]));
    }
  }

  public getVault(): UserVaultData {
    const raw = safeGetItem(VAULT_STORAGE_KEY);
    if (!raw) return { birthYear: 1999, portfolioBalance: 25000, creditScore: 740, membershipTier: 3, identitySalt: '0x123', identityCommitment: '0xabc' };
    return JSON.parse(raw);
  }

  public async updateVault(data: Partial<UserVaultData>): Promise<UserVaultData> {
    const current = this.getVault();
    const updated = { ...current, ...data };
    if (data.identitySalt && data.identitySalt !== current.identitySalt) {
      updated.identityCommitment = await computeIdentityCommitment(updated.identitySalt);
    }
    safeSetItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  public getGates(): Gate[] {
    const raw = safeGetItem(GATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_GATES;
  }

  public async createGate(
    name: string,
    description: string,
    type: Gate['type'],
    threshold: number,
    creatorAddress: string
  ): Promise<Gate> {
    const gateId = await sha256(`GATE:${name}:${type}:${threshold}:${Date.now()}`);
    const newGate: Gate = {
      id: gateId,
      name,
      description,
      type,
      threshold,
      creator: creatorAddress,
      isActive: true,
      totalVerifications: 0,
      iconName: type === 'AGE_THRESHOLD' ? 'ShieldAlert' : type === 'BALANCE_THRESHOLD' ? 'Coins' : 'Award',
      createdAt: Date.now(),
    };

    const gates = this.getGates();
    gates.unshift(newGate);
    safeSetItem(GATES_STORAGE_KEY, JSON.stringify(gates));
    return newGate;
  }

  public getVerifications(): VerificationRecord[] {
    const raw = safeGetItem(LEDGER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  public isVerified(nullifier: string): boolean {
    const list = this.getVerifications();
    return list.some((v) => v.nullifier.toLowerCase() === nullifier.toLowerCase());
  }

  public getVerificationByNullifier(nullifier: string): VerificationRecord | undefined {
    const list = this.getVerifications();
    return list.find((v) => v.nullifier.toLowerCase() === nullifier.toLowerCase());
  }

  /**
   * Simulates Midnight's Compact ZK Proof execution pipeline
   */
  public async executeProofPipeline(
    gate: Gate,
    onStepUpdate: (steps: ProofStep[]) => void
  ): Promise<{ success: boolean; record?: VerificationRecord; error?: string }> {
    const vault = this.getVault();

    const steps: ProofStep[] = [
      {
        id: '1',
        title: '1. Resolve Private Witness (Local)',
        description: 'Fetching private credentials securely from encrypted local vault without network transmission.',
        state: 'running',
      },
      {
        id: '2',
        title: '2. Compact Constraint Evaluation',
        description: `Asserting Zero-Knowledge constraint: Value >= ${gate.threshold}.`,
        state: 'idle',
      },
      {
        id: '3',
        title: '3. Synthesize ZK-SNARK Proof',
        description: 'Generating cryptographic proof (Halo2 / Compact ZK proof system).',
        state: 'idle',
      },
      {
        id: '4',
        title: '4. Compute Unlinkable Nullifier',
        description: 'Deriving deterministic nullifier H(GateID, Salt, IdentityKey) for Sybil resistance.',
        state: 'idle',
      },
      {
        id: '5',
        title: '5. Submit to Midnight Ledger',
        description: 'Broadcasting zero-knowledge transaction to on-chain verifier contract.',
        state: 'idle',
      },
    ];

    onStepUpdate([...steps]);
    await new Promise((r) => setTimeout(r, 600));

    // Step 1: Witness Evaluation
    let secretValue = 0;
    if (gate.type === 'AGE_THRESHOLD') {
      secretValue = vault.birthYear;
      steps[0].log = `Witness resolved: Birth Year = [SECRET_PROTECTED], Year = ${this.currentYear}`;
    } else if (gate.type === 'BALANCE_THRESHOLD') {
      secretValue = vault.portfolioBalance;
      steps[0].log = `Witness resolved: Balance = [SECRET_PROTECTED]`;
    } else if (gate.type === 'CREDENTIAL_SCORE') {
      secretValue = vault.creditScore;
      steps[0].log = `Witness resolved: Score = [SECRET_PROTECTED]`;
    } else {
      secretValue = vault.membershipTier;
      steps[0].log = `Witness resolved: Tier = [SECRET_PROTECTED]`;
    }
    steps[0].state = 'success';
    steps[1].state = 'running';
    onStepUpdate([...steps]);
    await new Promise((r) => setTimeout(r, 700));

    // Step 2: Constraint Checking
    let isEligible = false;
    if (gate.type === 'AGE_THRESHOLD') {
      const calculatedAge = this.currentYear - secretValue;
      isEligible = calculatedAge >= gate.threshold;
      steps[1].log = isEligible
        ? `Constraint Passed: Calculated Age (${calculatedAge}) >= Threshold (${gate.threshold})`
        : `Constraint Failed: Calculated Age (${calculatedAge}) < Threshold (${gate.threshold})`;
    } else {
      isEligible = secretValue >= gate.threshold;
      steps[1].log = isEligible
        ? `Constraint Passed: Secret Value meets required threshold (${gate.threshold})`
        : `Constraint Failed: Secret Value is below required threshold (${gate.threshold})`;
    }

    if (!isEligible) {
      steps[1].state = 'error';
      onStepUpdate([...steps]);
      return {
        success: false,
        error: `Verification Failed: Your private credential does not satisfy the requirement for "${gate.name}" (Threshold: ${gate.threshold}).`,
      };
    }

    steps[1].state = 'success';
    steps[2].state = 'running';
    onStepUpdate([...steps]);
    await new Promise((r) => setTimeout(r, 800));

    // Step 3: ZK Proof Synthesis
    const proofHash = await sha256(`PROOF_PI_${gate.id}_${Date.now()}_${vault.identitySalt}`);
    steps[2].log = `Proof Synthesized: ${proofHash.slice(0, 18)}... (Bytes: 384, Constraints: 1,420)`;
    steps[2].state = 'success';
    steps[3].state = 'running';
    onStepUpdate([...steps]);
    await new Promise((r) => setTimeout(r, 600));

    // Step 4: Nullifier Computation
    const nullifier = await computeNullifier(gate.id, vault.identitySalt, vault.identityCommitment);
    steps[3].log = `Nullifier: ${nullifier.slice(0, 20)}...`;
    steps[3].state = 'success';
    steps[4].state = 'running';
    onStepUpdate([...steps]);
    await new Promise((r) => setTimeout(r, 700));

    // Step 5: Ledger Submission
    const verifications = this.getVerifications();
    const existingIndex = verifications.findIndex((v) => v.nullifier === nullifier);

    const record: VerificationRecord = {
      nullifier,
      gateId: gate.id,
      gateName: gate.name,
      gateType: gate.type,
      threshold: gate.threshold,
      verifiedAt: Date.now(),
      proofHash,
      isValid: true,
      blockHeight: Math.floor(1048200 + Math.random() * 5000),
    };

    if (existingIndex >= 0) {
      verifications[existingIndex] = record;
    } else {
      verifications.unshift(record);
    }
    safeSetItem(LEDGER_STORAGE_KEY, JSON.stringify(verifications));

    // Increment gate counter
    const gates = this.getGates();
    const gIndex = gates.findIndex((g) => g.id === gate.id);
    if (gIndex >= 0) {
      gates[gIndex].totalVerifications += 1;
      safeSetItem(GATES_STORAGE_KEY, JSON.stringify(gates));
    }

    steps[4].log = `Confirmed on Midnight Block #${record.blockHeight}. Zero private data exposed.`;
    steps[4].state = 'success';
    onStepUpdate([...steps]);

    return { success: true, record };
  }
}
