import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { ProgressBar } from "@/components/booking/progress-bar";
import { PriceSummary } from "@/components/booking/price-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RiArrowLeftLine,
  RiSecurePaymentLine,
  RiBankCardLine,
  RiSmartphoneLine,
  RiBankLine,
} from "@remixicon/react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPaymentPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Review and Pay
            </h1>
            <p className="text-muted-foreground">
              Review your trip details and complete your booking securely.
            </p>
          </div>

          <ProgressBar currentStep={5} totalSteps={5} />

          <div className="mt-10 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Payment Methods */}
              <div className="bg-white p-8 rounded-xl border border-border">
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <RiSecurePaymentLine className="size-6 text-primary" />
                  Payment Method
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="border-2 border-primary bg-primary/5 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all">
                    <RiBankCardLine className="size-8 text-primary" />
                    <span className="font-medium text-primary">
                      Credit Card
                    </span>
                  </div>
                  <div className="border border-border hover:border-primary/50 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all text-muted-foreground hover:text-foreground">
                    <RiSmartphoneLine className="size-8" />
                    <span className="font-medium">Mobile Money</span>
                  </div>
                  <div className="border border-border hover:border-primary/50 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all text-muted-foreground hover:text-foreground">
                    <RiBankLine className="size-8" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Cardholder Name
                    </label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <Input placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry Date</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVC</label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Link href={`/booking/${id}/guides`}>
                  <Button variant="outline" className="gap-2">
                    <RiArrowLeftLine className="size-5" /> Back
                  </Button>
                </Link>
                <Button size="lg" className="gap-2 px-8">
                  Confirm Booking <RiSecurePaymentLine className="size-5" />
                </Button>
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
