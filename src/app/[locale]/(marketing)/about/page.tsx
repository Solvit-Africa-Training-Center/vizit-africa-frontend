import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { members as teamMembers } from "@/lib/configs/members";

export default async function AboutPage() {
  const t = await getTranslations("About");
  const tCommon = await getTranslations("Common");

  const values = [
    {
      order: "01",
      title: t("values.1.title"),
      description: t("values.1.description"),
    },
    {
      order: "02",
      title: t("values.2.title"),
      description: t("values.2.description"),
    },
    {
      order: "03",
      title: t("values.3.title"),
      description: t("values.3.description"),
    },
    {
      order: "04",
      title: t("values.4.title"),
      description: t("values.4.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page header ───────────────────────────────────────────── */}
      <PageHeader
        title={t("title")}
        overline={t("established")}
        className="pt-24 md:pt-32"
      />

      {/* ── Intro prose ───────────────────────────────────────────── */}
      <section className="marketing-section pt-0">
        <div className="marketing-container">
          <div className="max-w-4xl">
            <p className="font-display text-2xl md:text-4xl font-light leading-tight tracking-tight uppercase text-balance">
              {/* Primary color for first sentence — brand anchor */}
              <span className="text-primary">{t("intro1")}</span> {t("intro2")}
            </p>
            <p className="text-xl md:text-2xl font-light leading-relaxed mt-10 text-muted-foreground/55 text-pretty">
              {t("intro3")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────── */}
      <section className="marketing-section bg-surface-cream">
        <div className="marketing-container">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="font-display text-4xl md:text-5xl font-light uppercase tracking-tight leading-none">
              {t("guidesTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xs text-base font-light leading-relaxed">
              {t("guidesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group flex flex-col gap-4">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface-bone">
                  <Image
                    src={member.image || "/images/guide.jpg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-0.5 px-1">
                  <h3 className="font-display text-2xl font-light uppercase text-foreground tracking-tight">
                    {member.name}
                  </h3>
                  {/* Role label — primary mono per design guide */}
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section className="marketing-section">
        <div className="marketing-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14">
            {values.map((val) => (
              <div
                key={val.title}
                className="flex flex-col border-t border-border/60 pt-7 group hover:border-primary/40 transition-colors duration-500"
              >
                {/* Order number — primary per design guide */}
                <span className="font-mono text-[9px] text-primary uppercase tracking-[0.2em] mb-5">
                  {val.order}
                </span>
                <h3 className="font-display text-2xl font-light mb-3 uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                  {val.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-light">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section pb-16 md:pb-24">
        <div className="marketing-container">
          <div className="py-16 md:py-24 text-center bg-surface-ink text-primary-foreground rounded-[2.5rem] relative overflow-hidden isolate shadow-2xl border border-white/5">
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 70% at 50% 0%, oklch(65% 0.12 62 / 0.12) 0%, transparent 65%)",
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none z-10 mix-blend-overlay"
              aria-hidden="true"
            >
              <svg className="w-full h-full">
                <title>Noise overlay</title>
                <filter id="noise-about">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.60"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise-about)" />
              </svg>
            </div>

            {/* Amber horizon line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

            <div className="relative z-20 px-6">
              {/* Overline */}
              <span className="inline-flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.25em] text-primary-foreground/70 mb-7">
                <span className="w-4 h-px bg-primary-light/40" />
                {t("cta.overline")}
                <span className="w-4 h-px bg-primary-light/40" />
              </span>

              <h2 className="font-display text-4xl md:text-6xl font-light uppercase tracking-tight leading-[0.92] mb-4 max-w-2xl mx-auto text-white">
                {t("startJourney").split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-primary-foreground italic block mt-1">
                  {t("startJourney").split(" ").slice(-1)}
                </span>
              </h2>

              <p className="text-white/40 font-light mb-11 mt-5 max-w-sm mx-auto text-base leading-relaxed">
                {t("cta.description")}
              </p>

              {/* CTA — primary button on dark is fine; primary also works */}
              <Button
                size="lg"
                className="btn-primary h-13 px-10 text-[10px]"
                render={<Link href="/contact" />}
              >
                {tCommon("getInTouch")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
