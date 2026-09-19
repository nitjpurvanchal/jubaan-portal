"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import BodhiLeaf from "@/components/BodhiLeaf";
import EmberCanvas from "@/components/EmberCanvas";
import LogoMark from "@/components/LogoMark";
import FallingLeaves from "@/components/FallingLeaves";
import { circuitSites, annualEvents } from "@/lib/data";
import { useSession } from "@/hooks/useSession";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------- hero ---------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "24%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);

  return (
    <div ref={ref} className="relative min-h-[108svh] flex items-center overflow-hidden">
      {/* backdrop: slow ken-burns + scroll parallax */}
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0">
        <img
          src="/images/hero.webp"
          alt=""
          aria-hidden="true"
          className={`w-full h-[115%] object-cover ${reduce ? "" : "animate-hero-zoom"}`}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/35 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,12,7,0.55)_100%)]" />

      {/* living atmosphere */}
      <EmberCanvas className="pointer-events-none absolute inset-0 h-full w-full" density={1} />

      <motion.div
        style={{ y: yContent, opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-36 pb-24 w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease }}
          className="flex justify-center"
        >
          <LogoMark size={200} orbit glow />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease }}
          className="mt-8 text-gold tracking-[0.4em] uppercase text-xs md:text-sm font-semibold"
        >
          NIT Jalandhar · The Cultural Club
        </motion.p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.04] mt-5 max-w-5xl mx-auto">
          {["Walk the", "Bodhi Circuit", "of our heritage."].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${i === 1 ? "text-shimmer-gold" : "text-cream"}`}
                initial={{ y: reduce ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease }}
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-cream/75 leading-relaxed"
        >
          JUBAAN — Jharkhand, Uttar Pradesh, Bihar Association And Networks —
          a living portal of festivals, language and memory, rooted in the
          sacred lands where the Buddha walked.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="mt-4 font-display italic text-xl md:text-2xl text-goldsoft"
        >
          “हमारी विरासत, हमारी जुबानी”
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/circuit" className="btn-gold px-9 py-4 text-base">
            Explore the Circuit <span aria-hidden="true">→</span>
          </Link>
          <Link href="/calendar" className="btn-ghost px-9 py-4 text-base">
            Events Calendar
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        animate={reduce ? {} : { y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gold/70"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 4v14m0 0l-6-6m6 6l6-6" />
        </svg>
      </motion.div>
    </div>
  );
}

/* --------------------------------- stats ---------------------------------- */

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  const display = reduce ? (inView ? to : 0) : val;

  return (
    <span ref={ref}>
      {String(display).padStart(2, "0")}
      {suffix}
    </span>
  );
}

function Stats() {
  const stats = [
    { n: 8, suffix: "", label: "Sacred sites on the circuit" },
    { n: 18, suffix: "", label: "Annual cultural events" },
    { n: 3, suffix: "", label: "States, one shared heritage" },
    { n: 2500, suffix: "+", label: "Years of living history" },
  ];
  return (
    <section className="relative border-y border-gold/10 bg-coal/50 overflow-hidden">
      <EmberCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-60" density={0.25} interactive={false} bokeh={false} />
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-5xl md:text-6xl text-gradient-gold font-semibold">
              <CountUp to={s.n} suffix={s.suffix} />
            </p>
            <p className="text-muted text-sm mt-3 tracking-wide">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ about teaser ------------------------------ */

function Idea() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-14 items-center">
      <Reveal className="relative">
        <div className="rounded-3xl overflow-hidden border border-gold/20 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <img
            src="/images/canopy.webp"
            alt="Bodhi tree canopy in golden light"
            className="w-full h-[420px] md:h-[520px] object-cover hover:scale-105 transition-transform duration-[2s]"
          />
        </div>
        <div className="absolute -bottom-6 -right-2 md:-right-6 glass rounded-2xl px-6 py-5 shadow-xl max-w-[250px] border-gold/25">
          <p className="font-display italic text-lg text-goldsoft">“हमारी विरासत,</p>
          <p className="font-display italic text-lg text-goldsoft">हमारी जुबानी”</p>
        </div>
      </Reveal>
      <div>
        <Reveal>
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-4">The idea</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            One club, <span className="text-gradient-gold">three states</span>, a civilisation of stories.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-cream/70 text-lg leading-relaxed mb-5">
            JUBAAN began as the cultural club of NIT Jalandhar for students from
            Jharkhand, Uttar Pradesh and Bihar — but its roots run far deeper
            than a campus. This is the land where the Buddha was born into
            legend, attained enlightenment, turned the Wheel of Dharma, and
            passed into Mahaparinirvana.
          </p>
          <p className="text-cream/70 text-lg leading-relaxed mb-8">
            This portal is our digital <em className="text-goldsoft not-italic font-display">vihara</em> —
            a place to walk the Bodhi Circuit site by site, keep the club&apos;s
            festival calendar, and gather as a community that carries its
            heritage forward.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <Link href="/about" className="btn-ghost px-7 py-3 text-sm">
            Read our story <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- circuit preview ---------------------------- */

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 12);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CircuitPreview() {
  return (
    <section className="relative py-24 md:py-32 bg-coal/40 border-y border-gold/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="The sacred geography"
          title="Eight stops on the Bodhi Circuit"
          sub="From enlightenment at Bodh Gaya to Mahaparinirvana at Kushinagar — trace the Buddha's journey across Bihar and Uttar Pradesh."
        />
      </div>
      <div className="max-w-7xl mx-auto pl-5 md:pl-8">
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-6 pr-5 snap-x snap-mandatory">
          {circuitSites.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.3)} className="snap-start shrink-0 w-[300px] md:w-[340px]">
              <TiltCard>
                <Link
                  href="/circuit"
                  className="group block h-full rounded-3xl border border-cream/10 bg-ember/80 p-7 hover:border-gold/50 transition-colors duration-500 hover:shadow-[0_20px_60px_rgba(217,164,65,0.15)]"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-display text-5xl text-gold/25 group-hover:text-gold/60 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <BodhiLeaf className="w-9 h-11 text-gold/40 group-hover:text-gold group-hover:rotate-12 transition-all duration-500" />
                  </div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-bodhi mb-2">{s.state}</p>
                  <h3 className="font-display text-2xl mb-2 text-cream group-hover:text-goldsoft transition-colors">{s.name}</h3>
                  <p className="text-sm text-muted italic mb-3">{s.tagline}</p>
                  <p className="text-sm text-cream/60 leading-relaxed line-clamp-3">{s.description}</p>
                  <p className="mt-4 text-gold/70 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Walk this stop →
                  </p>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="text-center mt-6 flex flex-wrap justify-center gap-4">
        <Link href="/circuit" className="btn-ghost px-8 py-3.5 text-sm font-semibold">
          Walk the full circuit <span aria-hidden="true">→</span>
        </Link>
        <Link href="/circuit#map" className="btn-gold px-8 py-3.5 text-sm">
          Explore the map <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ----------------------------- flagship preview --------------------------- */

const cardArt = ["/images/sarnath.webp", "/images/canopy.webp", "/images/hero.webp"];

function FlagshipPreview() {
  const flagships = annualEvents.filter((e) => e.flagship).slice(0, 6);
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
      <SectionHeading
        kicker="Through the year"
        title="Flagship celebrations"
        sub="The high-traction anchor events of the JUBAAN calendar — from Chhath's folk songs to the colours of Braj."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flagships.map((e, i) => (
          <Reveal key={e.title} delay={(i % 3) * 0.08}>
            <div className="group relative rounded-3xl overflow-hidden border border-cream/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-1.5 bg-ember/60 h-full">
              <div className="h-40 relative overflow-hidden">
                <img
                  src={cardArt[i % cardArt.length]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-[1.8s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ember via-ember/40 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-ink text-[11px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(217,164,65,0.5)]">
                  Flagship
                </span>
              </div>
              <div className="p-6">
                <p className="text-gold/80 text-xs tracking-[0.2em] uppercase mb-2">
                  {new Date(e.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h3 className="font-display text-xl mb-2 group-hover:text-goldsoft transition-colors">{e.title}</h3>
                <p className="text-sm text-muted">{e.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link href="/calendar" className="inline-flex items-center gap-2 text-gold font-semibold tracking-wide group">
          See the full calendar <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ----------------------------- calendar preview --------------------------- */

function CelebratePreview() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = annualEvents
    .filter((e) => new Date(e.date + "T00:00:00") >= today)
    .slice(0, 3);

  return (
    <section className="relative py-24 md:py-32 bg-coal/40 border-y border-gold/10 overflow-hidden">
      <EmberCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-50" density={0.3} interactive={false} bokeh={false} />
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <Reveal>
            <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-4">How we celebrate</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              A year of <span className="text-gradient-gold">festivals</span>, not just dates.
            </h2>
            <p className="text-cream/70 text-lg leading-relaxed mb-8 max-w-lg">
              Every JUBAAN celebration is a small homecoming — folk songs at
              Chhath ghat, Braj&apos;s colours at Holi Milan, tribal drums on
              Foundation Day. Our calendar keeps the whole year of rituals,
              food, language and theatre in one living place.
            </p>
            <Link href="/calendar" className="btn-gold px-8 py-3.5 text-sm">
              Open the calendar <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
        <div className="space-y-4">
          {upcoming.map((e, i) => {
            const d = new Date(e.date + "T00:00:00");
            return (
              <Reveal key={e.title} delay={i * 0.1}>
                <Link
                  href="/calendar"
                  className="group flex items-center gap-5 glass rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-bold text-gold leading-none">
                      {d.getDate()}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      {d.toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg group-hover:text-goldsoft transition-colors truncate">
                      {e.title}
                    </p>
                    <p className="text-sm text-muted truncate">{e.note}</p>
                  </div>
                  <span className="ml-auto text-gold/60 group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            );
          })}
          {upcoming.length === 0 && (
            <p className="text-muted">The new year&apos;s calendar is being woven — check back soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- join cta -------------------------------- */

const JOIN_TRACKS = [
  {
    track: "volunteer",
    title: "Join as a Volunteer",
    desc: "On-ground seva — discipline, stage logistics, hospitality, registrations.",
    accent: "group-hover:border-bodhi/60",
    dot: "bg-bodhi",
  },
  {
    track: "creative",
    title: "Join as a Creative",
    desc: "Act, dance, sing, write poetry, paint — take the stage or shape our look.",
    accent: "group-hover:border-saffron/60",
    dot: "bg-saffron",
  },
  {
    track: "member",
    title: "Join as a Member",
    desc: "Belong to every celebration and grow into your role over time.",
    accent: "group-hover:border-gold/60",
    dot: "bg-gold",
  },
] as const;

function JoinCTA() {
  const reduce = useReducedMotion();
  const { user, loading: sessionLoading } = useSession();

  const trackHref = (track: string) =>
    user
      ? `/volunteer?track=${track}`
      : `/login?next=${encodeURIComponent(`/volunteer?track=${track}`)}`;

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/hero.webp" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>
      <EmberCanvas className="pointer-events-none absolute inset-0 h-full w-full" density={0.7} />
      <div className="relative max-w-4xl mx-auto px-5 text-center">
        <Reveal>
          <div className={`flex justify-center mb-8 ${reduce ? "" : "animate-float-y"}`}>
            <LogoMark size={120} glow />
          </div>
          <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-4">
            {user ? "Welcome back to the sangha" : "Become part of the sangha"}
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6">
            {user ? (
              <>Choose your <span className="text-gradient-gold">path</span></>
            ) : (
              <>Walk with <span className="text-gradient-gold">us</span></>
            )}
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {user
              ? "Pick how you want to serve — your profile is preloaded, your role is assigned instantly."
              : "Pick a path to begin — you'll sign in first, then your profile is preloaded automatically."}
          </p>

          {sessionLoading ? (
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-40 rounded-3xl bg-cream/5 border border-cream/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              {JOIN_TRACKS.map((t) => (
                <Link
                  key={t.track}
                  href={trackHref(t.track)}
                  className={`group rounded-3xl border border-cream/12 bg-coal/60 backdrop-blur p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${t.accent}`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${t.dot} mb-4`} aria-hidden="true" />
                  <span className="block font-display text-xl text-cream mb-2 group-hover:text-goldsoft transition-colors">
                    {t.title}
                  </span>
                  <span className="block text-sm text-cream/55 leading-relaxed mb-4">{t.desc}</span>
                  <span className="text-sm font-semibold text-gold">
                    Begin <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {user ? (
              <Link href="/dashboard" className="btn-ghost px-10 py-4 text-base">
                Go to your dashboard
              </Link>
            ) : (
              <Link href="/events" className="btn-ghost px-10 py-4 text-base">
                Browse events
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <FallingLeaves />
      <Hero />
      <Stats />
      <Idea />
      <CircuitPreview />
      <FlagshipPreview />
      <CelebratePreview />
      <JoinCTA />
    </>
  );
}
