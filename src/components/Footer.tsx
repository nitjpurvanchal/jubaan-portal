import Link from "next/link";
import BodhiLeaf from "./BodhiLeaf";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-coal/60 mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <BodhiLeaf className="w-9 h-11 text-gold" glow />
            <div>
              <p className="font-display font-bold text-2xl">JUBAAN</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted">
                Bodhi Circuit Portal
              </p>
            </div>
          </div>
          <p className="text-muted text-sm leading-relaxed max-w-md">
            JUBAAN — Jharkhand Uttar Pradesh Bihar Association And Networks —
            the cultural club of NIT Jalandhar. A community portal celebrating
            heritage, anchored on the sacred Bodhi Circuit of Lord Buddha.
          </p>
          <p className="font-display italic text-goldsoft/80 mt-4">
            “हमारी विरासत, हमारी जुबानी”
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-4">Explore</p>
          <ul className="space-y-2.5 text-sm text-cream/70">
            <li><Link href="/circuit" className="hover:text-gold transition-colors">Bodhi Circuit</Link></li>
            <li><Link href="/calendar" className="hover:text-gold transition-colors">Events Calendar</Link></li>
            <li><Link href="/events" className="hover:text-gold transition-colors">All Events</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">About JUBAAN</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-4">Community</p>
          <ul className="space-y-2.5 text-sm text-cream/70">
            <li><Link href="/signup" className="hover:text-gold transition-colors">Become a member</Link></li>
            <li><Link href="/login" className="hover:text-gold transition-colors">Sign in</Link></li>
            <li><Link href="/dashboard" className="hover:text-gold transition-colors">My dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} JUBAAN — The Cultural Club of NIT Jalandhar</p>
          <p>Cultural · Heritage · Literary · Regional Arts</p>
        </div>
      </div>
    </footer>
  );
}
