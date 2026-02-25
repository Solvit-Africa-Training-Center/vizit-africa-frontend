"use client";

import { RiArrowRightUpLine } from "@remixicon/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./section-title";

const regionData = [
  {
    id: "volcanoes",
    key: "volcanoes",
    image: "/images/wildlife-silverback-gorilla.jpg",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "akagera",
    key: "akagera",
    image: "/images/giraffe.jpg",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "nyungwe",
    key: "nyungwe",
    image: "/images/rwanda-walk-path-in-forest.jpg",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "kivu",
    key: "kivu",
    image: "/images/kivu-boats.jpg",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "kigali",
    key: "kigali",
    image: "/images/city-kigali-roundabout-with-woman-and-child-statue.jpg",
    className: "md:col-span-1 md:row-span-1",
  },
];

export function Destinations() {
  const t = useTranslations("Destinations");

  const regions = regionData.map((r) => ({
    ...r,
    name: t(`regions.${r.key}.name`),
    subtitle: t(`regions.${r.key}.subtitle`),
  }));

  return (
    <section className="marketing-section bg-surface-ink text-white relative overflow-hidden isolate">
      <div className="marketing-container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionTitle
            overline={t("overline")}
            title={
              <>
                {t("title").split(" ")[0]} <br />{" "}
                {t("title").split(" ").slice(1).join(" ")}
              </>
            }
            className="mb-0 max-w-2xl text-white"
            dark={true}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <p className="max-w-xs text-white/70 text-lg leading-relaxed text-pretty">
              {t("description")}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 min-h-[600px] md:aspect-2/1">
          {regions.map((region, i) => (
            <Link
              href={`/plan-trip?destination=${encodeURIComponent(region.name)}&source=destinations`}
              key={region.id}
              className="contents"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                  region.className,
                )}
              >
                <Image
                  src={region.image}
                  alt={region.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <RiArrowRightUpLine
                        className="text-white group-hover:text-primary-light w-5 h-5 transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/80 group-hover:text-primary-light block mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {region.subtitle}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-medium text-white uppercase leading-none tracking-tight">
                      {region.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
