"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import BodhiLeaf from "@/components/BodhiLeaf";
import { circuitSites, annualEvents } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-[100svh] flex items-end overflow-hidden">
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <img
          src="/images/hero.webp"
          alt="Mahabodhi Temple at Bodh Gaya at sunrise beneath the Bodhi tree"
          className="w-full h-[115%] object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      {/* floating leaves */}
      {!reduce && (
        <>
          <BodhiLeaf className="absolute top-[18%] left-[8%] w-14 h-16 text-gold/50 animate-drift" />
          <BodhiLeaf className="absolute top-[32%] right-[10%] w-10 h-12 text-bodhi/60 animate-drift" />
          <BodhiLeaf className="absolute top-[58%] left-[45%] w-8 h-10 text-goldsoft/40 animate-drift" />
        </>
      )}

      <motion.div style={{ y: yText, opacity: fade }} className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-28 pt-40 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-gold tracking-[0.35em] uppercase text-xs md:text-sm font-semibold mb-6"
        >
          NIT Jalandhar · The Cultural Club
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl"
        >
          Walk the <span className="text-gradient-gold">Bodhi&nbsp;Circuit</span>
          <br />
          <span className="text-cream/90">of our heritage.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-cream/75 leading-relaxed"
        >
          JUBAAN — Jharkhand, Uttar Pradesh, Bihar Association And Networks —
          is a community portal tracing the footsteps of Lord Buddha across
          the sacred lands of Bihar and Uttar Pradesh, and celebrating the
          living culture they gave the world.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/circuit"
            className="px-8 py-4 rounded-full bg-gold text-ink font-semibold tracking-wide hover:bg-goldsoft transition-all duration-300 shadow-[0_0_36px_rgba(217,164,65,0.4)] hover:shadow-[0_0_54px_rgba(217,164,65,0.55)] hover:-translate-y-0.5"
          >
            Explore the Circuit
          </Link>
          <Link
            href="/calendar"
            className="px-8 py-4 rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold transition-all duration-300 hover:-translate-y-0.5"
          >
            Events Calendar
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/70 z-10"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 4v14m0 0l-6-6m6 6l6-6" />
        </svg>
      </motion.div>
    </div>
  );
}

function Stats() {
  const stats = [
    { n: "08", label: "Sacred sites on the circuit" },
    { n: "18", label: "Annual cultural events" },
    { n: "03", label: "States, one shared heritage" },
    { n: "2500+", label: "Years of living history" },
  ];
  return (
    <section className="border-y border-gold/10 bg-coal/50">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl md:text-5xl text-gradient-gold font-semibold">{s.n}</p>
            <p className="text-muted text-sm mt-2 tracking-wide">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Idea() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
      <Reveal className="relative">
        <div className="rounded-3xl overflow-hidden border border-gold/20 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <img src="/images/canopy.webp" alt="Bodhi tree canopy in golden light" className="w-full h-[420px] md:h-[520px] object-cover hover:scale-105 transition-transform duration-[2s]" />
        </div>
        <div className="absolute -bottom-6 -right-4 md:-right-6 bg-ember border border-gold/25 rounded-2xl px-6 py-5 shadow-xl max-w-[240px]">
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
            a place to walk the Bodhi Circuit site by site, keep the club's
            festival calendar, and gather as a community that carries its
            heritage forward.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <Link href="/about" className="inline-flex items-center gap-2 text-gold font-semibold tracking-wide group">
            Read our story
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function CircuitPreview() {
  return (
    <section className="py-24 md:py-28 bg-coal/40 border-y border-gold/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="The sacred geography"
          title="Eight stops on the Bodhi Circuit"
          sub="From enlightenment at Bodh Gaya to Mahaparinirvana at Kushinagar — trace the Buddha's journey across Bihar and Uttar Pradesh."
        />
      </div>
      <div className="max-w-7xl mx-auto pl-5 md:pl-8">
        <div className="flex gap-6 overflow-x-auto pb-6 pr-5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {circuitSites.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.3)} className="snap-start shrink-0 w-[300px] md:w-[340px]">
              <Link
                href="/circuit"
                className="group block h-full rounded-3xl border border-cream/10 bg-ember/80 p-7 hover:border-gold/50 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(217,164,65,0.15)]"
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
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="text-center mt-6">
        <Link href="/circuit" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-all duration-300 font-semibold">
          Walk the full circuit <span>→</span>
        </Link>
      </div>
    </section>
  );
}

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
            <div className="group relative rounded-3xl overflow-hidden border border-cream/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-1.5 bg-ember/60">
              <div className="h-40 relative overflow-hidden">
                <img
                  src="/images/sarnath.webp"
                  alt=""
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-[1.8s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ember via-ember/40 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-ink text-[11px] font-bold tracking-widest uppercase">
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
          See the full calendar <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
    </section>
  );
}

function JoinCTA() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/hero.webp" alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>
      <div className="relative max-w-3xl mx-auto px-5 text-center">
        <Reveal>
          <BodhiLeaf className="w-14 h-16 text-gold mx-auto mb-6 animate-glow-pulse" glow />
          <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6">
            Become part of the <span className="text-gradient-gold">sangha</span>
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Create your account to RSVP for events, add gatherings to the
            community calendar, and walk with fellow travellers of the
            Bodhi Circuit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="px-10 py-4 rounded-full bg-gold text-ink font-bold tracking-wide hover:bg-goldsoft transition-all duration-300 shadow-[0_0_40px_rgba(217,164,65,0.45)] hover:-translate-y-0.5"
            >
              Join the community
            </Link>
            <Link
              href="/events"
              className="px-10 py-4 rounded-full border border-cream/30 hover:border-gold hover:text-gold transition-all duration-300"
            >
              Browse events
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Idea />
      <CircuitPreview />
      <FlagshipPreview />
      <JoinCTA />
    </>
  );
}
