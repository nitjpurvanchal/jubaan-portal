import { redirect } from "next/navigation";
import Image from "next/image";
import AuthForm from "@/components/AuthForm";
import EmberCanvas from "@/components/EmberCanvas";
import BodhiLeaf from "@/components/BodhiLeaf";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, safeNextPath } from "@/lib/supabase/config";

export const metadata = { title: "Sign in — JUBAAN" };

export default async function LoginPage({
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
  const nextPath = safeNextPath(next);
  return (
    <div className="pt-[72px] min-h-[100svh] flex relative overflow-hidden">
      {/* art panel */}
      <div className="hidden lg:flex relative w-[46%] xl:w-[52%] flex-col justify-between overflow-hidden border-r border-gold/10">
        <img
          src="/images/canopy.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink/95" />
        <EmberCanvas className="absolute inset-0 h-full w-full" density={0.6} interactive={false} />

        <div className="relative p-12 xl:p-16">
          <Image
            src="/logo/jubaan-logo-512.png"
            alt="JUBAAN — embroidered club logo"
            width={88}
            height={88}
            className="rounded-full object-cover ring-2 ring-gold/50 shadow-[0_0_40px_rgba(217,164,65,0.4)]"
          />
        </div>

        <div className="relative p-12 xl:p-16">
          <BodhiLeaf className="w-10 h-12 text-gold/70 mb-5" glow />
          <p className="font-display text-3xl xl:text-4xl leading-snug text-cream max-w-md">
            The sangha gathers where the{" "}
            <span className="text-gradient-gold">lamps are lit</span>.
          </p>
          <p className="font-display italic text-goldsoft/90 mt-5 text-lg">
            “हमारी विरासत, हमारी जुबानी”
          </p>
          <div className="mt-8 flex gap-8 text-sm text-cream/60">
            <span><strong className="text-gold font-display text-xl block">08</strong> sacred sites</span>
            <span><strong className="text-gold font-display text-xl block">18</strong> annual events</span>
            <span><strong className="text-gold font-display text-xl block">03</strong> states, one home</span>
          </div>
        </div>
      </div>

      {/* form panel */}
      <div className="relative flex-1 flex items-center justify-center px-5 py-16">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-gold/10 blur-[140px]" />
        </div>
        <EmberCanvas className="absolute inset-0 h-full w-full opacity-70" density={0.3} interactive={false} bokeh={false} />

        <div className="relative w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo/jubaan-logo-512.png"
              alt="JUBAAN — embroidered club logo"
              width={84}
              height={84}
              className="rounded-full object-cover ring-2 ring-gold/50 shadow-[0_0_36px_rgba(217,164,65,0.4)]"
            />
          </div>
          <div className="glass rounded-[2rem] p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <AuthForm mode="login" next={nextPath} />
          </div>
          <p className="text-center text-xs text-muted mt-6 tracking-wide">
            Protected by the Bodhi tree · NIT Jalandhar
          </p>
        </div>
      </div>
    </div>
  );
}
