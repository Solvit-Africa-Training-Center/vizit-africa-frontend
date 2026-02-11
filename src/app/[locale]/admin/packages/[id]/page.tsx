"use client";

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
  RiStarLine,
} from "@remixicon/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { use } from "react";

function PackageBuilderContent({ id }: { id: string }) {
  const t = useTranslations("Admin.packages");
  const tCommon = useTranslations("Admin.requests.table.badges");

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
            {t("back")}
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("createTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("subtitle")} {request.name}
          </p>
        </div>
        <Button>
          <RiSendPlaneLine />
          {t("actions.sendQuote")}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-28">
            <h2 className="font-semibold text-foreground mb-4">
              {t("details.title")}
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("details.customer")}</p>
                <p className="font-medium text-foreground">{request.name}</p>
                <p className="text-muted-foreground">{request.email}</p>
              </div>

              <div>
                <p className="text-muted-foreground">{t("details.dates")}</p>
                <p className="font-medium text-foreground">
                  {request.arrivalDate} → {request.departureDate}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  {t("details.travelers")}
                </p>
                <p className="font-medium text-foreground">
                  {request.travelers} people
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">{t("details.services")}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {request.needsFlights && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("flights")}
                    </span>
                  )}
                  {request.needsHotel && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("hotels")}
                    </span>
                  )}
                  {request.needsCar && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("car")}
                    </span>
                  )}
                  {request.needsGuide && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("guide")}
                    </span>
                  )}
                </div>
              </div>

              {request.notes && (
                <div>
                  <p className="text-muted-foreground">{t("details.notes")}</p>
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
                    {tCommon("flights")} {t("actions.options")}
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  {t("actions.add")} {tCommon("flights")}
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
                    {tCommon("hotels")} {t("actions.options")}
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  {t("actions.add")} {tCommon("hotels")}
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
                          {hotel.area} •{" "}
                          <RiStarLine className="size-3.5 inline" />{" "}
                          {hotel.rating}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        ${hotel.pricePerNight}
                        {t("units.perNight")}
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
                  <h3 className="font-semibold text-foreground">
                    {" "}
                    {tCommon("car")} {t("actions.options")}
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  {t("actions.add")} {tCommon("car")}
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
                          {car.capacity} {t("units.passengers")} • {car.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        ${car.pricePerDay}
                        {t("units.perDay")}
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
                    {tCommon("guide")} {t("actions.options")}
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  <RiAddLine />
                  {t("actions.add")} {tCommon("guide")}
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
                        ${guide.pricePerDay}
                        {t("units.perDay")}
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

interface PackageBuilderProps {
  params: Promise<{ id: string }>;
}

export default function PackageBuilder({ params }: PackageBuilderProps) {
  const { id } = use(params);
  return <PackageBuilderContent id={id} />;
}
