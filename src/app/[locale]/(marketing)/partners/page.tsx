"use client";

import {
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiGlobalLine,
  RiLineChartLine,
  RiTeamLine,
} from "@remixicon/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function PartnersPage() {
  const t = useTranslations("Partners");

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <PageHeader
        title={t("title")}
        overline={t("overline")}
        description={t("description")}
        layout="split"
        className="mb-24 md:mb-32"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="h-14 px-8 rounded-full font-display uppercase tracking-widest text-xs"
            render={<Link href="/partners/apply" />}
          >
            {t("cta.apply")} <RiArrowRightLine className="ml-2 size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 rounded-full font-display uppercase tracking-widest text-xs"
          >
            {t("cta.learnMore")}
          </Button>
        </div>
      </PageHeader>

      <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32 md:mb-48">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <BenefitCard
            icon={RiGlobalLine}
            title={t("benefits.items.global.title")}
            description={t("benefits.items.global.description")}
            order="01"
          />
          <BenefitCard
            icon={RiTeamLine}
            title={t("benefits.items.targeted.title")}
            description={t("benefits.items.targeted.description")}
            order="02"
          />
          <BenefitCard
            icon={RiLineChartLine}
            title={t("benefits.items.growth.title")}
            description={t("benefits.items.growth.description")}
            order="03"
          />
        </div>
      </section>

      <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32 md:mb-48">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden group">
            <Image
              src="/images/hotel.jpg"
              alt="Vendor Dashboard"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div>
            <h2 className="font-display text-4xl md:text-5xl font-medium uppercase tracking-tighter leading-none mb-12">
              {t("features.title")}
            </h2>
            <ul className="space-y-6">
              {(t.raw("features.items") as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 group-hover:bg-primary transition-colors duration-300">
                    <RiCheckboxCircleLine className="size-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="text-lg md:text-xl text-muted-foreground font-light group-hover:text-foreground transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-12 h-14 px-8 rounded-full font-display uppercase tracking-widest text-xs"
              render={<Link href="/partners/apply" />}
            >
              {t("cta.getStarted")}
            </Button>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="bg-surface-ink text-primary-foreground rounded-3xl p-8 md:p-24 text-center relative overflow-hidden isolate shadow-2xl border border-primary/10">
          {/* Radial Gradient Background (Blue tint) */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top center, oklch(65% 0.06 245 / 0.25) 0%, transparent 60%)",
            }}
          />

          {/* Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 mix-blend-overlay"
            aria-hidden="true"
          >
            <svg className="w-full h-full">
              <title>Noise overlay</title>
              <filter id="noise-partners">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.60"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise-partners)" />
            </svg>
          </div>

          <div className="relative z-20">
            <h2 className="font-display text-4xl md:text-6xl font-medium uppercase tracking-tighter leading-[0.9] mb-4 text-white">
              {t("ctaSection.title")}
            </h2>
            <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto mb-12">
              {t("ctaSection.description")}
            </p>
            <Button
              size="lg"
              className="h-16 px-12 rounded-full font-sans font-semibold uppercase tracking-[0.12em] text-xs transition-colors shadow-lg shadow-primary/20 hover:scale-105 duration-300 bg-primary hover:bg-primary/90 text-white border-0"
              render={<Link href="/partners/apply" />}
            >
              {t("ctaSection.button")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  description,
  order,
}: {
  icon: React.ElementType<{ className?: string }>;
  title: string;
  description: string;
  order: string;
}) {
  return (
    <div className="flex flex-col border-t border-border pt-8 group hover:border-primary transition-colors duration-500">
      <span className="font-mono text-xs text-muted-foreground mb-6">
        ({order})
      </span>
      <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
        <Icon className="size-6 text-foreground group-hover:text-primary-foreground transition-colors" />
      </div>
      <h3 className="font-display text-3xl font-medium uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground/80 leading-relaxed text-lg font-light">
        {description}
      </p>
    </div>
  );
}
