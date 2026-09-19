import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import BodhiLeaf from "@/components/BodhiLeaf";
import OnboardingForm from "./OnboardingForm";
import type { Profile } from "@/lib/profile";

export const metadata = { title: "Complete your profile — JUBAAN" };

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
        <div className="max-w-md text-center rounded-3xl border border-gold/25 bg-coal/70 p-10">
          <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-5" glow />
          <h1 className="font-display text-3xl mb-3">Supabase not connected</h1>
          <p className="text-cream/65 leading-relaxed">
            Onboarding needs your Supabase project keys. Add them to
            <code className="text-goldsoft"> .env.local </code> and redeploy.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("id,full_name,email,avatar_url,home_state,created_at,roll_number,branch,semester,phone,home_district,interests,onboarding_completed")
    .eq("id", user.id)
    .single();

  const profile = (data ?? null) as Profile | null;
  if (profile?.onboarding_completed) redirect("/dashboard");

  return (
    <div className="pt-[72px] min-h-[90svh] flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-gold/10 blur-[140px]" />
      </div>
      <div className="relative text-center mb-8">
        <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-2">Welcome to the sangha</p>
        <h1 className="font-display text-4xl md:text-5xl">
          Let&rsquo;s <span className="text-gradient-gold">know you</span>
        </h1>
        <p className="text-muted text-sm mt-3 max-w-md mx-auto">
          A few steps to complete your member profile — so the circuit feels like home.
        </p>
      </div>
      <OnboardingForm profile={profile} />
    </div>
  );
}
