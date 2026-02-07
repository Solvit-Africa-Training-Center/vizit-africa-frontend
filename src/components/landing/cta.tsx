import { Button } from "@/components/ui/button";
import { RiArrowRightLine, RiWhatsappLine } from "@remixicon/react";
import Link from "next/link";
import NextImage from "next/image";

export function CTA() {
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <NextImage
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=90&w=2600&auto=format&fit=crop"
          alt="Savannah"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 md:px-10 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1]">
          Ready for the Trip of a Lifetime?
        </h2>

        <p className="text-white/80 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Let us handle the details. You just handle the memories. Start
          planning your bespoke Rwanda itinerary today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/plan-trip">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full">
              Start Planning
              <RiArrowRightLine className="size-5" />
            </Button>
          </Link>
        </div>

        <p className="mt-12 text-white/50 text-sm tracking-widest uppercase">
          Concierge Support 24/7
        </p>
      </div>
    </section>
  );
}
