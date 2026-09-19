"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminPassword,
  createAdminSession,
  checkRateLimit,
  recordFailedAttempt,
  destroyAdminSession,
} from "@/lib/adminAuth";
import { AdminConfigError } from "@/lib/supabase/admin";

export type LoginState = { error: string | null };

export async function loginAdmin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const roll = String(formData.get("roll") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!roll || !password) return { error: "Enter your roll number and password." };

  const rl = await checkRateLimit();
  if (!rl.ok) {
    const mins = Math.max(1, Math.ceil(rl.retryAfterSec / 60));
    return { error: `Too many attempts. Try again in about ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  try {
    const admin = await verifyAdminPassword(roll, password);
    if (!admin) {
      await recordFailedAttempt();
      return { error: "Wrong roll number or password." };
    }
    await createAdminSession(admin.id);
  } catch (e) {
    if (e instanceof AdminConfigError) {
      return { error: "Admin access isn't configured on the server yet (missing service key)." };
    }
    return { error: "Something went wrong. Please try again." };
  }
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
