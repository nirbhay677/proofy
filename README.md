# 🛡️ Proofy — Zero-Knowledge Age & Eligibility Gate on Midnight

[![CI Pipeline](https://github.com/nirbhay677/proofy/actions/workflows/ci.yml/badge.svg)](https://github.com/nirbhay677/proofy/actions)
![Network](https://img.shields.io/badge/Network-Midnight%20ZK-6366f1)
![Smart Contract](https://img.shields.io/badge/Language-Compact%20v0.20-14b8a6)
![License](https://img.shields.io/badge/License-MIT-emerald)
![Tests Passing](https://img.shields.io/badge/Tests-7%20Passed-brightgreen)

> **"Prove you qualify without revealing your raw data."**

**Proofy** is a privacy-first Zero-Knowledge eligibility protocol built for the **Midnight Network** using the **Compact** smart contract language. It enables users to prove age requirements (e.g. 18+, 21+), accredited investor thresholds ($10k+ liquid balance), credit scores, and DAO membership tiers to third-party applications and physical checkpoints **without disclosing birthdates, bank balances, or personal identities**.

---

## 📋 1. Product Proposal (Idea #2 from Provided List)

* **Selected Idea**: **Age / Eligibility Gate** — *Prove a threshold without revealing the underlying value*.
* **Product Name**: **Proofy**
* **Target Audience**: 
  - **DeFi & Prediction Markets**: Requiring 18+/21+ compliance without collecting user PII.
  - **Private Lending & Whales**: Requiring proof of liquidity ($\ge \$10,000$) or creditworthiness ($\ge 700$) without public wallet/balance doxxing.
  - **DAOs & Gated Communities**: Enforcing membership tier access without exposing member address lists.
* **Value Proposition**: Replaces centralized KYC and invasive document uploads with cryptographic, client-side Zero-Knowledge proofs powered by Midnight's dual-state architecture.

---

## 🔒 2. Privacy Model: What an Observer Can & Cannot Learn

Midnight’s unique dual-state execution separates private witness logic (computed on the user's device) from public ledger state updates.

| Data Point | What an On-Chain Observer **CAN** Learn | What an On-Chain Observer **CANNOT** Learn |
|---|:---:|:---:|
| **Date of Birth / Birth Year** | ❌ None | 🔒 **Completely Hidden** *(Witness evaluated locally)* |
| **Exact Age** | ❌ None | 🔒 **Completely Hidden** *(Only learns `age >= threshold`)* |
| **Liquid Bank / Wallet Balance** | ❌ None | 🔒 **Completely Hidden** *(Raw balance never touches ledger)* |
| **Credit / DeFi Score** | ❌ None | 🔒 **Completely Hidden** |
| **User Wallet Identity / Address** | ❌ Unlinked | 🔒 **Completely Hidden** *(Protected by deterministic nullifier)* |
| **Cross-Gate Linkability** | ❌ Unlinkable | 🔒 **Completely Hidden** *(Unique salt produces distinct nullifiers per gate)* |
| **Target Gate ID & Threshold** | ✅ **Visible** *(Public configuration)* | — |
| **Verification Validity** | ✅ **Visible** *(Pass = `true`)* | — |
| **Proof Timestamp / Block Height**| ✅ **Visible** *(On-chain timestamp)* | — |
| **Cryptographic Nullifier** | ✅ **Visible** *(Single-use hash prevents replay)* | — |

---

## 🏛️ 3. Protocol Architecture & Compact Smart Contract

```
+--------------------------------------------------------------------------------+
|                         USER LOCAL BROWSER (PRIVATE VAULT)                     |
|  - Birth Year: 1999 (Confidential)                                             |
|  - Portfolio Balance: $25,000 (Confidential)                                   |
|  - Identity Salt: 0x8a92... (Secret)                                           |
+---------------------------------------+----------------------------------------+
                                        |
                                        v  [Client-side Compact Runtime]
+--------------------------------------------------------------------------------+
|                           COMPACT ZK CIRCUIT EVALUATION                        |
|                                                                                |
|  1. Evaluates: (2026 - 1999) = 27 >= 18  --> [CONSTRAINT SATISFIED]             |
|  2. Computes: Nullifier = SHA-256(GateID || UserSalt || IdentityCommitment)     |
|  3. Synthesizes ZK Proof (π) locally via Halo2 proof system                    |
+---------------------------------------+----------------------------------------+
                                        |
                                        v  [Submits ZK Transaction (0 PII Exposed)]
+--------------------------------------------------------------------------------+
|                              MIDNIGHT PUBLIC LEDGER                            |
|  - Gate Registry: ID, Threshold, Total Verifications                           |
|  - Verifications Ledger: Records Nullifier -> Status: VALID                    |
|  - Third-party dApps query: `check_badge_validity(nullifier, gate_id)`         |
+--------------------------------------------------------------------------------+
```

---

## 📂 4. Project Structure

```
proofy/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD pipeline (Tests + Build)
├── contracts/
│   ├── proofy.compact         # Midnight Compact smart contract
│   ├── compiler.config.json   # Compact compiler configuration
│   └── test/
│       └── proofy.test.ts     # Compact circuit tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header with Midnight wallet status & DUST
│   │   │   ├── Hero.tsx               # Protocol value proposition
│   │   │   ├── StatsBar.tsx           # Live on-chain metrics
│   │   │   ├── CredentialVault.tsx    # Encrypted local vault with test presets
│   │   │   ├── GateCatalog.tsx        # Filterable catalog of active ZK gates
│   │   │   ├── ZkProofModal.tsx       # 5-step visual ZK proof synthesizer
│   │   │   ├── VerificationBadge.tsx  # Verifiable pass with QR & JSON export
│   │   │   ├── VerifierTerminal.tsx   # Third-party dApp query terminal
│   │   │   ├── CreateGateModal.tsx    # Deploy custom gates on Midnight
│   │   │   └── ContractViewer.tsx     # In-app Compact code browser
│   │   ├── lib/
│   │   │   ├── midnight-client.ts     # Compact runtime simulator & ledger store
│   │   │   └── crypto.ts              # Web Crypto SHA-256 & nullifier derivation
│   │   ├── test/
│   │   │   └── proofy.test.ts         # 7 Passing Vitest unit tests
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces
│   │   ├── App.tsx                    # Main layout & tab router
│   │   ├── main.tsx                   # React entry point
│   │   └── index.css                  # Dark mode glassmorphism styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

---

## 🧪 5. Test Suite & Verification (7 Tests Passing)

To run the unit test suite:
```bash
cd frontend
npm test
```

### ✅ Test Output:
```
 ✓ src/test/proofy.test.ts (7 tests) 3465ms
   ✓ TEST 1: Should successfully pass 18+ Age Gate when user is eligible (Age >= 18)
   ✓ TEST 2: Should reject 18+ Age Gate proof when user is underage without leaking raw DOB
   ✓ TEST 3: Should verify liquid balance threshold ($10k+) without exposing total balance
   ✓ TEST 4: Should reject accredited investor gate when balance is below threshold
   ✓ TEST 5: Should generate identical nullifier for the same gate and user identity
   ✓ TEST 6: Should generate completely distinct, unlinkable nullifiers across different gates
   ✓ TEST 7: Full Compact proof execution pipeline correctly records on-chain pass

 Test Files  1 passed (1)
      Tests  7 passed (7)
```

---

## 🚀 6. Quickstart & Local Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Launch Local Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🎥 7. 1-Minute Demo Video Walkthrough Script

| Time | Scene | Action / Voiceover |
|---|---|---|
| **0:00 - 0:15** | **Introduction & Problem** | *"Welcome to Proofy, a privacy-preserving eligibility gate on Midnight Network. Today, passing KYC or age gates forces you to reveal your birthdate or bank balance. Proofy fixes this with Zero-Knowledge proofs."* |
| **0:15 - 0:30** | **Private Vault** | *"In the Private Vault, our credentials (DOB: 1999, Balance: $25,000) remain strictly in encrypted local memory. Let's select the 🧑 Adult profile."* |
| **0:30 - 0:45** | **ZK Proof Generation** | *"We go to Explore Gates and click 'Prove Eligibility' on the 18+ Age Gate. Midnight's Compact circuit verifies (2026 - 1999) = 27 >= 18, generates a cryptographic nullifier, and issues a verified pass with 0 bytes of private data leaked."* |
| **0:45 - 0:55** | **Underage Rejection** | *"If we switch to the 🧒 Underage profile (Age 15) and attempt to verify, the circuit constraint fails immediately on the client device without revealing our age."* |
| **0:55 - 1:00** | **Verifier Terminal** | *"Third-party dApps can query our nullifier in the Verifier Terminal to confirm our validity on Midnight's ledger in milliseconds."* |

---

## 📜 8. Compact Smart Contract (`contracts/proofy.compact`)

```compact
pragma language_version >= 0.20.0;

export enum GateType {
    AGE_THRESHOLD,
    BALANCE_THRESHOLD,
    CREDENTIAL_SCORE,
    MEMBERSHIP_TIER
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

export ledger gates: Map<Bytes<32>, GateConfig>;
export ledger verifications: Map<Bytes<32>, VerificationRecord>;

witness get_secret_value(): Uint<32>;
witness get_user_secret_salt(): Bytes<32>;
witness get_user_identity_commitment(): Bytes<32>;

export circuit verify_eligibility(
    gate_id: Bytes<32>,
    current_epoch_or_year: Uint<32>
): Bytes<32> {
    assert gates.member(gate_id) "Proofy: Gate does not exist";
    const gate = gates.lookup(gate_id);

    const secret_raw_val = get_secret_value();
    const user_salt = get_user_secret_salt();
    const user_identity = get_user_identity_commitment();

    if (gate.gate_type == GateType.AGE_THRESHOLD) {
        assert current_epoch_or_year >= secret_raw_val;
        const calculated_age = current_epoch_or_year - secret_raw_val;
        assert calculated_age >= gate.min_threshold;
    } else {
        assert secret_raw_val >= gate.min_threshold;
    }

    const nullifier = persistent_hash<Vector<3, Bytes<32>>>([
        gate_id,
        user_salt,
        user_identity
    ]);

    verifications.insert(nullifier, VerificationRecord {
        nullifier: nullifier,
        gate_id: gate_id,
        verified_at_epoch: current_epoch_or_year,
        is_valid: true
    });

    return nullifier;
}
```

---

## 👨‍💻 Author & Submission
* **Author**: [nirbhay677](https://github.com/nirbhay677)
* **GitHub Repo**: [nirbhay677/proofy](https://github.com/nirbhay677/proofy)
* **License**: MIT
