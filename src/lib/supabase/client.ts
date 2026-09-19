import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Single shared browser client for the whole tab. Sharing one instance is
// what makes sign-in/sign-out propagate instantly to every component:
// onAuthStateChange listeners (Navbar, join CTAs, RSVP buttons…) all live
// on this client, so a signInWithPassword in one place updates all of them.
let browserClient: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return browserClient;
}
