"use client";

import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RicheckDoubleLine,
  RiArrowRightLine,
  RiArrowLeftLine,
} from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ServiceSelectionPage() {
  const router = useRouter();

  const handleFinish = () => {
    // Navigate to a success/confirmation page (or back to home for now)
    router.push("/");
    // Trigger a toast or notification here in a real app
    alert("Request submitted! An admin will review it shortly.");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-50 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/request"
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RiArrowLeftLine className="size-4" />
              Back
            </Link>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Step 2 of 2
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Customize Your Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your trip by selecting specific preferences for each
              service. This helps us find the best options for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Flights Card */}
            <div className="bg-white p-6 rounded-xl border border-border hover:border-primary/50 transition-colors shadow-sm group">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <RiPlaneLine className="size-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <RicheckDoubleLine className="size-3" />
                  Selected
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Flights</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Round-trip options, airline preference, seat class
              </p>
              <Button
                variant="outline"
                className="w-full justify-between group-hover:border-primary/50 group-hover:text-primary"
              >
                Add Preferences <RiArrowRightLine className="size-4" />
              </Button>
            </div>

            {/* Hotels Card */}
            <div className="bg-white p-6 rounded-xl border border-border hover:border-primary/50 transition-colors shadow-sm group">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <RiHotelLine className="size-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <RicheckDoubleLine className="size-3" />
                  Selected
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Accommodations
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Hotel star rating, room types, specific amenities
              </p>
              <Button
                variant="outline"
                className="w-full justify-between group-hover:border-primary/50 group-hover:text-primary"
              >
                Add Preferences <RiArrowRightLine className="size-4" />
              </Button>
            </div>

            {/* Transport Card */}
            <div className="bg-white p-6 rounded-xl border border-border hover:border-primary/50 transition-colors shadow-sm group">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <RiCarLine className="size-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <RicheckDoubleLine className="size-3" />
                  Selected
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Transport</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Vehicle type, driver requirement, airport transfer
              </p>
              <Button
                variant="outline"
                className="w-full justify-between group-hover:border-primary/50 group-hover:text-primary"
              >
                Add Preferences <RiArrowRightLine className="size-4" />
              </Button>
            </div>

            {/* Guides Card */}
            <div className="bg-white p-6 rounded-xl border border-border hover:border-primary/50 transition-colors shadow-sm group">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <RiUserStarLine className="size-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  Optional
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Tour Guides
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Language preference, specialized tours, duration
              </p>
              <Button
                variant="outline"
                className="w-full justify-between group-hover:border-primary/50 group-hover:text-primary"
              >
                Select Options <RiArrowRightLine className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="w-full md:w-auto min-w-[300px] h-14 text-lg"
              onClick={handleFinish}
            >
              Submit Request
              <RiArrowRightLine className="ml-2 size-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              We'll review your request and send a custom package within 24
              hours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
