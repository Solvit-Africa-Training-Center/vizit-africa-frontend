import { samplePackage } from "@/lib/dummy-data";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { ProgressBar } from "@/components/booking/progress-bar";
import { PriceSummary } from "@/components/booking/price-summary";
import { GuideOptions } from "@/components/booking/guide-options";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine, RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingGuidesPage({ params }: PageProps) {
  const { id } = await params;
  const pkg = samplePackage;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Choose a Guide
            </h1>
            <p className="text-muted-foreground">
              Enhance your experience with a knowledgeable local guide.
            </p>
          </div>

          <ProgressBar currentStep={4} totalSteps={5} />

          <div className="mt-10 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {pkg.guides?.map((guide) => (
                  <GuideOptions key={guide.id} guide={guide} />
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Link href={`/booking/${id}/transport`}>
                  <Button variant="outline" className="gap-2">
                    <RiArrowLeftLine className="size-5" /> Back
                  </Button>
                </Link>
                <Link href={`/booking/${id}/payment`}>
                  <Button size="lg" className="gap-2">
                    Continue to Payment <RiArrowRightLine className="size-5" />
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
