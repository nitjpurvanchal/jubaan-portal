export default function BodhiLeaf({
  className = "",
  glow = false,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 12px rgba(217,164,65,0.55))" } : undefined}
      aria-hidden="true"
    >
      {/* Bodhi leaf: heart-shaped blade with long drip tip */}
      <path
        d="M50 8 C 78 22, 96 44, 88 66 C 82 82, 66 90, 56 96 C 54 104, 53 110, 52 118 C 51 110, 49 104, 47 97 C 34 91, 18 81, 12 64 C 5 43, 24 21, 50 8 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M50 14 C 50 40, 50 66, 51 96"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.7"
      />
      <path d="M50 30 C 62 34, 72 42, 78 52" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M50 30 C 38 34, 28 42, 22 52" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M50 48 C 60 52, 68 58, 73 66" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M50 48 C 40 52, 32 58, 27 66" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}
