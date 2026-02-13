"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import {sampleRequests } from "@/lib/dummy-data";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiSettings3Line,
  RiBookmarkLine,
  RiSuitcaseLine,
  RiLogoutBoxRLine,
  RiPlaneLine,
} from "@remixicon/react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
// import { useUser } from "@/components/user-provider";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";

type Tab = "overview" | "trips" | "saved" | "settings";

const exampleResponseOfUser = {
  bio: "Travel enthusiast",
  email: "dontresor73@gmail.com",
  full_name: "John Doe",
  id: "173287d4-7aba-4b9c-8b2a-61a369927b1f",
  phone_number: "+250781234567",
  preferred_currency: "USD",
  role: "ADMIN",
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
    // const { user } = useUser();
  const t = useTranslations("Profile");
  const tCommon = useTranslations("Admin.requests.table.badges");

  const tabs = [
    { id: "overview", label: t("tabs.overview"), icon: RiMapPinLine },
    { id: "trips", label: t("tabs.trips"), icon: RiSuitcaseLine },
    { id: "saved", label: t("tabs.saved"), icon: RiBookmarkLine },
    { id: "settings", label: t("tabs.settings"), icon: RiSettings3Line },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                {t("header.title")}
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-medium text-foreground">
                {exampleResponseOfUser.full_name}'s Profile
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <RiLogoutBoxRLine className="size-4" />
                {t("header.signOut")}
              </Button>
            </div>
          </header>

          <div className="flex items-center gap-8 border-b border-border/50 mb-12 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2 pb-4 text-sm font-medium uppercase tracking-widest transition-all relative whitespace-nowrap",
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
                  <div className="group relative aspect-4/5 md:aspect-video lg:aspect-square overflow-hidden rounded-sm bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2600&auto=format&fit=crop"
                      alt={t("overview.nextTrip.imageAlt")}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between text-primary-foreground">
                      <div className="flex justify-between items-start">
                        <span className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full text-primary-foreground">
                          {t("overview.nextTrip.label")}
                        </span>
                        <div className="text-right">
                          <p className="text-3xl font-display font-medium">
                            14
                          </p>
                          <p className="text-xs font-mono uppercase opacity-80">
                            {t("overview.nextTrip.daysLeft")}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h2 className="font-display text-4xl md:text-5xl font-medium text-primary-foreground mb-2">
                          Rwanda Retreat
                        </h2>
                        <p className="text-lg font-light opacity-90 flex items-center gap-2">
                          <RiCalendarLine className="size-5" />
                          Mar 15 - Mar 22, 2025
                        </p>

                        <div className="mt-8 pt-8 border-t border-primary-foreground/10 grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              {t("overview.nextTrip.status")}
                            </p>
                            <p className="font-medium">
                              {t("overview.nextTrip.confirmed")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              {t("overview.nextTrip.travelers")}
                            </p>
                            <p className="font-medium">
                              2 {t("overview.nextTrip.adults")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h3 className="font-display text-2xl font-medium mb-2">
                        {t("overview.pendingRequests.title")}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-6">
                        Our experts are manually sourcing the best flight and
                        service options for your requests. Final quotes are
                        provided within 48 hours.
                      </p>
                      <div className="space-y-4">
                        {sampleRequests.map((req) => (
                          <div
                            key={req.id}
                            className="border border-border p-6 rounded-sm hover:border-primary transition-colors group bg-card"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-medium text-lg mb-1">
                                  {req.purpose}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="text-xs font-medium uppercase tracking-wider border border-border px-2 py-1 rounded-full text-muted-foreground">
                                {req.status}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {req.needsFlights && (
                                <span className="text-xs border border-border px-2 py-1 uppercase tracking-wider text-muted-foreground">
                                  {tCommon("flights")}
                                </span>
                              )}
                              {req.needsHotel && (
                                <span className="text-xs border border-border px-2 py-1 uppercase tracking-wider text-muted-foreground">
                                  {tCommon("hotels")}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-12">
                      <h3 className="font-display text-2xl font-medium mb-6">
                        {t("overview.stats.title")}
                      </h3>
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <p className="text-4xl font-display font-light text-primary">
                            01
                          </p>
                          <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                            {t("overview.stats.trips")}
                          </p>
                        </div>
                        <div>
                          <p className="text-4xl font-display font-light text-primary">
                            12
                          </p>
                          <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                            {t("overview.stats.days")}
                          </p>
                        </div>
                        <div>
                          <p className="text-4xl font-display font-light text-primary">
                            03
                          </p>
                          <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                            {t("overview.stats.reviews")}
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
                    <h2 className="font-display text-3xl font-medium">
                      {t("trips.title")}
                    </h2>
                    <Button>
                      <RiPlaneLine className="size-4 mr-2" />
                      {t("trips.planNew")}
                    </Button>
                  </div>
                  <div className="border-y border-border divide-y divide-border">
                    <div className="py-8 grid md:grid-cols-4 gap-6 items-center group">
                      <div className="md:col-span-2">
                        <h3 className="font-display text-2xl font-medium mb-2 group-hover:text-primary transition-colors">
                          Gorilla Trekking Adventure
                        </h3>
                        <p className="text-muted-foreground">
                          Mar 15 - Mar 22, 2025
                        </p>
                      </div>
                      <Badge variant="success-outline">Outbound</Badge>
                      <div className="text-right">
                        <Button variant="outline">
                          {t("trips.viewDetails")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <Empty>
                  <EmptyMedia>
                    <RiBookmarkLine className="size-8" />
                  </EmptyMedia>
                  <EmptyTitle>{t("saved.emptyTitle")}</EmptyTitle>
                  <EmptyDescription>{t("saved.emptyDescription")}</EmptyDescription>
                </Empty>
              )}

              {activeTab === "settings" && (
                <div className="max-w-2xl">
                  <h2 className="font-display text-3xl font-medium mb-8">
                    {t("settings.title")}
                  </h2>
                  <div className="space-y-6">
                    <div className="grid gap-2">
                       <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                         {t("settings.fullName")}
                       </Label>
                       <div className="border-b border-border py-2 text-lg">
                         {exampleResponseOfUser.full_name}
                       </div>
                    </div>
                    
                    <div className="grid gap-2">
                       <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                         {t("settings.email")}
                       </Label>
                       <div className="border-b border-border py-2 text-lg">
                         {exampleResponseOfUser.email}
                       </div>
                    </div>

                    <div className="grid gap-2">
                       <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                         Phone Number
                       </Label>
                       <div className="border-b border-border py-2 text-lg">
                         {exampleResponseOfUser.phone_number}
                       </div>
                    </div>

                    <div className="grid gap-2">
                       <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                         Bio
                       </Label>
                       <div className="border-b border-border py-2 text-lg">
                         {exampleResponseOfUser.bio}
                       </div>
                    </div>

                     <div className="grid gap-2">
                       <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                         Preferred Currency
                       </Label>
                       <div className="border-b border-border py-2 text-lg">
                         {exampleResponseOfUser.preferred_currency}
                       </div>
                    </div>

                    <div className="grid gap-2">
                       <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                         Role
                       </Label>
                       <div className="border-b border-border py-2 text-lg flex items-center gap-2">
                         <Badge variant="outline">{exampleResponseOfUser.role}</Badge>
                       </div>
                    </div>

                    <div className="pt-8">
                      <Button>{t("settings.save")}</Button>
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
