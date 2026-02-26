import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left: full-bleed editorial image panel ── */}
      <div className="hidden lg:flex flex-col relative bg-surface-ink overflow-hidden">
        <Image
          src="/images/children-dancing-traditional-dances-black-white.jpg"
          alt="Vizit Africa Experience"
          fill
          className="object-cover opacity-55 mix-blend-overlay"
          priority
        />

        {/* Dark gradient — reads text at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

        {/* Amber horizon line — brand echo */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

        {/* Content — bottom-anchored */}
        <div className="absolute bottom-14 left-12 right-12 z-10">
          {/* Quote attribution label */}
          <span className="label-overline text-primary mb-5 block">
            Travel Wisdom
          </span>

          <blockquote className="font-display text-[2rem] font-light leading-[1.1] tracking-tight text-white mb-5">
            "The journey of a thousand miles begins with a single step."
          </blockquote>

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
            Vizit Africa — Concierge Travel
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
