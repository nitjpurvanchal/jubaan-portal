"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import { heritageSites, heritageStates } from "@/lib/heritage";
import { useReducedMotion } from "framer-motion";

export default function HeritagePage() {
  const [filter, setFilter] = useState<(typeof heritageStates)[number] | "All">("All");
  const reduce = useReducedMotion();
  const visible =
    filter === "All" ? heritageSites : heritageSites.filter((s) => s.state === filter);

  return (
    <div className="pt-[72px]">
      {/* hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {!reduce && (
          <>
            <BodhiLeaf className="absolute top-24 left-[6%] w-12 h-14 text-gold/30 animate-drift" />
            <BodhiLeaf className="absolute bottom-16 right-[8%] w-16 h-[72px] text-bodhi/30 animate-drift" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-5"
          >
            Beyond the Bodhi Circuit
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="font-display text-5xl md:text-7xl leading-tight mb-6"
          >
            Heritage in <span className="text-gradient-gold">stone & story</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-cream/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Mauryan caves and Mughal tombs, terracotta temples and living
            ghats, sacred groves and thundering falls — the built and living
            heritage of Bihar, Uttar Pradesh and Jharkhand, beyond the eight
            sacred sites of the Bodhi Circuit.
          </motion.p>
        </div>
      </section>

      {/* filter + grid */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-24">
        <Reveal className="flex flex-wrap justify-center gap-3 mb-12">
          {(["All", ...heritageStates] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2.5 rounded-full text-sm tracking-wide border transition-all duration-300 ${
                filter === s
                  ? "bg-gold text-ink border-gold font-semibold"
                  : "border-gold/25 text-cream/70 hover:border-gold/60 hover:text-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </Reveal>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {visible.map((site, i) => (
              <motion.article
                key={site.name}
                layout
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.35), ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-3xl border border-gold/15 bg-coal/70 p-6 md:p-7 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 flex flex-col"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1.5 rounded-full bg-ink/70 border border-gold/30 text-gold">
                    {site.state}
                  </span>
                  {site.designation && (
                    <span
                      className={`text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1.5 rounded-full ${
                        site.designation.includes("UNESCO")
                          ? "bg-gold text-ink"
                          : "border border-bodhi/40 text-bodhi bg-bodhideep/40"
                      }`}
                    >
                      {site.designation}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-2xl text-cream mb-1 leading-snug">{site.name}</h3>
                <p className="text-muted text-sm mb-4">{site.location}</p>
                <p className="text-cream/70 text-[15px] leading-relaxed flex-1">{site.description}</p>
                <div className="mt-5 pt-4 border-t border-gold/10 flex items-center gap-2 text-sm">
                  <span className="text-gold">☀</span>
                  <span className="text-sand/85">Best time: {site.bestTime}</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-14 text-center max-w-2xl mx-auto">
          <p className="text-muted text-sm leading-relaxed">
            UNESCO World Heritage status is marked only where officially
            inscribed. Festival dates and seasonal notes are indicative —
            always check local guidance before travelling.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
