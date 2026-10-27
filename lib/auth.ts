import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { getDb, getUserFromTokenHash, type User } from "@/lib/db";

export const SESSION_COOKIE = "pulsefit_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [salt, expectedHex] = encoded.split(":");
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createSession(userId: string): string {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  ).toISOString();
  getDb()
    .prepare(
      `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)`,
    )
    .run(tokenHash, userId, expiresAt);
  return token;
}

export function deleteSession(token: string | undefined): void {
  if (!token) return;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  getDb().prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(tokenHash);
}

export function getUserFromToken(token: string | undefined): User | undefined {
  if (!token) return undefined;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  return getUserFromTokenHash(tokenHash);
}

export function readSessionToken(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;
  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  if (!entry) return undefined;
  return decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1));
}

export function sessionCookie(token: string, clear = false): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAge = clear ? 0 : SESSION_MAX_AGE_SECONDS;
  return `${SESSION_COOKIE}=${clear ? "" : encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function newUserId(): string {
  return randomUUID();
}
