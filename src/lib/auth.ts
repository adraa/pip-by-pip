const encoder = new TextEncoder();

export const SESSION_COOKIE = 'pbp_session';
const SESSION_DAYS = 365;

export type Learner = {
  id: string;
  name: string;
  isRecovery: boolean;
};

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Codes are meant to be typed on a phone, so they are compared case- and
 * space-insensitively. "First Light" and "first-light" are the same code.
 */
export function normaliseCode(code: string): string {
  return code.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
}

export async function hashCode(code: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`${salt}:${normaliseCode(code)}`));
  return toHex(digest);
}

async function signingKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

export async function createSessionToken(learnerId: string, secret: string): Promise<string> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${learnerId}.${expires}`;
  const signature = await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(payload));
  return `${payload}.${toHex(signature)}`;
}

export async function readSessionToken(token: string, secret: string): Promise<string | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [learnerId, expiresRaw, signature] = parts;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  const expected = await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(`${learnerId}.${expires}`));
  const expectedHex = toHex(expected);
  if (expectedHex.length !== signature.length) return null;

  // Constant-time-ish comparison; both strings are the same length here.
  let mismatch = 0;
  for (let i = 0; i < expectedHex.length; i += 1) {
    mismatch |= expectedHex.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0 ? learnerId : null;
}
