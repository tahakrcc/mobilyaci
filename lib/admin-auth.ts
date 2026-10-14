import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "wu_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSession(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) return null;
  const normalizedEmail = email.trim().toLowerCase();
  if (!safeEqual(normalizedEmail, configuredEmail) || !safeEqual(password, configuredPassword)) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = Buffer.from(JSON.stringify({ email: normalizedEmail, expiresAt })).toString("base64url");
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export async function getAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; expiresAt: number };
    if (session.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    if (!process.env.ADMIN_EMAIL || !safeEqual(session.email, process.env.ADMIN_EMAIL.trim().toLowerCase())) return null;
    return { email: session.email, displayName: process.env.ADMIN_NAME?.trim() || session.email };
  } catch {
    return null;
  }
}
