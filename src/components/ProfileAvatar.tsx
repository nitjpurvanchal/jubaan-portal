// Small circular profile-photo avatar with an initial-letter fallback.
// Presentational only — safe to use from server and client components.

type Props = {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
};

export default function ProfileAvatar({ src, name, size = 48, className = "" }: Props) {
  const initial = (name?.trim()?.[0] ?? "J").toUpperCase();
  const style = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s profile photo` : "Profile photo"}
        width={size}
        height={size}
        style={style}
        loading="lazy"
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`rounded-full bg-gradient-to-br from-gold to-saffron flex items-center justify-center font-display font-bold text-ink shrink-0 ${className}`}
    >
      <span style={{ fontSize: Math.round(size * 0.42) }}>{initial}</span>
    </div>
  );
}
