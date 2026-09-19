"use client";

import { useId } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  size?: number;
  className?: string;
  /** decorative slowly-rotating dashed orbit ring (hero) */
  orbit?: boolean;
  /** periodic light sweep across the medallion */
  shine?: boolean;
  /** soft golden halo behind the medallion */
  glow?: boolean;
};

/**
 * The JUBAAN medallion, revealed like embroidery: a fine gold ring draws
 * itself around the logo on mount, with an optional orbit ring, periodic
 * shine sweep and halo. Degrades to a static medallion under reduced motion.
 */
export default function LogoMark({
  size = 42,
  className = "",
  orbit = false,
  shine = true,
  glow = true,
}: Props) {
  const reduce = useReducedMotion();
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <span
      className={`group/lm relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="absolute inset-1 rounded-full bg-gold/25 blur-2xl"
        />
      )}

      {/* embroidery draw-in ring */}
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)]">
        <defs>
          <linearGradient id={`lm-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3d68a" />
            <stop offset="55%" stopColor="#d9a441" />
            <stop offset="100%" stopColor="#8a5f1e" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={`url(#lm-${gid})`}
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          initial={reduce ? { strokeDashoffset: 0, opacity: 0.7 } : { strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.75 }}
          transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </svg>

      {/* decorative orbit ring */}
      {orbit && (
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className={`absolute -inset-6 h-[calc(100%+48px)] w-[calc(100%+48px)] opacity-60 ${reduce ? "" : "animate-spin-slower"}`}
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#d9a441"
            strokeWidth="1"
            strokeDasharray="3 9"
            strokeLinecap="round"
          />
        </svg>
      )}

      <span className="relative block h-full w-full overflow-hidden rounded-full ring-2 ring-gold/50 shadow-[0_0_50px_rgba(217,164,65,0.4)] transition-transform duration-500 group-hover/lm:scale-[1.04]">
        <Image
          src="/logo/jubaan-logo-512.png"
          alt="JUBAAN — embroidered club logo"
          width={size}
          height={size}
          priority
          className="h-full w-full rounded-full object-cover"
        />
        {shine && !reduce && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="shine-sweep absolute inset-y-[-25%] left-0 w-[45%] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </span>
        )}
      </span>
    </span>
  );
}
