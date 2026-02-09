"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { sampleBookings, sampleRequests } from "@/lib/dummy-data";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiSettings3Line,
  RiBookmarkLine,
  RiSuitcaseLine,
  RiLogoutBoxRLine,
  RiPlaneLine,
} from "@remixicon/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type Tab = "overview" | "trips" | "saved" | "settings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const activeTrip = sampleBookings[0];

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          {/* Profile Header */}
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                Traveler Profile
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground">
                Sarah's Journey
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <RiLogoutBoxRLine className="size-4" />
                Sign Out
              </Button>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-border/50 mb-12 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: RiMapPinLine },
              { id: "trips", label: "My Trips", icon: RiSuitcaseLine },
              { id: "saved", label: "Saved", icon: RiBookmarkLine },
              { id: "settings", label: "Settings", icon: RiSettings3Line },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Next Trip Card */}
                  <div className="group relative aspect-[4/5] md:aspect-[16/9] lg:aspect-square overflow-hidden rounded-sm bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1571896349842-6e547ce2a79b?q=80&w=2600&auto=format&fit=crop"
                      alt="Next Trip"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <span className="bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                          Up Next
                        </span>
                        <div className="text-right">
                          <p className="text-3xl font-display font-bold">14</p>
                          <p className="text-xs font-mono uppercase opacity-80">
                            Days Left
                          </p>
                        </div>
                      </div>

                      <div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
                          Rwanda Retreat
                        </h2>
                        <p className="text-lg font-light opacity-90 flex items-center gap-2">
                          <RiCalendarLine className="size-5" />
                          Mar 15 - Mar 22, 2025
                        </p>

                        <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              Status
                            </p>
                            <p className="font-bold">Confirmed</p>
                          </div>
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              Travelers
                            </p>
                            <p className="font-bold">2 Adults</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity / Stats */}
                  <div className="space-y-12">
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-6">
                        Pending Requests
                      </h3>
                      <div className="space-y-4">
                        {sampleRequests.map((req) => (
                          <div
                            key={req.id}
                            className="border border-border p-6 rounded-sm hover:border-primary transition-colors group bg-card"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-bold text-lg mb-1">
                                  {req.purpose}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                {req.status}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {req.needsFlights && (
                                <span className="text-xs border border-border px-2 py-1 uppercase tracking-wider text-muted-foreground">
                                  Flights
                                </span>
                              )}
                              {req.needsHotel && (
                                <span className="text-xs border border-border px-2 py-1 uppercase tracking-wider text-muted-foreground">
                                  Hotels
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-12">
                      <h3 className="font-display text-2xl font-bold mb-6">
                        Your Stats
                      </h3>
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <p className="text-4xl font-display font-light text-primary">
                            01
                          </p>
                          <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                            Trips Taken
                          </p>
                        </div>
                        <div>
                          <p className="text-4xl font-display font-light text-primary">
                            12
                          </p>
                          <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                            Days Traveled
                          </p>
                        </div>
                        <div>
                          <p className="text-4xl font-display font-light text-primary">
                            03
                          </p>
                          <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                            Reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "trips" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-3xl font-bold">
                      Trip History
                    </h2>
                    <Button>
                      <RiPlaneLine className="size-4 mr-2" />
                      Plan New Trip
                    </Button>
                  </div>
                  <div className="border-y border-border divide-y divide-border">
                    {/* Re-using the active trip as a list item example */}
                    <div className="py-8 grid md:grid-cols-4 gap-6 items-center group">
                      <div className="md:col-span-2">
                        <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                          Gorilla Trekking Adventure
                        </h3>
                        <p className="text-muted-foreground">
                          Mar 15 - Mar 22, 2025
                        </p>
                      </div>
                      <div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          Upcoming
                        </span>
                      </div>
                      <div className="text-right">
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholders for other tabs */}
              {activeTab === "saved" && (
                <div className="text-center py-24 text-muted-foreground">
                  <RiBookmarkLine className="size-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-display font-bold mb-2">
                    No Saved Items
                  </h3>
                  <p>Items you bookmark will appear here.</p>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="max-w-2xl">
                  <h2 className="font-display text-3xl font-bold mb-8">
                    Account Settings
                  </h2>
                  <div className="space-y-8">
                    <div className="grid gap-4">
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value="Sarah Jenkins"
                        className="border-b border-border bg-transparent py-2 text-lg focus:outline-hidden focus:border-primary transition-colors"
                        readOnly
                      />
                    </div>
                    <div className="grid gap-4">
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value="sarah.j@example.com"
                        className="border-b border-border bg-transparent py-2 text-lg focus:outline-hidden focus:border-primary transition-colors"
                        readOnly
                      />
                    </div>
                    <div className="pt-8">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
