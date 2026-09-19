"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import BodhiLeaf from "./BodhiLeaf";

const links = [
  { href: "/", label: "Home" },
  { href: "/circuit", label: "Bodhi Circuit" },
  { href: "/calendar", label: "Calendar" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, [pathname]);

  const signOut = async () => {
    if (!isSupabaseConfigured()) return;
    await createClient().auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-xl border-b border-gold/15 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BodhiLeaf className="w-8 h-10 text-gold transition-transform duration-500 group-hover:rotate-12" glow />
          <div className="leading-tight">
            <p className="font-display font-bold text-xl tracking-wide text-cream">
              JUBAAN
            </p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted">
              Bodhi Circuit
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
                pathname === l.href ? "text-gold" : "text-cream/70 hover:text-cream"
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-4 right-4 -bottom-0.5 h-px bg-gold"
                />
              )}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`px-4 py-2 text-sm tracking-wide transition-colors ${
                  pathname === "/dashboard" ? "text-gold" : "text-cream/70 hover:text-cream"
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="ml-2 px-5 py-2.5 text-sm rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-all duration-300"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-5 py-2.5 text-sm rounded-full bg-gold text-ink font-semibold hover:bg-goldsoft transition-all duration-300 shadow-[0_0_24px_rgba(217,164,65,0.35)]"
            >
              Join / Sign in
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-cream"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink/95 backdrop-blur-xl border-b border-gold/15 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {[...links, ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : [])].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-base border-b border-cream/5 ${
                    pathname === l.href ? "text-gold" : "text-cream/80"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <button onClick={signOut} className="py-3 text-left text-base text-saffron">
                  Sign out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-3 mb-2 px-5 py-3 text-center rounded-full bg-gold text-ink font-semibold"
                >
                  Join / Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
