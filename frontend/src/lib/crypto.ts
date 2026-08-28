/**
 * Cryptographic utilities for Proofy Zero-Knowledge Nullifiers & Commitments
 * Built for browser Web Crypto API compatibility
 */

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateRandomHex(byteCount = 32): string {
  const array = new Uint8Array(byteCount);
  crypto.getRandomValues(array);
  return '0x' + Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes deterministic Nullifier: H(GateID || UserSalt || IdentityKey)
 * Matches the Compact contract's `persistent_hash` circuit function.
 */
export async function computeNullifier(
  gateId: string,
  userSalt: string,
  identityCommitment: string
): Promise<string> {
  const combined = `${gateId.toLowerCase()}:${userSalt.toLowerCase()}:${identityCommitment.toLowerCase()}`;
  return sha256(combined);
}

/**
 * Computes public identity commitment: H(UserPrivateKey || "PROOFY_ID")
 */
export async function computeIdentityCommitment(privateKeyOrSalt: string): Promise<string> {
  return sha256(`PROOFY_ID_COMMITMENT:${privateKeyOrSalt}`);
}

export function truncateHash(hash: string, start = 6, end = 4): string {
  if (!hash || hash.length <= start + end) return hash || '';
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
