import Link from "next/link";
import BodhiLeaf from "./BodhiLeaf";
import LogoMark from "./LogoMark";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/social";

const explore = [
  { href: "/circuit", label: "Bodhi Circuit" },
  { href: "/calendar", label: "Events Calendar" },
  { href: "/events", label: "All Events" },
  { href: "/about", label: "About JUBAAN" },
];

const discover = [
  { href: "/legends", label: "Legends" },
  { href: "/languages", label: "Languages" },
  { href: "/heritage", label: "Heritage" },
  { href: "/volunteer", label: "Volunteer" },
];

const community = [
  { href: "/signup", label: "Become a member" },
  { href: "/login", label: "Sign in" },
  { href: "/dashboard", label: "My dashboard" },
  { href: WHATSAPP_URL, label: "Join our WhatsApp group", external: true },
  { href: INSTAGRAM_URL, label: "Follow us on Instagram", external: true },
];

type LinkItem = { href: string; label: string; external?: boolean };

function LinkCol({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <div>
      <p className="text-xs tracking-[0.25em] uppercase text-gold mb-5">{title}</p>
      <ul className="space-y-3 text-sm text-cream/70">
        {items.map((l) =>
          l.external ? (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-gold transition-colors duration-300"
              >
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.href}>
              <Link href={l.href} className="link-underline hover:text-gold transition-colors duration-300">
                {l.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-coal/60 mt-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[320px] rounded-full bg-gold/8 blur-[120px]"
      />
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-5">
            <LogoMark size={60} shine={false} glow={false} />
            <div>
              <p className="font-display font-bold text-2xl tracking-[0.1em]">JUBAAN</p>
              <p className="text-[10px] tracking-[0.28em] uppercase text-gold/80">
                Bodhi Circuit Portal
              </p>
            </div>
          </div>
          <p className="text-muted text-sm leading-relaxed max-w-md">
            JUBAAN — Jharkhand Uttar Pradesh Bihar Association And Networks —
            the cultural club of NIT Jalandhar. A community portal celebrating
            heritage, anchored on the sacred Bodhi Circuit of Lord Buddha.
          </p>
          <p className="font-display italic text-goldsoft/90 mt-4 text-lg">
            “हमारी विरासत, हमारी जुबानी”
          </p>
        </div>
        <LinkCol title="Explore" items={explore} />
        <LinkCol title="Discover" items={discover} />
        <div>
          <LinkCol title="Community" items={community} />
          <BodhiLeaf className="w-8 h-10 text-gold/40 mt-6 transition-transform duration-500 hover:rotate-12" />
        </div>
      </div>
      <div className="relative border-t border-cream/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} JUBAAN — The Cultural Club of NIT Jalandhar</p>
          <p className="tracking-[0.2em] uppercase">Cultural · Heritage · Literary · Regional Arts</p>
        </div>
      </div>
    </footer>
  );
}
