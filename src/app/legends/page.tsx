"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import EmberCanvas from "@/components/EmberCanvas";
import { legends, legendStates, type Legend } from "@/lib/legends";

function LegendCard({ legend, index }: { legend: Legend; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl overflow-hidden border border-gold/15 bg-coal/70 hover:border-gold/40 transition-colors duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={legend.image}
          alt={`Portrait of ${legend.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1.5 rounded-full bg-ink/70 backdrop-blur border border-gold/30 text-gold">
            {legend.state}
          </span>
          {legend.year ? (
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1.5 rounded-full bg-gold text-ink">
              Bharat Ratna · {legend.year}
              {legend.posthumous ? " †" : ""}
            </span>
          ) : (
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1.5 rounded-full bg-bodhideep text-cream border border-bodhi/40">
              Honoured icon
            </span>
          )}
        </div>
        <div className="absolute bottom-0 inset-x-0 p-5">
          <p className="text-gold/90 text-[11px] tracking-[0.3em] uppercase mb-1">{legend.field}</p>
          <h3 className="font-display text-2xl text-cream leading-snug">{legend.name}</h3>
          <p className="text-muted text-sm mt-1">{legend.lifespan}</p>
        </div>
      </div>
      <div className="p-5 pt-4">
        <p className="text-cream/75 leading-relaxed text-[15px]">{legend.bio}</p>
        <p className="mt-4 text-[11px] text-muted/80">
          Image:{" "}
          <a
            href={legend.attributionUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-gold/40 underline-offset-2 hover:text-gold transition-colors"
          >
            {legend.credit}
          </a>
        </p>
      </div>
    </motion.article>
  );
}

export default function LegendsPage() {
  const [filter, setFilter] = useState<(typeof legendStates)[number] | "All">("All");
  const reduce = useReducedMotion();
  const visible = filter === "All" ? legends : legends.filter((l) => l.state === filter);

  return (
    <div className="pt-[72px]">
      {/* hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {!reduce && <EmberCanvas className="absolute inset-0 h-full w-full opacity-50" density={0.3} interactive={false} bokeh />}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-5"
          >
            Bharat Ratna · our soil
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="font-display text-5xl md:text-7xl leading-tight mb-6"
          >
            Legends of <span className="text-gradient-gold">our soil</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-cream/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Presidents and prime ministers, shehnai and sitar, poets of the
            people and teachers of nations — the highest civilian honour of
            India has been bestowed on the sons and daughters of Bihar, Uttar
            Pradesh and Jharkhand. Portraits are real archival images via
            Wikimedia Commons.
          </motion.p>
        </div>
      </section>

      {/* filter */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-10">
        <Reveal className="flex flex-wrap justify-center gap-3 mb-4">
          {(["All", ...legendStates] as const).map((s) => (
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
        <Reveal className="text-center mb-10">
          <p className="text-muted text-sm max-w-2xl mx-auto">
            Jharkhand was part of Bihar until 15 November 2000, so its legends
            of the freedom era are honoured alongside Bihar&rsquo;s. Birsa Munda is
            included as a revered tribal icon — clearly marked, as he is not a
            Bharat Ratna recipient.
          </p>
        </Reveal>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {visible.map((legend, i) => (
              <LegendCard key={legend.name} legend={legend} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-14 text-center">
          <p className="text-muted text-sm">
            † Awarded posthumously. All award years verified against the official
            Bharat Ratna roll.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
