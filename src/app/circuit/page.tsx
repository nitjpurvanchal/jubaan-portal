"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import BodhiLeaf from "@/components/BodhiLeaf";
import { circuitSites } from "@/lib/data";

export default function CircuitPage() {
  const reduce = useReducedMotion();

  return (
    <div className="pt-[72px]">
      {/* header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/sarnath.webp" alt="Dhamek Stupa at Sarnath at dusk" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
        </div>
        {!reduce && (
          <>
            <BodhiLeaf className="absolute top-24 left-[6%] w-12 h-14 text-gold/40 animate-drift" />
            <BodhiLeaf className="absolute bottom-16 right-[8%] w-16 h-[72px] text-bodhi/40 animate-drift" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-5"
          >
            The sacred geography
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="font-display text-5xl md:text-7xl leading-tight mb-6"
          >
            The <span className="text-gradient-gold">Bodhi Circuit</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-cream/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            In the 6th century BCE, a prince of the Shakya clan walked these
            plains of Bihar and Uttar Pradesh — and left behind the most
            travelled pilgrimage route in the Buddhist world. Eight sites.
            One awakening.
          </motion.p>
        </div>
      </section>

      {/* timeline of sites */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-10">
        <div className="relative">
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent md:-translate-x-1/2" />
          {circuitSites.map((s, i) => {
            const left = i % 2 === 0;
            return (
              <div key={s.slug} className="relative md:grid md:grid-cols-2 md:gap-14 mb-14 md:mb-20">
                {/* node */}
                <div className="absolute left-5 md:left-1/2 top-8 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-gold shadow-[0_0_18px_rgba(217,164,65,0.9)] ring-4 ring-ink" />
                </div>
                <Reveal
                  className={`pl-14 md:pl-0 ${left ? "md:pr-4 md:text-right" : "md:col-start-2 md:pl-4"}`}
                >
                  <div className={`rounded-3xl border border-cream/10 bg-ember/70 p-7 md:p-9 hover:border-gold/40 transition-colors duration-500 ${left ? "" : ""}`}>
                    <div className={`flex items-center gap-3 mb-4 ${left ? "md:justify-end" : ""}`}>
                      <span className="font-display text-4xl text-gold/30">{String(i + 1).padStart(2, "0")}</span>
                      <span className="px-3 py-1 rounded-full bg-bodhideep/60 border border-bodhi/40 text-bodhi text-[11px] font-bold tracking-widest uppercase">
                        {s.state}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl mb-2 text-cream">{s.name}</h2>
                    <p className="text-goldsoft italic font-display text-lg mb-4">{s.tagline}</p>
                    <p className="text-cream/65 leading-relaxed mb-5">{s.description}</p>
                    <ul className={`space-y-2 mb-5 ${left ? "md:text-right" : ""}`}>
                      {s.significance.map((pt) => (
                        <li key={pt} className="text-sm text-cream/70 flex gap-2 md:justify-inherit justify-start">
                          {!left && <span className="text-gold mt-0.5">✦</span>}
                          <span>{pt}</span>
                          {left && <span className="text-gold mt-0.5 hidden md:inline">✦</span>}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs tracking-[0.2em] uppercase text-muted">
                      Best time to visit · <span className="text-goldsoft">{s.bestTime}</span>
                    </p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* closing */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 pb-8 text-center">
        <SectionHeading
          kicker="The journey continues"
          title="Every festival is a pilgrimage"
          sub="JUBAAN's calendar carries this geography into campus life — Chhath on the ghats of memory, Braj's Holi, Bihar Diwas. Walk the circuit with us, one celebration at a time."
        />
        <Reveal className="flex flex-wrap justify-center gap-4">
          <a href="/calendar" className="px-8 py-4 rounded-full bg-gold text-ink font-semibold hover:bg-goldsoft transition-all duration-300 shadow-[0_0_36px_rgba(217,164,65,0.4)]">
            View the calendar
          </a>
          <a href="/signup" className="px-8 py-4 rounded-full border border-cream/30 hover:border-gold hover:text-gold transition-all duration-300">
            Join JUBAAN
          </a>
        </Reveal>
      </section>
    </div>
  );
}
