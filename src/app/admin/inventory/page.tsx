"use client";

import { useState } from "react";
import { hotels, cars, guides, flights } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  RiSearchLine,
  RiAddLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiPlaneLine,
} from "@remixicon/react";
import {
  hotelColumns,
  carColumns,
  guideColumns,
  flightColumns,
} from "./columns";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<
    "hotels" | "cars" | "guides" | "flights"
  >("hotels");

  const renderContent = () => {
    switch (activeTab) {
      case "hotels":
        return <DataTable columns={hotelColumns} data={hotels} />;
      case "cars":
        return <DataTable columns={carColumns} data={cars} />;
      case "guides":
        return <DataTable columns={guideColumns} data={guides} />;
      case "flights":
        return <DataTable columns={flightColumns} data={flights} />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Manage your travel assets and partner offerings.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              className="pl-9 w-[250px] bg-background"
            />
          </div>
          <Button>
            <RiAddLine />
            Add New
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-border pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("hotels")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "hotels" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <RiHotelLine className="size-4" /> Hotels
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cars")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "cars" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <RiCarLine className="size-4" /> Cars
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("guides")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "guides" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <RiUserStarLine className="size-4" /> Guides
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("flights")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "flights" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <RiPlaneLine className="size-4" /> Flights
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
