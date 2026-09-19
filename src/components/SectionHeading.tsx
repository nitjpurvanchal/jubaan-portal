import Reveal from "./Reveal";

export default function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal className="max-w-3xl mx-auto text-center mb-12">
      <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-4">
        {kicker}
      </p>
      <h2 className="font-display text-4xl md:text-5xl leading-tight text-cream">
        {title}
      </h2>
      {sub && <p className="text-muted mt-4 text-lg leading-relaxed">{sub}</p>}
    </Reveal>
  );
}
