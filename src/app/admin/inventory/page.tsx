"use client";

import { Navbar } from "@/components/shared";
import { hotels, cars, guides, flights } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RiSearchLine,
  RiAddLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiPlaneLine,
  RiEditLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import { useState } from "react";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<
    "hotels" | "cars" | "guides" | "flights"
  >("hotels");

  const renderContent = () => {
    switch (activeTab) {
      case "hotels":
        return (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Price/Night</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-muted/30">
                    <td className="p-4 font-medium text-foreground">
                      {hotel.name}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {hotel.location}
                    </td>
                    <td className="p-4 font-mono">${hotel.pricePerNight}</td>
                    <td className="p-4">★ {hotel.rating}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RiEditLine className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "cars":
        return (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4 font-medium">Vehicle</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Capacity</th>
                  <th className="p-4 font-medium">Price/Day</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-muted/30">
                    <td className="p-4 font-medium text-foreground text-left">
                      {car.brand} {car.name}
                    </td>
                    <td className="p-4 text-muted-foreground capitalize">
                      {car.type}
                    </td>
                    <td className="p-4">{car.capacity} Passengers</td>
                    <td className="p-4 font-mono">${car.pricePerDay}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RiEditLine className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "guides":
        return (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Languages</th>
                  <th className="p-4 font-medium">Experience</th>
                  <th className="p-4 font-medium">Price/Day</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {guides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-muted/30">
                    <td className="p-4 font-medium text-foreground">
                      {guide.name}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {guide.languages.join(", ")}
                    </td>
                    <td className="p-4">{guide.experience} Years</td>
                    <td className="p-4 font-mono">${guide.pricePerDay}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RiEditLine className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "flights":
        return (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4 font-medium">Flight No.</th>
                  <th className="p-4 font-medium">Route</th>
                  <th className="p-4 font-medium">Time</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {flights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-muted/30">
                    <td className="p-4 font-medium text-foreground">
                      {flight.airline} {flight.flightNumber}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {flight.departureAirport} → {flight.arrivalAirport}
                    </td>
                    <td className="p-4">
                      {new Date(flight.departureTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-mono">${flight.price}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RiEditLine className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-muted/30 pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
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
                  className="pl-9 w-[250px]"
                />
              </div>
              <Button className="gap-2">
                <RiAddLine className="size-5" />
                Add New
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-6 border-b border-border pb-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("hotels")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "hotels" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <RiHotelLine className="size-4" /> Hotels
            </button>
            <button
              onClick={() => setActiveTab("cars")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "cars" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <RiCarLine className="size-4" /> Cars
            </button>
            <button
              onClick={() => setActiveTab("guides")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "guides" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <RiUserStarLine className="size-4" /> Guides
            </button>
            <button
              onClick={() => setActiveTab("flights")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "flights" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <RiPlaneLine className="size-4" /> Flights
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </>
  );
}
