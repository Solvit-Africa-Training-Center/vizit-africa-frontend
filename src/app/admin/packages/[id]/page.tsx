import {
  sampleRequests,
  flights,
  hotels,
  cars,
  guides,
} from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import {
  RiArrowLeftLine,
  RiSendPlaneLine,
  RiPlaneLine,
  RiBuilding2Line,
  RiCarLine,
  RiUserLine,
  RiAddLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import Link from "next/link";

interface PackageBuilderProps {
  params: Promise<{ id: string }>;
}

export default async function PackageBuilder({ params }: PackageBuilderProps) {
  const { id } = await params;

  const request = sampleRequests.find((r) => r.id === id) || sampleRequests[0];

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/requests"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <RiArrowLeftLine className="size-4" />
            Back to Requests
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Package Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a travel package for {request.name}
          </p>
        </div>
        <Button>
          <RiSendPlaneLine />
          Send Package
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-28">
            <h2 className="font-semibold text-foreground mb-4">
              Request Details
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p className="font-medium text-foreground">{request.name}</p>
                <p className="text-muted-foreground">{request.email}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Travel Dates</p>
                <p className="font-medium text-foreground">
                  {request.arrivalDate} → {request.departureDate}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Travelers</p>
                <p className="font-medium text-foreground">
                  {request.travelers} people
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Services Requested</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {request.needsFlights && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      Flights
                    </span>
                  )}
                  {request.needsHotel && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      Hotels
                    </span>
                  )}
                  {request.needsCar && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      Car Rental
                    </span>
                  )}
                  {request.needsGuide && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      Guide
                    </span>
                  )}
                </div>
              </div>

              {request.notes && (
                <div>
                  <p className="text-muted-foreground">Notes</p>
                  <p className="text-foreground">{request.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {request.needsFlights && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-primary-subtle flex items-center justify-center">
                    <RiPlaneLine className="size-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Flight Options
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  Add Flight
                </Button>
              </div>
              <div className="p-4 space-y-3">
                {flights.slice(0, 2).map((flight) => (
                  <div
                    key={flight.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {flight.airline} {flight.flightNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.departureAirport} → {flight.arrivalAirport} •{" "}
                          {flight.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        ${flight.price}
                      </span>
                      <button
                        type="button"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.needsHotel && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-primary-subtle flex items-center justify-center">
                    <RiBuilding2Line className="size-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Hotel Options
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  Add Hotel
                </Button>
              </div>
              <div className="p-4 space-y-3">
                {hotels.slice(0, 2).map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {hotel.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {hotel.area} • ★{hotel.rating}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        ${hotel.pricePerNight}/night
                      </span>
                      <button
                        type="button"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.needsCar && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-primary-subtle flex items-center justify-center">
                    <RiCarLine className="size-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Car Options</h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  Add Car
                </Button>
              </div>
              <div className="p-4 space-y-3">
                {cars.slice(0, 2).map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {car.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {car.capacity} passengers • {car.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        ${car.pricePerDay}/day
                      </span>
                      <button
                        type="button"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.needsGuide && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-primary-subtle flex items-center justify-center">
                    <RiUserLine className="size-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Guide Options
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  Add Guide
                </Button>
              </div>
              <div className="p-4 space-y-3">
                {guides.slice(0, 2).map((guide) => (
                  <div
                    key={guide.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {guide.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {guide.languages.join(", ")} • ★{guide.rating}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        ${guide.pricePerDay}/day
                      </span>
                      <button
                        type="button"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
