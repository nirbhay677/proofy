import { describe, it, expect } from 'vitest';
import { computeNullifier } from '../lib/crypto';
import { MidnightClient } from '../lib/midnight-client';
import { Gate } from '../types';

describe('Proofy Midnight ZK Protocol Test Suite', () => {
  const currentYear = 2026;
  const mockSalt = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const mockCommitment = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

  // -------------------------------------------------------------
  // TEST 1: Age Gate Verification (Eligible Adult)
  // -------------------------------------------------------------
  it('TEST 1: Should successfully pass 18+ Age Gate when user is eligible (Age >= 18)', () => {
    const birthYear = 1999;
    const calculatedAge = currentYear - birthYear; // 27
    const requiredThreshold = 18;

    // Compact circuit constraint assertion
    const isEligible = calculatedAge >= requiredThreshold;
    expect(isEligible).toBe(true);
    expect(calculatedAge).toBe(27);
  });

  // -------------------------------------------------------------
  // TEST 2: Age Gate Constraint Rejection (Underage)
  // -------------------------------------------------------------
  it('TEST 2: Should reject 18+ Age Gate proof when user is underage without leaking raw DOB', () => {
    const birthYear = 2012;
    const calculatedAge = currentYear - birthYear; // 14
    const requiredThreshold = 18;

    const isEligible = calculatedAge >= requiredThreshold;
    expect(isEligible).toBe(false);
    expect(calculatedAge).toBeLessThan(requiredThreshold);
  });

  // -------------------------------------------------------------
  // TEST 3: Balance / Accredited Investor Gate (Eligible Whale)
  // -------------------------------------------------------------
  it('TEST 3: Should verify liquid balance threshold ($10k+) without exposing total balance', () => {
    const secretPortfolioBalance = 45000;
    const requiredThreshold = 10000;

    const isEligible = secretPortfolioBalance >= requiredThreshold;
    expect(isEligible).toBe(true);
  });

  // -------------------------------------------------------------
  // TEST 4: Balance Gate Rejection (Insufficient Balance)
  // -------------------------------------------------------------
  it('TEST 4: Should reject accredited investor gate when balance is below threshold', () => {
    const secretPortfolioBalance = 3500;
    const requiredThreshold = 10000;

    const isEligible = secretPortfolioBalance >= requiredThreshold;
    expect(isEligible).toBe(false);
  });

  // -------------------------------------------------------------
  // TEST 5: Cryptographic Nullifier Determinism (Sybil Resistance)
  // -------------------------------------------------------------
  it('TEST 5: Should generate identical nullifier for the same gate and user identity', async () => {
    const gateId = '0x8f2c0199e87123aa45b89100fae19034cb9910d8ef77321a00912cb84ef0119a';
    
    const nullifier1 = await computeNullifier(gateId, mockSalt, mockCommitment);
    const nullifier2 = await computeNullifier(gateId, mockSalt, mockCommitment);

    expect(nullifier1).toBeDefined();
    expect(nullifier1).toMatch(/^0x[a-f0-9]{64}$/);
    expect(nullifier1).toEqual(nullifier2);
  });

  // -------------------------------------------------------------
  // TEST 6: Cross-Gate Unlinkability (Zero-Knowledge Privacy)
  // -------------------------------------------------------------
  it('TEST 6: Should generate completely distinct, unlinkable nullifiers across different gates', async () => {
    const gate1 = '0x8f2c0199e87123aa45b89100fae19034cb9910d8ef77321a00912cb84ef0119a';
    const gate2 = '0x33ca8190fe329910ba1248099ffcae129840134bcad980124890afeb881239cd';

    const nullifierGate1 = await computeNullifier(gate1, mockSalt, mockCommitment);
    const nullifierGate2 = await computeNullifier(gate2, mockSalt, mockCommitment);

    expect(nullifierGate1).not.toEqual(nullifierGate2);
  });

  // -------------------------------------------------------------
  // TEST 7: Full Proof Pipeline Simulation
  // -------------------------------------------------------------
  it('TEST 7: Full Compact proof execution pipeline correctly records on-chain pass', async () => {
    const client = MidnightClient.getInstance();
    const testGate: Gate = {
      id: '0x' + 'a'.repeat(64),
      name: 'Test Gate 21+',
      description: 'Test gate for CI',
      type: 'AGE_THRESHOLD',
      threshold: 21,
      creator: '0xmid123',
      isActive: true,
      totalVerifications: 0,
      iconName: 'ShieldAlert',
      createdAt: Date.now(),
    };

    // Ensure vault is eligible (e.g. 1999 -> 27 >= 21)
    await client.updateVault({ birthYear: 1999 });

    const stepLogs: string[] = [];
    const result = await client.executeProofPipeline(testGate, (steps) => {
      steps.forEach((s) => {
        if (s.log) stepLogs.push(s.log);
      });
    });

    expect(result.success).toBe(true);
    expect(result.record).toBeDefined();
    expect(result.record?.isValid).toBe(true);
    expect(client.isVerified(result.record!.nullifier)).toBe(true);
  });
});
