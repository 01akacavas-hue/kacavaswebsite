/**
 * Session gate for the whole site.
 *
 * The password is checked only in the route handler. This module signs a
 * token with that password as the HMAC key and later checks the token.
 * The proxy (`proxy.ts`, Next.js 16's middleware) only calls `isSessionValid`.
 *
 * Unlock stores that token in an httpOnly session cookie. The cookie has no
 * `Max-Age` and no `Expires`, so the browser keeps it for the current session
 * and drops it when the session ends. A new visit has to enter the password
 * again. Moving between pages in the same session does not ask again. Lock
 * clears the cookie immediately.
 *
 * `v1` tokens were the old cookies that stayed on disk for 30 days. They no
 * longer unlock the site. The signed token still has an absolute replay cap
 * so a copied cookie cannot be reused forever. That cap is not the cookie's
 * lifetime.
 *
 * If `SITE_PASSWORD` is missing or empty, the password is the public
 * placeholder `kacavas-local`. That is for local development. Set a real
 * value in Vercel before sharing the deployment. The README documents this.
 */

export const SESSION_COOKIE = "kacavas_places"
export const PASSWORD_FALLBACK = "kacavas-local"

/** Replay bound for a signed token. Not written onto the cookie as `Max-Age`. */
export const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const VERSION = "v2"

export type UnlockCookieOptions = {
  httpOnly: true
  secure: boolean
  sameSite: "lax"
  path: "/"
}

export type LockCookieOptions = UnlockCookieOptions & {
  maxAge: 0
  expires: Date
}

/** Cookie attributes for a successful unlock. Omitting `maxAge` and `expires` makes a session cookie. */
export function unlockCookieOptions(secure: boolean): UnlockCookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  }
}

/** Cookie attributes for Lock. `Max-Age=0` and an expiry in the past delete the cookie immediately. */
export function lockCookieOptions(secure: boolean): LockCookieOptions {
  return {
    ...unlockCookieOptions(secure),
    maxAge: 0,
    expires: new Date(0),
  }
}

export function getSitePassword(): string {
  const fromEnv = process.env.SITE_PASSWORD
  if (typeof fromEnv === "string" && fromEnv.length > 0) return fromEnv
  return PASSWORD_FALLBACK
}

export function isUsingPasswordFallback(): boolean {
  const fromEnv = process.env.SITE_PASSWORD
  return typeof fromEnv !== "string" || fromEnv.length === 0
}

const PUBLIC_PATHS = new Set([
  "/gate",
  "/api/unlock",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/icon",
  "/apple-icon",
  "/health",
  "/healthz",
  "/api/health",
])

/** Routes that must answer before a visitor has the cookie. Everything else is locked. */
export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true
  return pathname === "/_next/static" || pathname.startsWith("/_next/static/")
}

export async function passwordsMatch(input: string, secret: string): Promise<boolean> {
  if (input.length === 0 || input.length > 256) return false
  const [left, right] = await Promise.all([sha256(input), sha256(secret)])
  return timingSafeEqual(left, right)
}

export async function createSessionValue(now = Date.now()): Promise<string> {
  const expiresAt = now + TOKEN_MAX_AGE_SECONDS * 1000
  const payload = `${VERSION}.${expiresAt}`
  const signature = await hmacHex(payload, getSitePassword())
  return `${payload}.${signature}`
}

export async function isSessionValid(
  value: string | undefined | null,
  now = Date.now(),
): Promise<boolean> {
  if (!value) return false
  const parts = value.split(".")
  if (parts.length !== 3) return false
  const [version, expiresAtRaw, signature] = parts
  if (version !== VERSION || !expiresAtRaw || !signature) return false
  if (!/^\d+$/.test(expiresAtRaw)) return false
  const expiresAt = Number(expiresAtRaw)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false
  const provided = hexToBytes(signature)
  if (!provided || provided.length !== 32) return false
  const expectedHex = await hmacHex(`${VERSION}.${expiresAtRaw}`, getSitePassword())
  const expected = hexToBytes(expectedHex)
  if (!expected) return false
  return timingSafeEqual(provided, expected)
}

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return new Uint8Array(digest)
}

async function hmacHex(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  return bytesToHex(new Uint8Array(signature))
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = ""
  for (const byte of bytes) hex += byte.toString(16).padStart(2, "0")
  return hex
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null
  const bytes = new Uint8Array(hex.length / 2)
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }
  return mismatch === 0
}
