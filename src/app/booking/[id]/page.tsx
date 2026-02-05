import { samplePackage } from "@/lib/dummy-data";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import {
  RiArrowRightLine,
  RiTimerLine,
  RiCalendarLine,
} from "@remixicon/react";
import Link from "next/link";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const pkg = samplePackage;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-muted/30">
        <div className="mx-auto max-w-3xl px-5 md:px-10 text-center">
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Journey Awaits
            </h1>
            <p className="text-xl text-muted-foreground">
              We've prepared a custom itinerary for you based on your request.
              Review and customize your options to get started.
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 shadow-sm mb-10">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Quote Reference
                </p>
                <p className="font-mono text-lg font-bold">
                  #{pkg.id.toUpperCase()}
                </p>
              </div>
              <div className="text-center border-l border-r border-border px-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Valid Until
                </p>
                <p className="font-medium flex items-center justify-center gap-2">
                  <RiCalendarLine className="size-4 text-primary" />
                  Feb 15, 2025
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Est. Duration
                </p>
                <p className="font-medium flex items-center justify-center gap-2">
                  <RiTimerLine className="size-4 text-primary" />
                  10 Days
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Link href={`/booking/${id}/flights`}>
                <Button
                  size="lg"
                  className="w-full md:w-auto px-12 h-14 text-lg gap-2"
                >
                  Start Booking <RiArrowRightLine className="size-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Takes about 5 minutes to complete
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
