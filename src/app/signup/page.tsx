import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, safeNextPath } from "@/lib/supabase/config";

export const metadata = { title: "Join — JUBAAN" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in? Don't show the form again — go where they were headed.
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { next } = await searchParams;
      redirect(safeNextPath(next) ?? "/dashboard");
    }
  }
  const { next } = await searchParams;

  return (
    <div className="pt-[72px] min-h-[90svh] flex items-center justify-center px-5 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-gold/10 blur-[140px]" />
      </div>
      <div className="relative w-full max-w-md rounded-3xl border border-cream/10 bg-coal/70 backdrop-blur p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
        <AuthForm mode="signup" next={safeNextPath(next)} />
      </div>
    </div>
  );
}
