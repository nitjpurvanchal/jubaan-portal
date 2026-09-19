"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/hooks/useSession";
import LogoMark from "@/components/LogoMark";

const links = [
  { href: "/", label: "Home" },
  { href: "/circuit", label: "Bodhi Circuit" },
  { href: "/calendar", label: "Calendar" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

const discover = [
  { href: "/legends", label: "Legends", desc: "Bharat Ratna icons of our three states" },
  { href: "/languages", label: "Languages", desc: "Boli, sahitya aur lok-bhasha" },
  { href: "/heritage", label: "Heritage", desc: "Sacred sites, art & living crafts" },
  { href: "/volunteer", label: "Volunteer", desc: "Seva, roles & certificates" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  // Single source of truth: the shared auth session. Updates instantly on
  // sign-in/sign-out anywhere in the app — no reload, no stale "Join".
  const { user, loading: sessionLoading, signOut: providerSignOut } = useSession();
  const dropTimer = useRef<number | null>(null);
  const [prevPath, setPrevPath] = useState(pathname);

  // close menus when the route changes (render-time state adjustment)
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
    setDropOpen(false);
  }

  useEffect(() => {
    // rAF-gated: scroll events fire far more often than frames, and React
    // already bails on identical state — only commit when the value flips.
    let raf = 0;
    let last: boolean | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const v = window.scrollY > 24;
        if (v !== last) {
          last = v;
          setScrolled(v);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dropTimer.current) window.clearTimeout(dropTimer.current);
    };
  }, []);

  const openDrop = () => {
    if (dropTimer.current) window.clearTimeout(dropTimer.current);
    setDropOpen(true);
  };
  const closeDrop = () => {
    if (dropTimer.current) window.clearTimeout(dropTimer.current);
    dropTimer.current = window.setTimeout(() => setDropOpen(false), 140);
  };

  const signOut = async () => {
    await providerSignOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const userInitial =
    (user?.user_metadata?.full_name as string | undefined)?.trim()?.[0] ??
    user?.email?.[0]?.toUpperCase() ??
    "J";

  const inDiscover = discover.some((d) => pathname === d.href);
  const mobileLinks = [
    ...links,
    ...discover,
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-ink/85 backdrop-blur-xl border-b border-gold/15 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-b from-ink/70 to-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" aria-label="JUBAAN home">
          <LogoMark size={42} shine glow={false} />
          <div className="leading-tight">
            <p className="font-display font-bold text-xl tracking-[0.12em] text-cream">
              JUBAAN
            </p>
            <p className="text-[10px] tracking-[0.28em] uppercase text-gold/80">
              Bodhi Circuit
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.slice(0, 4).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative px-3.5 py-2 text-sm tracking-wide transition-colors ${
                pathname === l.href ? "text-gold" : "text-cream/70 hover:text-cream"
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold to-transparent"
                />
              )}
            </Link>
          ))}

          {/* Discover dropdown */}
          <div
            className="relative"
            onMouseEnter={openDrop}
            onMouseLeave={closeDrop}
          >
            <button
              onClick={() => setDropOpen(!dropOpen)}
              aria-expanded={dropOpen}
              aria-haspopup="true"
              className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm tracking-wide transition-colors ${
                inDiscover ? "text-gold" : "text-cream/70 hover:text-cream"
              }`}
            >
              Discover
              <motion.svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                animate={{ rotate: dropOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
              {inDiscover && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold to-transparent"
                />
              )}
            </button>
            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-gold/20 bg-ink/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                >
                  {discover.map((d) => (
                    <Link
                      key={d.href}
                      href={d.href}
                      className={`group block rounded-xl px-4 py-3 transition-colors hover:bg-gold/10 ${
                        pathname === d.href ? "bg-gold/10" : ""
                      }`}
                    >
                      <span className={`flex items-center justify-between text-sm font-semibold ${pathname === d.href ? "text-gold" : "text-cream group-hover:text-goldsoft"}`}>
                        {d.label}
                        <span className="text-gold/0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold/70" aria-hidden="true">→</span>
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">{d.desc}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/about"
            className={`relative px-3.5 py-2 text-sm tracking-wide transition-colors ${
              pathname === "/about" ? "text-gold" : "text-cream/70 hover:text-cream"
            }`}
          >
            About
            {pathname === "/about" && (
              <motion.span
                layoutId="nav-underline"
                className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold to-transparent"
              />
            )}
          </Link>

          {sessionLoading ? (
            <span
              className="ml-2 inline-block w-28 h-10 rounded-full bg-cream/10 animate-pulse"
              aria-hidden="true"
            />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className={`px-3.5 py-2 text-sm tracking-wide transition-colors ${
                  pathname === "/dashboard" ? "text-gold" : "text-cream/70 hover:text-cream"
                }`}
              >
                Dashboard
              </Link>
              <span
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-saffron font-display text-sm font-bold text-ink shadow-[0_0_16px_rgba(217,164,65,0.4)]"
                title={user.email ?? "Signed in"}
                aria-label={`Signed in as ${user.email ?? "member"}`}
              >
                {userInitial}
              </span>
              <button
                onClick={signOut}
                className="ml-1 px-5 py-2.5 text-sm rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-all duration-300 active:scale-95"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="ml-2 btn-gold px-6 py-2.5 text-sm active:scale-95">
              Join / Sign in
            </Link>
          )}
        </div>

        <button
          className="lg:hidden p-2 text-cream"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <motion.svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.25 }}
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </motion.svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-ink/95 backdrop-blur-xl border-b border-gold/15 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
              {mobileLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-3 text-base border-b border-cream/5 ${
                      pathname === l.href ? "text-gold" : "text-cream/80"
                    }`}
                  >
                    {l.label}
                    <span className="text-gold/50">→</span>
                  </Link>
                </motion.div>
              ))}
              {sessionLoading ? (
                <span className="mt-3 mb-2 block h-12 rounded-full bg-cream/10 animate-pulse" aria-hidden="true" />
              ) : user ? (
                <button onClick={signOut} className="py-3 text-left text-base text-saffron">
                  Sign out ({user.email})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-3 mb-2 btn-gold px-5 py-3 text-center"
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
