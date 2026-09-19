"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { RoleName } from "@/lib/volunteer";
import { ROLE_BADGE_STYLES } from "@/lib/volunteer";

type Props = {
  name: string;
  role: RoleName;
  date: string;
  certId: string;
};

/**
 * Virtual award certificate. The "Download / Print" button opens the
 * browser print dialog; print CSS isolates the certificate so it prints
 * cleanly on a single page.
 */
export default function VolunteerCertificate({ name, role, date, certId }: Props) {
  const reduce = useReducedMotion();

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .jubaan-cert, .jubaan-cert * { visibility: visible !important; }
          .jubaan-cert {
            position: absolute !important;
            inset: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .jubaan-cert-no-print { display: none !important; }
        }
      `}</style>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="jubaan-cert relative max-w-2xl mx-auto rounded-2xl bg-[#141008] p-2.5 shadow-[0_0_60px_rgba(217,164,65,0.25)]"
      >
        {/* ornamental double frame */}
        <div className="rounded-xl border-2 border-gold/80 p-1.5">
          <div className="relative rounded-lg border border-gold/40 px-8 py-10 md:px-12 text-center overflow-hidden">
            {/* corner flourishes */}
            {["top-3 left-4", "top-3 right-4", "bottom-3 left-4", "bottom-3 right-4"].map((pos) => (
              <span key={pos} className={`absolute ${pos} text-gold/70 text-xl select-none`} aria-hidden="true">
                ✦
              </span>
            ))}
            {/* soft glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold/10 blur-[70px] rounded-full pointer-events-none" />

            <div className="relative">
              <Image
                src="/logo/jubaan-logo-512.png"
                alt="JUBAAN logo"
                width={104}
                height={104}
                className="mx-auto rounded-full ring-2 ring-gold/60 shadow-[0_0_30px_rgba(217,164,65,0.4)]"
              />
              <p className="mt-5 text-[11px] tracking-[0.45em] uppercase text-goldsoft/90">
                JUBAAN
              </p>
              <p className="mt-1 text-[10px] tracking-[0.2em] uppercase text-cream/40">
                Jharkhand · Uttar Pradesh · Bihar Association And Networks
              </p>

              <h3 className="font-display text-3xl md:text-4xl mt-7 text-cream">
                Certificate of <span className="text-gradient-gold">Volunteership</span>
              </h3>
              <p className="mt-4 text-cream/60 text-sm italic">
                This certificate is proudly presented to
              </p>
              <p className="font-display text-4xl md:text-5xl mt-2 text-goldsoft">
                {name}
              </p>
              <p className="mt-4 text-cream/60 text-sm">
                for serving the sangha with devotion as
              </p>
              <div className="mt-3 inline-block">
                <span
                  className={`inline-block px-6 py-2.5 rounded-full border text-base font-bold tracking-wide ${ROLE_BADGE_STYLES[role]}`}
                >
                  {role}
                </span>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-xs text-cream/50">
                <div className="text-center">
                  <p className="font-display text-lg text-cream/80 italic">Team JUBAAN</p>
                  <p className="mt-1 border-t border-gold/30 pt-1 px-4">NIT Jalandhar</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-lg text-cream/80">{date}</p>
                  <p className="mt-1 border-t border-gold/30 pt-1 px-4">Date of honour</p>
                </div>
              </div>

              <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-cream/35">
                Certificate ID · {certId}
              </p>
              <p className="mt-2 text-xs text-cream/40 italic">हमारी विरासत, हमारी जुबानी</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="jubaan-cert-no-print mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="px-8 py-3 rounded-full bg-gold text-ink font-bold hover:bg-goldsoft transition-all duration-300 shadow-[0_0_28px_rgba(217,164,65,0.35)]"
        >
          ⬇ Download / Print certificate
        </button>
        <p className="text-muted text-xs mt-3">
          Opens your print dialog — save as PDF or print it for your wall.
        </p>
      </div>
    </div>
  );
}
