"use client";

import { RiArrowRightUpLine } from "@remixicon/react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./section-title";
import { useTranslations } from "next-intl";

const regionData = [
  {
    id: "volcanoes",
    key: "volcanoes",
    image:
      "https://images.unsplash.com/photo-1662612732223-1fe6ea43263e?q=90&w=1600&auto=format&fit=crop",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "akagera",
    key: "akagera",
    image:
      "https://images.unsplash.com/photo-1621268405207-3dfc641fceeb?q=90&w=1600&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "nyungwe",
    key: "nyungwe",
    image:
      "https://images.unsplash.com/photo-1489640818597-89b1edc97db5?q=90&w=1600&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "kivu",
    key: "kivu",
    image:
      "https://images.unsplash.com/photo-1514548383638-cef9251a73ec?q=90&w=1600&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "kigali",
    key: "kigali",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=90&w=1600&auto=format&fit=crop",
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
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionTitle
            overline={t("overline")}
            title={
              <>
                {t("title").split(" ")[0]} <br />{" "}
                {t("title").split(" ").slice(1).join(" ")}
              </>
            }
            className="mb-0 max-w-2xl"
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <p className="max-w-xs text-muted-foreground text-lg leading-relaxed">
              {t("description")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1200px] md:h-[600px]">
          {regions.map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                region.className,
              )}
            >
              <Image
                src={region.image}
                alt={region.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-end">
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <RiArrowRightUpLine
                      className="text-white w-5 h-5"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/80 block mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {region.subtitle}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase leading-none">
                    {region.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
