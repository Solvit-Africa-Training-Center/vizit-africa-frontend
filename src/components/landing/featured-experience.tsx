import { RiArrowRightLine, RiPlaneLine } from "@remixicon/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function FeaturedExperience() {
  const t = useTranslations("FeaturedExperience");

  return (
    <section className="w-full bg-surface-cream relative overflow-hidden isolate py-24 md:py-32">
      {/* Subtle Blue Grain and Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,oklch(65%_0.06_245/0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none z-0">
        <svg className="w-full h-full">
          <title>Noise overlay</title>
          <filter id="noise-featured">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-featured)" />
        </svg>
      </div>

      <div className="marketing-container relative z-10">
        <div className="bg-surface-ink rounded-3xl overflow-hidden shadow-2xl relative isolate border border-border-warm/20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-20 order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="px-3 py-1 rounded-full border border-primary-light/30 bg-primary-light/10">
                  <span className="font-mono text-[10px] text-primary-light uppercase tracking-widest">
                    {t("badge")}
                  </span>
                </div>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-medium text-white leading-tight mb-4">
                {t.rich("title", {
                  br: () => <br className="hidden md:block" />,
                })}
              </h2>

              <p className="font-sans text-white/60 text-lg font-light mb-8 max-w-md">
                {t("description")}
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10 pb-10 border-b border-white/10">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">
                    {t("locationLabel")}
                  </div>
                  <div className="font-sans text-sm text-white">
                    {t("locationValue")}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">
                    {t("durationLabel")}
                  </div>
                  <div className="font-sans text-sm text-white">
                    {t("durationValue")}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">
                    {t("groupSizeLabel")}
                  </div>
                  <div className="font-sans text-sm text-white">
                    {t("groupSizeValue")}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">
                    {t("startingFromLabel")}
                  </div>
                  <div className="font-sans text-sm font-medium text-primary-light">
                    {t("startingFromValue", { price: "2,450" })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/80 text-white font-sans font-medium uppercase tracking-widest text-xs transition-colors">
                  <RiPlaneLine className="mr-2 size-4" />
                  {t("requestButton")}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-8 rounded-full border-white/20 hover:bg-white/5 text-white bg-transparent font-sans font-medium uppercase tracking-widest text-xs transition-colors"
                >
                  {t("itineraryButton")}
                  <RiArrowRightLine className="ml-2 size-4" />
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative min-h-[400px] lg:min-h-full h-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-linear-to-r from-surface-ink via-surface-ink/20 to-transparent z-10 hidden lg:block" />
              <div className="absolute inset-0 bg-linear-to-t from-surface-ink via-surface-ink/20 to-transparent z-10 lg:hidden" />
              <Image
                src="/images/tourism-guide-vehicle-car.jpg" // Placeholder for gorillas
                alt={t("title", { br: " " })}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
