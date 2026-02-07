"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { sampleBookings, sampleRequests } from "@/lib/dummy-data";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiFlightTakeoffLine,
  RiHotelBedLine,
  RiCarLine,
  RiCheckLine,
  RiTimeLine,
  RiUserSmileLine,
  RiAddLine,
} from "@remixicon/react";
import Link from "next/link";

export default function DashboardPage() {
  const activeTrip = sampleBookings[0];
  const pendingRequests = sampleRequests;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, Sarah
              </h1>
              <p className="text-muted-foreground">
                Manage your trips and view your travel history.
              </p>
            </div>
            <Link href="/plan-trip">
              <Button>
                <RiAddLine />
                Plan New Trip
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Active Trip
                </h2>
                <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-muted relative">
                    {/* placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-primary/10">
                      <RiMapPinLine className="size-12 opacity-20" />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary">
                      Confirmed
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold mb-1">
                          Gorilla Trekking Adventure
                        </h3>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <RiCalendarLine className="size-4" />
                          Mar 15 - Mar 22, 2025 • 2 Travelers
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Itinerary
                      </Button>
                    </div>

                    <div className="border-t border-border my-6" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {activeTrip.selectedFlight && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground font-medium uppercase">
                            Flight
                          </span>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <RiFlightTakeoffLine className="size-4 text-primary" />
                            {activeTrip.selectedFlight.airline}
                          </div>
                        </div>
                      )}
                      {activeTrip.selectedHotel && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground font-medium uppercase">
                            Stay
                          </span>
                          <div className="flex items-center gap-2 text-sm font-medium truncate">
                            <RiHotelBedLine className="size-4 text-primary" />
                            {activeTrip.selectedHotel.name}
                          </div>
                        </div>
                      )}
                      {activeTrip.selectedCar && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground font-medium uppercase">
                            Car
                          </span>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <RiCarLine className="size-4 text-primary" />
                            {activeTrip.selectedCar.name}
                          </div>
                        </div>
                      )}
                      {activeTrip.selectedGuide && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground font-medium uppercase">
                            Guide
                          </span>
                          <div className="flex items-center gap-2 text-sm font-medium truncate">
                            <RiUserSmileLine className="size-4 text-primary" />
                            {activeTrip.selectedGuide.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/30 px-6 py-4 border-t border-border flex items-center justify-between gap-2 overflow-x-auto text-sm">
                    <div className="flex items-center gap-2 text-accent-success font-medium whitespace-nowrap">
                      <div className="size-6 bg-accent-success rounded-full flex items-center justify-center text-white text-xs">
                        <RiCheckLine className="size-3" />
                      </div>
                      Booked
                    </div>
                    <div className="h-0.5 w-10 bg-accent-success shrink-0" />
                    <div className="flex items-center gap-2 text-primary font-medium whitespace-nowrap">
                      <div className="size-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                        2
                      </div>
                      Processing
                    </div>
                    <div className="h-0.5 w-10 bg-border shrink-0" />
                    <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                      <div className="size-6 bg-muted rounded-full flex items-center justify-center text-xs border border-border">
                        3
                      </div>
                      Travel Ready
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Pending Requests
                </h2>
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <RiTimeLine className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            Trip to Kigali ({req.purpose})
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Requested on{" "}
                            {new Date(req.createdAt).toLocaleDateString()} •{" "}
                            {req.travelers} Travelers
                          </p>
                          <div className="flex gap-2 mt-2">
                            {req.needsFlights && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                Flights
                              </span>
                            )}
                            {req.needsHotel && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                Hotels
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {req.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold mb-4">
                  Travel Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Total Trips
                    </span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Countries Visited
                    </span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Member Since
                    </span>
                    <span className="font-medium">Jan 2025</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                <h3 className="font-display text-lg font-bold mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available 24/7 to assist with your
                  bookings.
                </p>
                <Button variant="outline" className="w-full bg-white">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
