export const ADMIN_SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getUsername() {
  return process.env.ADMIN_USERNAME?.trim() ?? "";
}

function getPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "dev-insecure-admin-secret"
  );
}

function timingSafeEqualString(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i]! ^ bufB[i]!;
  }
  return diff === 0;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) {
    binary += String.fromCharCode(view[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmacSign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(signature);
}

export function hasAdminCredentialsConfigured(): boolean {
  return Boolean(getUsername() && getPassword());
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const expectedUser = getUsername();
  const expectedPass = getPassword();
  if (!expectedUser || !expectedPass) return false;
  return (
    timingSafeEqualString(username.trim(), expectedUser) &&
    timingSafeEqualString(password, expectedPass)
  );
}

export async function createAdminSessionToken(
  username: string = getUsername()
): Promise<string> {
  const exp = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = toBase64Url(
    new TextEncoder().encode(JSON.stringify({ u: username, exp }))
  );
  const signature = await hmacSign(payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmacSign(payload);
  if (!timingSafeEqualString(signature, expected)) return false;

  try {
    const json = new TextDecoder().decode(fromBase64Url(payload));
    const data = JSON.parse(json) as { u?: string; exp?: number };
    if (!data.u || typeof data.exp !== "number") return false;
    if (data.exp < Date.now()) return false;
    if (!timingSafeEqualString(data.u, getUsername())) return false;
    return true;
  } catch {
    return false;
  }
}
