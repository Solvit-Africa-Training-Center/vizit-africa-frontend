import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";

export function CTA() {
  return (
    <section id="contact" className="py-20 md:py-24 bg-primary">
      <div className="mx-auto max-w-4xl px-5 md:px-10 text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Plan Your Rwanda Journey?
        </h2>

        <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Start planning in less than 2 minutes. Tell us your travel dates and
          preferences, and we'll create a personalized package just for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/plan-trip">
            <Button
              size="lg"
              className="h-14 px-8 text-base rounded-xl bg-white text-primary hover:bg-gray-100 transition-all duration-300 font-semibold"
            >
              Start Your Trip
              <RiArrowRightLine className="ml-2 size-5" />
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/70">
          or email us at{" "}
          <a
            href="mailto:hello@vizitafrica.rw"
            className="underline hover:text-white transition-colors"
          >
            hello@vizitafrica.rw
          </a>
        </p>
      </div>
    </section>
  );
}
