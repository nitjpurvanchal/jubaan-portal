import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for the hidden admin panel.
 *
 * SERVER-ONLY — never import this from a client component. The service role
 * key bypasses RLS, which is exactly what the admin registers need, but it
 * must never reach the browser.
 */
export class AdminConfigError extends Error {
  constructor() {
    super(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to your environment " +
        "(Vercel → Project Settings → Environment Variables) and redeploy. " +
        "The admin panel cannot run without it."
    );
    this.name = "AdminConfigError";
  }
}

export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new AdminConfigError();
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
