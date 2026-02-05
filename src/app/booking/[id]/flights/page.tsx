import { samplePackage } from "@/lib/dummy-data";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { ProgressBar } from "@/components/booking/progress-bar";
import { PriceSummary } from "@/components/booking/price-summary";
import { FlightSelector } from "@/components/booking/flight-selector";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingFlightsPage({ params }: PageProps) {
  const { id } = await params;
  const pkg = samplePackage; // mock fetch

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-8">
            <Link
              href={`/booking/${id}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground mb-2 inline-block"
            >
              ← Back to Overview
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Select Your Flight
            </h1>
            <p className="text-muted-foreground">
              Choose the best flight option for your schedule and budget.
            </p>
          </div>

          <ProgressBar currentStep={1} totalSteps={5} />

          <div className="mt-10 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {pkg.flights?.map((flight) => (
                <FlightSelector key={flight.id} flight={flight} />
              ))}

              <div className="flex justify-end pt-4">
                <Link href={`/booking/${id}/accommodations`}>
                  <Button size="lg" className="gap-2">
                    Continue to Hotels <RiArrowRightLine className="size-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <PriceSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
