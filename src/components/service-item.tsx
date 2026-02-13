import { Service } from "@/app/[locale]/(marketing)/services/page";
import { cn } from "@/lib/utils";
import { RiArrowRightUpLine } from "@remixicon/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { AddToTripButton } from "./plan-trip/add-to-trip-button";

export function ServiceItem({
  service,
  isExpanded,
  onToggle,
  bookLabel,
}: {
  service: Service;
  isExpanded: boolean;
  onToggle: () => void;
  bookLabel: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-border/50 group"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left outline-hidden"
      >
        <div className="flex-1">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">
            {service.category}
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-medium group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h2>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
          <span className="font-mono text-sm md:text-base text-muted-foreground">
            {service.price}
          </span>
          <div
            className={cn(
              "size-8 rounded-full border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:text-primary",
              isExpanded ? "rotate-45" : "rotate-0",
            )}
          >
            <RiArrowRightUpLine className="size-4" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-12 md:pb-16 grid md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4 relative aspect-[4/3] rounded-sm overflow-hidden bg-muted">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-foreground/90">
                    {service.description}
                  </p>
                  <ul className="grid md:grid-cols-2 gap-4 mb-8">
                    {service.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <AddToTripButton
                    type="note"
                    note={`Requested Service: ${service.title} (${service.category}) - ${service.description}`}
                    label={bookLabel}
                    size="lg"
                    className="px-8 rounded-none h-14 uppercase tracking-widest font-display text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
