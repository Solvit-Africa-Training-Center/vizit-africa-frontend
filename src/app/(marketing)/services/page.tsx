"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { motion, AnimatePresence } from "motion/react";
import { RevealText } from "@/components/ui/reveal-text";
import { RiSearchLine, RiArrowRightUpLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Mock Data
type Category = "Hotels" | "BnBs" | "Car Rentals" | "Guides" | "All";
type SortOption =
  | "Recommended"
  | "Price: Low to High"
  | "Price: High to Low"
  | "A-Z";

interface Service {
  id: string;
  title: string;
  category: Category;
  description: string;
  price: string;
  image: string;
  details: string[];
}

const servicesData: Service[] = [
  // HOTELS
  {
    id: "the-retreat",
    title: "The Retreat by Heaven",
    category: "Hotels",
    description:
      "Kigali's premier luxury boutique hotel with solar-heated pools.",
    price: "From $450 / night",
    image:
      "https://images.unsplash.com/photo-1571896349842-6e547ce2a79b?q=80&w=2600&auto=format&fit=crop",
    details: [
      "11 Luxury Pool Villas.",
      "Fusion Restaurant & Bar.",
      "Wellness Spa & Gym.",
      "Located in peaceful Kiyovu.",
    ],
  },
  {
    id: "one-and-only",
    title: "One&Only Gorilla's Nest",
    category: "Hotels",
    description: "An exclusive front-row seat to the mountain gorillas.",
    price: "From $3,500 / night",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2600&auto=format&fit=crop",
    details: [
      "Nestled in Eucalyptus forest.",
      "Private lodges with fireplaces.",
      "Infinity pool overlooking volcanoes.",
      "Helipad access.",
    ],
  },

  // BnBs
  {
    id: "kigali-soul",
    title: "Kigali Soul Guesthouse",
    category: "BnBs",
    description: "A vibrant, artistic stay in the heart of Nyamirambo.",
    price: "From $80 / night",
    image:
      "https://images.unsplash.com/photo-1522771753035-7a58875b2da2?q=80&w=2600&auto=format&fit=crop",
    details: [
      "Locally crafted furniture.",
      "Rooftop terrace with city views.",
      "Home-cooked breakfast included.",
      "Walking distance to milk bars.",
    ],
  },
  {
    id: "lavender-home",
    title: "The Lavender Home",
    category: "BnBs",
    description:
      "Cozy, family-run bed and breakfast near the convention center.",
    price: "From $65 / night",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2600&auto=format&fit=crop",
    details: [
      "Lush garden setting.",
      "High-speed fiber internet.",
      "Airport shuttle available.",
      "Quiet residential neighborhood.",
    ],
  },

  // CAR RENTALS
  {
    id: "land-cruiser-v8",
    title: "Toyota Land Cruiser V8",
    category: "Car Rentals",
    description: "The ultimate safari vehicle for any terrain.",
    price: "$150 / day",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2600&auto=format&fit=crop",
    details: [
      "Pop-up roof for game viewing.",
      "Automatic Transmission.",
      "Includes comprehensive insurance.",
      "Driver available on request.",
    ],
  },
  {
    id: "rav4-hire",
    title: "Toyota RAV4 (New Model)",
    category: "Car Rentals",
    description: "Perfect for city driving and light off-road adventures.",
    price: "$80 / day",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2600&auto=format&fit=crop",
    details: [
      "Fuel efficient.",
      "Compact SUV comfort.",
      "Bluetooth Audio System.",
      "Unlimited mileage included.",
    ],
  },

  // GUIDES
  {
    id: "guide-alex",
    title: "Alex - Expert Birder",
    category: "Guides",
    description: "Specializing in the avian life of Akagera and Nyungwe.",
    price: "$100 / day",
    image:
      "https://images.unsplash.com/photo-1552423316-6950337c8651?q=80&w=2600&auto=format&fit=crop",
    details: [
      "10+ years field experience.",
      "High-end spotting scope provided.",
      "Photography assistance.",
      "Fluent in English and French.",
    ],
  },
  {
    id: "guide-sarah",
    title: "Sarah - Cultural Historian",
    category: "Guides",
    description: "Unraveling the deep history and future of Kigali.",
    price: "$120 / day",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2600&auto=format&fit=crop",
    details: [
      "Curated museum tours.",
      "Art gallery hopping.",
      "Contemporary history focus.",
      "Private vehicle included.",
    ],
  },
];

const categories: Category[] = [
  "All",
  "Hotels",
  "BnBs",
  "Car Rentals",
  "Guides",
];
const sortOptions: SortOption[] = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "A-Z",
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Recommended");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    let result = servicesData.filter((service) => {
      const matchesCategory =
        activeCategory === "All" || service.category === activeCategory;
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "Price: Low to High") {
      result.sort(
        (a, b) =>
          parseInt(a.price.replace(/\D/g, "")) -
          parseInt(b.price.replace(/\D/g, "")),
      );
    } else if (sortBy === "Price: High to Low") {
      result.sort(
        (a, b) =>
          parseInt(b.price.replace(/\D/g, "")) -
          parseInt(a.price.replace(/\D/g, "")),
      );
    } else if (sortBy === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    // "Recommended" uses default order

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-32 pb-24">
        {/* Editorial Header */}
        <header className="px-5 md:px-10 max-w-7xl mx-auto mb-20">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
            The Index
          </span>
          <h1 className="font-display text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
            <RevealText text="Our Services" />
          </h1>
          <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl leading-relaxed">
            Curated accommodations, reliable transport, and expert guides.
            Everything you need for the perfect journey.
          </p>
        </header>

        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="px-5 md:px-10 max-w-7xl mx-auto py-4 flex flex-col md:flex-row gap-6 md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <RiSearchLine className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none pl-8 py-2 text-lg focus:ring-0 focus:outline-hidden placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
                      activeCategory === cat
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="h-8 w-px bg-border hidden md:block" />

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono uppercase text-muted-foreground hidden md:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-sm font-bold uppercase tracking-wider border-none focus:ring-0 cursor-pointer text-foreground"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Services List (Accordion) */}
        <section className="px-5 md:px-10 max-w-7xl mx-auto py-12 min-h-[50vh]">
          <div className="flex flex-col">
            <AnimatePresence mode="popLayout">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    isExpanded={expandedId === service.id}
                    onToggle={() =>
                      setExpandedId(
                        expandedId === service.id ? null : service.id,
                      )
                    }
                  />
                ))
              ) : (
                <div className="py-24 text-center text-muted-foreground text-lg">
                  No services found matching your criteria.
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function ServiceItem({
  service,
  isExpanded,
  onToggle,
}: {
  service: Service;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-border/50 group"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left outline-hidden"
      >
        <div className="flex-1">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">
            {service.category}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h2>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
          <span className="font-mono text-sm md:text-base text-muted-foreground">
            {service.price}
          </span>
          <div
            className={cn(
              "size-12 rounded-full border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:text-primary",
              isExpanded ? "rotate-45" : "rotate-0",
            )}
          >
            <RiArrowRightUpLine className="size-6" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-12 md:pb-16 grid md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4 relative aspect-[4/3] rounded-sm overflow-hidden bg-muted">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-foreground/90">
                    {service.description}
                  </p>
                  <ul className="grid md:grid-cols-2 gap-4 mb-8">
                    {service.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors"
                  >
                    Book This Service
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
