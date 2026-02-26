import { useTranslations } from "next-intl";

export function StatsBar() {
  const t = useTranslations("Stats");

  return (
    <section className="w-full bg-surface-ink text-white py-12 lg:py-16">
      <div className="marketing-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/10">
          <div className="flex flex-col items-center md:items-start px-4">
            <div className="font-display text-4xl lg:text-5xl font-medium mb-1">
              1.2K<span className="text-primary">+</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {t("travelers")}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start px-4">
            <div className="font-display text-4xl lg:text-5xl font-medium mb-1">
              18
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {t("nationalities")}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start px-4">
            <div className="font-display text-4xl lg:text-5xl font-medium mb-1">
              98<span className="text-primary">%</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {t("satisfaction")}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start px-4">
            <div className="font-display text-4xl lg:text-5xl font-medium text-primary flex items-baseline gap-1 mb-1">
              4.9 <span className="text-2xl">★</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {t("rating")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
