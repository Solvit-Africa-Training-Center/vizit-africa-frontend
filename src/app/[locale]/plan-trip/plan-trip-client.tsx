"use client";

import {
  RiSparkling2Line,
  RiArrowRightLine,
  RiCalendarLine,
  RiUser3Line,
  RiMapPinLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiInformationLine,
  RiPlaneLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

import { Navbar } from "@/components/shared/navbar";
import { usePlanTrip } from "@/hooks/use-plan-trip";
import { useTripForm } from "@/hooks/use-trip-form";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogisticsSection,
  PreferencesSection,
  TripSummaryCard,
} from "@/components/plan-trip/detailed-planner";
import type { Car, Guide, Hotel } from "@/lib/plan_trip-types";

interface PlanTripClientProps {
  hotels: Hotel[];
  cars: Car[];
  guides: Guide[];
}

export default function PlanTripClient({
  hotels,
  cars,
  guides,
}: PlanTripClientProps) {
  const t = useTranslations("PlanTrip");
  const router = useRouter();
  const isMounted = useIsMounted();

  const planTrip = usePlanTrip({
    initialHotels: hotels,
    initialCars: cars,
    initialGuides: guides,
  });
  const form = useTripForm();

  const handleSubmit = async () => {
    const { name, email } = planTrip.tripInfo;
    if (!name || !email) {
      toast.error(t("messages.fillNameEmail"));
      return;
    }
    await form.form.handleSubmit();
  };

  if (!isMounted) {
    return (
      <>
        <Navbar forceSolid />
        <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-48 bg-muted rounded-full" />
            <p className="text-muted-foreground font-display uppercase tracking-widest text-xs">
              {t("messages.personalizing")}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-background pt-32 pb-24 px-5 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-border/50 pb-8">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="uppercase tracking-[0.2em] text-[10px] font-bold py-1 border-primary/30 text-primary"
              >
                {t("detailedPlanner.overline")}
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
                {t.rich("detailedPlanner.title", {
                  narrative: (chunks) => (
                    <span className="text-primary">{chunks}</span>
                  ),
                })}
              </h1>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push("/plan-trip/ai")}
              className="rounded-full h-12 px-6 bg-primary/5 border-primary/20 hover:bg-primary hover:text-white transition-all duration-500"
            >
              <RiSparkling2Line className="size-4 mr-2" />
              {t("detailedPlanner.buildWithAi")}
            </Button>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Logistics & Details */}
            <div className="lg:col-span-7 space-y-12">
              <LogisticsSection
                tripInfo={planTrip.tripInfo}
                updateTripInfo={planTrip.updateTripInfo}
              />

              <PreferencesSection
                tripInfo={planTrip.tripInfo}
                updateTripInfo={planTrip.updateTripInfo}
              />
            </div>

            {/* Right Column: Collection & Identity */}
            <div className="lg:col-span-5 space-y-8 sticky top-32">
              <TripSummaryCard
                tripInfo={planTrip.tripInfo}
                items={planTrip.items}
                updateTripInfo={planTrip.updateTripInfo}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

