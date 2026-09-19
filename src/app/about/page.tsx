"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import BodhiLeaf from "@/components/BodhiLeaf";

const values = [
  { t: "Heritage, lived", d: "We don't just read about culture in books — we sing it, cook it, paint it and stage it." },
  { t: "Open to everyone", d: "Membership is open to every student of NIT Jalandhar, whatever their state, language or background." },
  { t: "Never political", d: "JUBAAN is explicitly cultural — no politics, no region-based mobilisation, only celebration." },
  { t: "Student-led", d: "Planned, staged and run by students, guided by a Faculty Coordinator and the Dean Students' Welfare." },
];

const committees = [
  "Cultural & Events", "Literary & Language", "Arts & Creative",
  "Media & Publicity", "Heritage & Food", "Outreach & Collaboration", "Logistics & Management",
];

export default function AboutPage() {
  return (
    <div className="pt-[72px]">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/canopy.webp" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-5">
            About the club
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="font-display text-5xl md:text-7xl leading-tight mb-6"
          >
            What is <span className="text-gradient-gold">JUBAAN</span>?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9 }}
            className="text-cream/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            <span className="text-goldsoft font-semibold">J</span>harkhand ·{" "}
            <span className="text-goldsoft font-semibold">U</span>ttar Pradesh ·{" "}
            <span className="text-goldsoft font-semibold">B</span>ihar{" "}
            <span className="text-goldsoft font-semibold">A</span>ssociation{" "}
            <span className="text-goldsoft font-semibold">A</span>nd{" "}
            <span className="text-goldsoft font-semibold">N</span>etworks —
            the cultural club of NIT Jalandhar, now with a digital home.
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-24 grid md:grid-cols-2 gap-12 items-start">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl mb-5">Our <span className="text-gradient-gold">vision</span></h2>
          <p className="text-cream/70 text-lg leading-relaxed mb-8">
            To be a vibrant cultural platform that celebrates India's diversity,
            preserves regional heritage and folk traditions, and connects
            students across states through shared celebration.
          </p>
          <h2 className="font-display text-3xl md:text-4xl mb-5">Our <span className="text-gradient-gold">mission</span></h2>
          <ul className="space-y-3 text-cream/70 leading-relaxed">
            {[
              "Celebrate diverse cultural traditions through planned events and observances",
              "Give students a regular stage for folk music, dance, theatre and poetry",
              "Promote regional languages — Maithili, Bhojpuri, Magahi, Awadhi, Hindi",
              "Organise heritage, literary and food-culture activities with academic value",
              "Build leadership, teamwork and event-management skills in members",
            ].map((m) => (
              <li key={m} className="flex gap-3">
                <BodhiLeaf className="w-5 h-6 text-gold shrink-0 mt-1" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="rounded-3xl overflow-hidden border border-gold/20">
          <img src="/images/hero.webp" alt="Mahabodhi Temple at sunrise" className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-[2s]" />
        </Reveal>
      </section>

      <section className="bg-coal/40 border-y border-gold/10 py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <SectionHeading kicker="How we work" title="What we stand by" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.07} className="rounded-3xl border border-cream/10 bg-ember/70 p-7 hover:border-gold/40 transition-colors duration-500">
                <BodhiLeaf className="w-8 h-10 text-gold mb-4" />
                <h3 className="font-display text-xl mb-2">{v.t}</h3>
                <p className="text-sm text-cream/60 leading-relaxed">{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-24 text-center">
        <SectionHeading
          kicker="The engine room"
          title="Seven committees, one family"
          sub="From stage lights to social media, every member finds a crew to belong to."
        />
        <Reveal className="flex flex-wrap justify-center gap-3">
          {committees.map((c) => (
            <span key={c} className="px-5 py-2.5 rounded-full border border-gold/25 text-goldsoft text-sm hover:bg-gold/10 transition-colors cursor-default">
              {c}
            </span>
          ))}
        </Reveal>
        <Reveal delay={0.15} className="mt-12">
          <a href="/signup" className="inline-block px-10 py-4 rounded-full bg-gold text-ink font-bold hover:bg-goldsoft transition-all duration-300 shadow-[0_0_36px_rgba(217,164,65,0.4)]">
            Become a member
          </a>
        </Reveal>
      </section>
    </div>
  );
}
