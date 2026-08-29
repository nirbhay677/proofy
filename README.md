# Proofy — Zero-Knowledge Age & Eligibility Gate on Midnight

[![Live Demo](https://img.shields.io/badge/Live%20Demo-proofy--six.vercel.app-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://proofy-six.vercel.app)
[![CI Pipeline](https://github.com/nirbhay677/proofy/actions/workflows/ci.yml/badge.svg)](https://github.com/nirbhay677/proofy/actions)
![Network](https://img.shields.io/badge/Network-Midnight%20ZK-6366f1)
![Smart Contract](https://img.shields.io/badge/Language-Compact%20v0.20-14b8a6)
![Tests Passing](https://img.shields.io/badge/Tests-7%20Passed-brightgreen)


**Proofy** is a privacy-first Zero-Knowledge eligibility gate built on the **Midnight Network** using the **Compact** smart contract language. It allows users to cryptographically prove age (18+, 21+), financial accreditation ($10k+ liquid balance), credit scores, and DAO membership tiers without ever exposing birthdates, account balances, or personal identities.

---

## 🌟 What This Project Demonstrates

- **Midnight Dual-State Architecture**: Separates private client-side witness evaluation from public ledger state.
- **Zero-Knowledge Threshold Proofs**: Proves `secret >= threshold` in Compact without revealing the underlying secret value.
- **Sybil-Resistant Nullifiers**: Deterministic hashing prevents double-claiming while preserving cross-gate unlinkability.
- **Encrypted Local Vault**: Client-side credential management with zero network leakage.
- **Third-Party Verifier Terminal**: Query on-chain nullifier passes in real time.
- **Automated CI/CD Pipeline**: GitHub Actions running unit tests (Vitest) and production builds.

---

## 🔒 Privacy Model: What an Observer Can & Cannot Learn

| Data Point | What an On-Chain Observer **CAN** Learn | What an On-Chain Observer **CANNOT** Learn |
|---|:---:|:---:|
| **Date of Birth / Birth Year** | ❌ None | 🔒 **Completely Hidden** *(Witness evaluated locally)* |
| **Exact Age** | ❌ None | 🔒 **Completely Hidden** *(Only learns `age >= threshold`)* |
| **Liquid Bank / Wallet Balance** | ❌ None | 🔒 **Completely Hidden** *(Raw balance never touches ledger)* |
| **Credit / DeFi Score** | ❌ None | 🔒 **Completely Hidden** |
| **User Wallet Identity / Address** | ❌ Unlinked | 🔒 **Completely Hidden** *(Protected by deterministic nullifier)* |
| **Cross-Gate Linkability** | ❌ Unlinkable | 🔒 **Completely Hidden** *(Unique salt per gate)* |
| **Target Gate ID & Threshold** | ✅ **Visible** *(Public configuration)* | — |
| **Verification Validity** | ✅ **Visible** *(Pass = `true`)* | — |
| **Proof Timestamp / Block Height**| ✅ **Visible** *(On-chain timestamp)* | — |
| **Cryptographic Nullifier** | ✅ **Visible** *(Single-use hash prevents replay)* | — |

---

## 🛠️ Tech Stack

- **Smart Contract**: Midnight Compact (v0.20+)
- **ZK Proof System**: Halo2 / Compact ZK Runtime
- **Frontend**: React 18, Vite 6, TypeScript
- **Styling**: Tailwind CSS
- **Cryptography**: Browser Web Crypto API (SHA-256 / Deterministic Nullifiers)
- **Testing**: Vitest (7 unit tests passing)
- **CI/CD**: GitHub Actions

---

## 📂 Project Structure

- `contracts/proofy.compact`: Compact smart contract defining public ledgers, private witnesses, and ZK circuits
- `contracts/compiler.config.json`: Compact compiler configuration
- `frontend/src/components/CredentialVault.tsx`: Encrypted browser vault with quick test profiles
- `frontend/src/components/GateCatalog.tsx`: Filterable catalog of active ZK eligibility gates
- `frontend/src/components/ZkProofModal.tsx`: 5-step visual ZK proof synthesizer modal
- `frontend/src/components/VerificationBadge.tsx`: Verifiable digital ZK pass with QR code and JSON receipt
- `frontend/src/components/VerifierTerminal.tsx`: Portal for third-party dApps to query on-chain nullifiers
- `frontend/src/components/ContractViewer.tsx`: In-app Compact smart contract source code browser
- `frontend/src/lib/midnight-client.ts`: Midnight Compact runtime simulator and ledger state machine
- `frontend/src/lib/crypto.ts`: Cryptographic hashing and deterministic nullifier derivation
- `frontend/src/test/proofy.test.ts`: Vitest test suite with 7 passing tests
- `.github/workflows/ci.yml`: Automated CI/CD pipeline for tests and build verification

---

### ✅ Test Suite Output (7/7 Passing):

```text
 RUN  v3.2.7 C:/Users/n7282/.gemini/antigravity/scratch/proofy/frontend

 ✓ src/test/proofy.test.ts > Proofy Midnight ZK Protocol Test Suite > TEST 1: Should successfully pass 18+ Age Gate when user is eligible (Age >= 18) 1ms
 ✓ src/test/proofy.test.ts > Proofy Midnight ZK Protocol Test Suite > TEST 2: Should reject 18+ Age Gate proof when user is underage without leaking raw DOB 0ms
 ✓ src/test/proofy.test.ts > Proofy Midnight ZK Protocol Test Suite > TEST 3: Should verify liquid balance threshold ($10k+) without exposing total balance 0ms
 ✓ src/test/proofy.test.ts > Proofy Midnight ZK Protocol Test Suite > TEST 4: Should reject accredited investor gate when balance is below threshold 0ms
 ✓ src/test/proofy.test.ts > Proofy Midnight ZK Protocol Test Suite > TEST 5: Should generate identical nullifier for the same gate and user identity 6ms
 ✓ src/test/proofy.test.ts > Proofy Midnight ZK Protocol Test Suite > TEST 6: Should generate completely distinct, unlinkable nullifiers across different gates 1ms
 ✓ src/test/proofy.test.ts > Proofy Midnight ZK Protocol Test Suite > TEST 7: Full Compact proof execution pipeline correctly records on-chain pass 3464ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  15:45:48
   Duration  4.47s
```

- CI-CD: <img width="1897" height="903" alt="Screenshot 2026-08-29 155520" src="https://github.com/user-attachments/assets/336f4558-7ec1-49d0-8e8d-8fee49a6a318" />
- **Live Demo**: [https://proofy-six.vercel.app](https://proofy-six.vercel.app)
