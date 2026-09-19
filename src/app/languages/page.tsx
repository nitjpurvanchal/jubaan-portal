"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import EmberCanvas from "@/components/EmberCanvas";
import { languages } from "@/lib/languages";

function PhraseExplorer() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const lang = languages[active];

  return (
    <div className="rounded-3xl border border-gold/20 bg-coal/70 overflow-hidden">
      <div className="flex flex-wrap gap-2 p-5 md:p-6 border-b border-gold/10 justify-center">
        {languages.map((l, i) => (
          <button
            key={l.name}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 ${
              i === active
                ? "bg-gold text-ink border-gold font-semibold"
                : "border-gold/25 text-cream/70 hover:border-gold/60 hover:text-gold"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>
      <div className="relative min-h-[280px] flex items-center justify-center p-8 md:p-14 text-center overflow-hidden">
        {!reduce && (
          <EmberCanvas
            className="absolute inset-0 h-full w-full opacity-40"
            density={0.25}
            interactive={false}
            bokeh={false}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -14 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <p className="text-gold tracking-[0.35em] uppercase text-[11px] font-semibold mb-5">
              Say hello in {lang.name} · {lang.nativeName}
            </p>
            <p className="font-display text-4xl md:text-6xl text-cream leading-tight mb-5">
              {lang.phrase.native}
            </p>
            <p className="text-sand/90 text-lg italic mb-2">{lang.phrase.transliteration}</p>
            <p className="text-muted">“{lang.phrase.meaning}”</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LanguagesPage() {
  return (
    <div className="pt-[72px]">
      {/* hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-5"
          >
            Boli · Bhasha · Zubaan
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="font-display text-5xl md:text-7xl leading-tight mb-6"
          >
            The tongues of <span className="text-gradient-gold">our three states</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-cream/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Ten languages, three language families, thousands of years of song.
            From Vidyapati&rsquo;s Maithili padavalis to Santhali epics older than
            writing — this is the soundscape JUBAAN celebrates.
          </motion.p>
        </div>
      </section>

      {/* phrase explorer */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-20">
        <Reveal className="mb-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream">
            The <span className="text-gradient-gold">phrase explorer</span>
          </h2>
          <p className="text-muted mt-3">Pick a language. Learn to say hello.</p>
        </Reveal>
        <Reveal>
          <PhraseExplorer />
        </Reveal>
      </section>

      {/* cards */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {languages.map((l, i) => (
            <Reveal key={l.name} delay={Math.min(i * 0.05, 0.3)}>
              <article className="h-full rounded-3xl border border-gold/15 bg-coal/70 p-6 md:p-8 hover:border-gold/40 transition-colors duration-500">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display text-3xl text-cream">
                      {l.name} <span className="text-gold/80 text-2xl">{l.nativeName}</span>
                    </h3>
                    <p className="text-gold/80 text-xs tracking-[0.2em] uppercase mt-2">{l.family}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                  <div className="rounded-xl bg-ink/60 border border-gold/10 p-3">
                    <p className="text-muted text-[11px] uppercase tracking-widest mb-1">Region</p>
                    <p className="text-cream/85">{l.region}</p>
                  </div>
                  <div className="rounded-xl bg-ink/60 border border-gold/10 p-3">
                    <p className="text-muted text-[11px] uppercase tracking-widest mb-1">Script</p>
                    <p className="text-cream/85">{l.script}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 p-4 mb-5">
                  <p className="font-display text-xl text-cream mb-1">{l.phrase.native}</p>
                  <p className="text-sand/80 text-sm italic">{l.phrase.transliteration}</p>
                  <p className="text-muted text-sm">“{l.phrase.meaning}”</p>
                </div>
                <p className="text-cream/70 text-[15px] leading-relaxed mb-3">{l.literary}</p>
                <p className="text-bodhi text-sm italic">✦ {l.jubaanNote}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
