"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminFormState = { error: string | null; ok: string | null };
const blank: AdminFormState = { error: null, ok: null };

function validDob(pw: string): boolean {
  return /^\d{8}$/.test(pw); // DDMMYYYY
}

export async function addAdmin(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const me = await requireAdmin();
  const roll = String(formData.get("roll") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!roll) return { ...blank, error: "Roll number is required." };
  if (!validDob(password)) return { ...blank, error: "Password must be the DOB in DDMMYYYY format (8 digits)." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("admins").insert({
    roll_number: roll,
    full_name: name || null,
    password_hash: await bcrypt.hash(password, 10),
    created_by: me.id,
  });
  if (error) {
    if (error.code === "23505") return { ...blank, error: `Roll number ${roll} is already an admin.` };
    return { ...blank, error: "Could not add admin. Try again." };
  }
  revalidatePath("/admin/admins");
  return { ...blank, ok: `${name || roll} added as admin.` };
}

export async function removeAdmin(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const me = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ...blank, error: "Missing admin id." };
  if (id === me.id) return { ...blank, error: "You cannot remove yourself." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) return { ...blank, error: "Could not remove admin. Try again." };
  revalidatePath("/admin/admins");
  return { ...blank, ok: "Admin removed." };
}

export async function resetAdminPassword(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "").trim();
  if (!id) return { ...blank, error: "Missing admin id." };
  if (!validDob(password)) return { ...blank, error: "New password must be the DOB in DDMMYYYY format (8 digits)." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("admins")
    .update({ password_hash: await bcrypt.hash(password, 10) })
    .eq("id", id);
  if (error) return { ...blank, error: "Could not reset password. Try again." };
  revalidatePath("/admin/admins");
  return { ...blank, ok: "Password reset." };
}
