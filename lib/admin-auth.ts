import { createHmac, timingSafeEqual } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { adminCredentials } from "@/db/schema";
import { ensureAdminCredentialSchema } from "@/lib/database-setup";
import { hashPassword, verifyPassword } from "@/lib/password-hash";

export const ADMIN_SESSION_COOKIE = "wu_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const ADMIN_CREDENTIAL_ID = "primary";

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

async function getStoredCredential() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const [credential] = await getDb().select().from(adminCredentials).where(eq(adminCredentials.id, ADMIN_CREDENTIAL_ID)).limit(1);
    return credential ?? null;
  } catch (error) {
    const databaseError = error as { code?: string; cause?: { code?: string } };
    if (databaseError.code === "42P01" || databaseError.cause?.code === "42P01") return null;
    throw error;
  }
}

function makeSession(email: string, sessionVersion: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt, sessionVersion })).toString("base64url");
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export async function createAdminSession(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredEmail || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) return null;
  const normalizedEmail = email.trim().toLowerCase();
  if (!safeEqual(normalizedEmail, configuredEmail)) return null;
  const credential = await getStoredCredential();
  const valid = credential ? await verifyPassword(password, credential.passwordHash) : Boolean(configuredPassword && safeEqual(password, configuredPassword));
  return valid ? makeSession(normalizedEmail, credential?.sessionVersion ?? "env") : null;
}

export async function changeAdminPassword(email: string, currentPassword: string, newPassword: string) {
  const credential = await getStoredCredential();
  const valid = credential
    ? await verifyPassword(currentPassword, credential.passwordHash)
    : Boolean(process.env.ADMIN_PASSWORD && safeEqual(currentPassword, process.env.ADMIN_PASSWORD));
  if (!valid) return null;

  await ensureAdminCredentialSchema();
  const passwordHash = await hashPassword(newPassword);
  const sessionVersion = crypto.randomUUID();
  const db = getDb();
  const updatedAt = new Date().toISOString();
  const rows = credential
    ? await db.update(adminCredentials).set({ passwordHash, sessionVersion, updatedAt }).where(and(eq(adminCredentials.id, ADMIN_CREDENTIAL_ID), eq(adminCredentials.sessionVersion, credential.sessionVersion))).returning({ id: adminCredentials.id })
    : await db.insert(adminCredentials).values({ id: ADMIN_CREDENTIAL_ID, passwordHash, sessionVersion, updatedAt }).onConflictDoNothing().returning({ id: adminCredentials.id });
  return rows.length ? makeSession(email, sessionVersion) : null;
}

export async function getAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; expiresAt: number; sessionVersion?: string };
    if (session.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    if (!process.env.ADMIN_EMAIL || !safeEqual(session.email, process.env.ADMIN_EMAIL.trim().toLowerCase())) return null;
    const credential = await getStoredCredential();
    if (!safeEqual(session.sessionVersion ?? "env", credential?.sessionVersion ?? "env")) return null;
    return { email: session.email, displayName: process.env.ADMIN_NAME?.trim() || session.email };
  } catch {
    return null;
  }
}
