"use client";

import { RiPlaneLine, RiLayoutGridLine, RiListCheck2 } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { type Booking } from "@/lib/unified-types";
import { TripCard } from "./trip-card";
import { TripTimeline } from "./trip-timeline";
import { cn } from "@/lib/utils";

interface TripsTabProps {
  completedRequests: Booking[];
  isLoading: boolean;
}

export function TripsTab({ completedRequests, isLoading }: TripsTabProps) {
  const t = useTranslations("Profile");
  const [view, setView] = useState<"cards" | "timeline">("cards");
  const [selectedTripId, setSelectedId] = useState<string | null>(
    completedRequests[0]?.id ? String(completedRequests[0].id) : null
  );

  const selectedTrip = completedRequests.find(b => String(b.id) === selectedTripId);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-4xl font-medium tracking-tight">
            {t("trips.title")}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg">
            A curated record of your confirmed journeys and upcoming adventures across Africa.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-full border border-border/50 self-start">
          <button
            onClick={() => setView("cards")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest transition-all",
              view === "cards" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <RiLayoutGridLine className="size-3.5" />
            Cards
          </button>
          <button
            onClick={() => setView("timeline")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest transition-all",
              view === "timeline" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <RiListCheck2 className="size-3.5" />
            Timeline
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-16/10 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : completedRequests.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
          <div className="size-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <RiPlaneLine className="size-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">No confirmed trips yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            Your confirmed itineraries will appear here as soon as they're finalized and paid.
          </p>
          <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
            Start Planning a Trip
          </Button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === "cards" ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {completedRequests.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <TripCard booking={trip} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-12 gap-12"
            >
              {/* Trip Selector Side */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  Select Journey
                </h3>
                <div className="space-y-3">
                  {completedRequests.map(trip => (
                    <button
                      key={trip.id}
                      onClick={() => setSelectedId(String(trip.id))}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all duration-300",
                        selectedTripId === String(trip.id)
                          ? "border-primary/30 bg-primary/[0.03] shadow-md shadow-primary/5"
                          : "border-border/50 bg-card hover:border-primary/20"
                      )}
                    >
                      <p className="text-[10px] uppercase font-bold tracking-tighter text-primary/60 mb-1">
                        {trip.arrivalDate}
                      </p>
                      <h4 className="font-medium text-sm truncate">{trip.tripPurpose || "African Adventure"}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Detail Side */}
              <div className="lg:col-span-8">
                {selectedTrip ? (
                  <div className="space-y-10">
                    <div className="pb-8 border-b border-border">
                      <h3 className="font-display text-3xl font-medium mb-2">{selectedTrip.tripPurpose}</h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-2">
                        {selectedTrip.arrivalDate} — {selectedTrip.departureDate} • {selectedTrip.travelers} Travelers
                      </p>
                    </div>
                    <TripTimeline booking={selectedTrip} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border border-dashed rounded-3xl text-muted-foreground">
                    Select a trip to view detailed timeline
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

