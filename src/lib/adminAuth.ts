import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { createAdminClient, AdminConfigError } from "@/lib/supabase/admin";

/**
 * Admin session auth — roll number + DOB password (DDMMYYYY).
 *
 * SERVER-ONLY: imports next/headers and the service-role client.
 * Never import from a client component.
 */

export const ADMIN_COOKIE = "jubaan_admin";
const SESSION_DAYS = 7;

export type AdminSummary = {
  id: string;
  roll_number: string;
  full_name: string | null;
};

/* ------------------------- login attempt rate limit ------------------------ */

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000;

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function checkRateLimit(): Promise<{ ok: boolean; retryAfterSec: number }> {
  const ip = await clientIp();
  const now = Date.now();
  const a = attempts.get(ip);
  if (!a || now > a.resetAt) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }
  if (a.count >= MAX_ATTEMPTS) {
    return { ok: false, retryAfterSec: Math.ceil((a.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

async function recordFailedAttempt(): Promise<void> {
  const ip = await clientIp();
  const now = Date.now();
  const a = attempts.get(ip);
  if (!a || now > a.resetAt) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else a.count += 1;
}

async function clearAttempts(): Promise<void> {
  const ip = await clientIp();
  attempts.delete(ip);
}

/* --------------------------------- verify ---------------------------------- */

export async function verifyAdminPassword(
  rollNumber: string,
  dobPassword: string
): Promise<AdminSummary | null> {
  const roll = rollNumber.trim();
  if (!roll || !dobPassword) return null;

  const supabase = createAdminClient(); // throws AdminConfigError if unconfigured
  const { data, error } = await supabase
    .from("admins")
    .select("id,roll_number,full_name,password_hash")
    .eq("roll_number", roll)
    .maybeSingle();

  if (error || !data) return null;
  // pgcrypto gen_salt('bf') produces bcrypt-compatible hashes ($2a$…).
  const ok = await bcrypt.compare(dobPassword, data.password_hash as string);
  if (!ok) return null;
  return { id: data.id as string, roll_number: data.roll_number as string, full_name: (data.full_name as string | null) ?? null };
}

/* --------------------------------- session --------------------------------- */

export async function createAdminSession(adminId: string): Promise<void> {
  const supabase = createAdminClient();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000).toISOString();

  const { error } = await supabase
    .from("admin_sessions")
    .insert({ token, admin_id: adminId, expires_at: expiresAt });
  if (error) throw new Error("Could not create admin session.");

  await clearAttempts();
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 3600,
  });
}

export async function getAdminSession(): Promise<AdminSummary | null> {
  let token: string | undefined;
  try {
    const jar = await cookies();
    token = jar.get(ADMIN_COOKIE)?.value;
  } catch {
    return null;
  }
  if (!token) return null;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    if (e instanceof AdminConfigError) return null;
    throw e;
  }

  const { data, error } = await supabase
    .from("admin_sessions")
    .select("token,expires_at,admins(id,roll_number,full_name)")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;
  if (new Date(data.expires_at as string).getTime() < Date.now()) {
    await supabase.from("admin_sessions").delete().eq("token", token);
    return null;
  }
  const a = data.admins as unknown as { id: string; roll_number: string; full_name: string | null } | null;
  if (!a) return null;
  return { id: a.id, roll_number: a.roll_number, full_name: a.full_name };
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) {
    try {
      const supabase = createAdminClient();
      await supabase.from("admin_sessions").delete().eq("token", token);
    } catch {
      // config missing — still clear the cookie below
    }
  }
  jar.delete(ADMIN_COOKIE);
}

/** Guard for every /admin route except /admin/login: hidden, not "unauthorized". */
export async function requireAdmin(): Promise<AdminSummary> {
  const admin = await getAdminSession();
  if (!admin) notFound();
  return admin;
}

export { recordFailedAttempt };
