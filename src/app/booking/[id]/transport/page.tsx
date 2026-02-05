import { samplePackage } from "@/lib/dummy-data";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { ProgressBar } from "@/components/booking/progress-bar";
import { PriceSummary } from "@/components/booking/price-summary";
import { CarSelector } from "@/components/booking/car-selector";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine, RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingTransportPage({ params }: PageProps) {
  const { id } = await params;
  const pkg = samplePackage;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Select Transportation
            </h1>
            <p className="text-muted-foreground">
              Choose a vehicle that suits your group size and travel style.
            </p>
          </div>

          <ProgressBar currentStep={3} totalSteps={5} />

          <div className="mt-10 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {pkg.cars?.map((car) => (
                  <CarSelector key={car.id} car={car} />
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Link href={`/booking/${id}/accommodations`}>
                  <Button variant="outline" className="gap-2">
                    <RiArrowLeftLine className="size-5" /> Back
                  </Button>
                </Link>
                <Link href={`/booking/${id}/guides`}>
                  <Button size="lg" className="gap-2">
                    Continue to Guides <RiArrowRightLine className="size-5" />
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
