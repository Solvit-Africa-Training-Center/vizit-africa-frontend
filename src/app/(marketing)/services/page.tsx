"use client";

import { Navbar } from "@/components/shared";
import { services } from "@/lib/dummy-data";
import {
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiArrowRightLine,
  RiFilter3Line,
} from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const serviceIcons = {
  plane: RiPlaneLine,
  building: RiHotelLine,
  car: RiCarLine,
  user: RiUserStarLine,
};

const serviceLinks = {
  Flights: "/services/flights",
  Hotels: "/services/accommodations",
  "Car Rental": "/services/transport",
  Guides: "/services/guides",
};

export default function ServicesPage() {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Flights", "Hotels", "Transport", "Guides"];

  const filteredServices =
    filter === "All"
      ? services
      : services.filter((s) => {
          if (filter === "Transport") return s.title === "Car Rental";
          return s.title === filter;
        });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-50 pt-20">
        {/* Hero */}
        <section className="bg-primary-subtle py-16 md:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-5 md:px-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From flights to guided tours, we offer comprehensive travel
              solutions to make your Rwanda experience seamless and
              unforgettable.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border bg-white sticky top-16 z-10">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-2 mr-4 text-muted-foreground">
                <RiFilter3Line className="size-5" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === cat
                      ? "bg-primary text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 px-5 md:px-10 max-w-7xl mx-auto">
          <motion.div layout className="grid md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredServices.map((service) => {
                const Icon =
                  serviceIcons[service.icon as keyof typeof serviceIcons] ||
                  RiPlaneLine;
                const link =
                  serviceLinks[service.title as keyof typeof serviceLinks] ||
                  "/services";

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={service.title}
                    className="bg-white p-8 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="size-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="size-7" />
                      </div>
                      <Link
                        href={link}
                        className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
                      >
                        <RiArrowRightLine className="size-5" />
                      </Link>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg">
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {[1, 2, 3].map((i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm text-foreground/80"
                        >
                          <div className="size-1.5 rounded-full bg-primary" />
                          <span>Feature benefit {i} placeholder text</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={link}
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      Explore {service.title}
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Custom Package CTA */}
        <section className="bg-primary text-primary-foreground py-20 border-t border-border mt-8">
          <div className="px-5 md:px-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold mb-4">
                Need a custom package?
              </h2>
              <p className="text-lg opacity-90">
                We can combine any of these services into a personalized
                itinerary just for you. Tell us what you need, and we'll handle
                the rest.
              </p>
            </div>
            <Link
              href="/request"
              className="inline-flex items-center justify-center h-14 px-8 rounded-lg bg-white text-primary font-bold text-lg hover:bg-neutral-100 transition-colors shrink-0"
            >
              Request Custom Quote
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
