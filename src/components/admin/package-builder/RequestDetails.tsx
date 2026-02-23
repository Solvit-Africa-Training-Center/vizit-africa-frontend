import React, { useState } from "react";
import { format } from "date-fns";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiUser2Line,
  RiPhoneLine,
  RiMailLine,
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiAlertLine,
} from "@remixicon/react";
import { type Booking } from "@/lib/unified-types";
import { Badge } from "@/components/ui/badge";

interface RequestDetailsProps {
  request: Booking;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  const [expandNotes, setExpandNotes] = useState(false);

  const departureDate = request.departureDate
    ? new Date(request.departureDate)
    : null;
  const returnDate = request.returnDate ? new Date(request.returnDate) : null;
  const isRoundTrip = !!returnDate;

  const nights =
    departureDate && returnDate
      ? Math.ceil(
          (returnDate.getTime() - departureDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

  const totalTravelers =
    (request.adults || 0) + (request.children || 0) + (request.infants || 0);

  const requestedServices = [
    {
      key: "flights",
      label: "Flights",
      icon: RiPlaneLine,
      check: request.needsFlights,
    },
    {
      key: "hotel",
      label: "Hotel",
      icon: RiHotelLine,
      check: request.needsHotel,
    },
    {
      key: "car",
      label: "Car Rental",
      icon: RiCarLine,
      check: request.needsCar,
    },
    {
      key: "guide",
      label: "Tour Guide",
      icon: RiUserStarLine,
      check: request.needsGuide,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-5 sticky top-36 shadow-sm max-h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="font-semibold text-foreground mb-4 border-b border-border pb-2 text-sm uppercase tracking-wider">
        Request Details
      </h2>

      <div className="space-y-5 text-sm">
        {/* Traveler Info */}
        <div>
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <RiUser2Line className="size-4 text-muted-foreground" />
            Traveler Information
          </h3>
          <div className="space-y-2 ml-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase text-muted-foreground">
                Name
              </span>
              <Badge variant="outline" className="w-fit">
                {request.name || "Unnamed"}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase text-muted-foreground">
                Email
              </span>
              <div className="flex items-center gap-2">
                <RiMailLine className="size-3 text-muted-foreground" />
                <span className="text-xs break-all">
                  {request.email || "—"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase text-muted-foreground">
                Phone
              </span>
              <div className="flex items-center gap-2">
                <RiPhoneLine className="size-3 text-muted-foreground" />
                <span className="text-xs">{request.phone || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Group Composition */}
        <div>
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <RiUser2Line className="size-4 text-muted-foreground" />
            Travelers ({totalTravelers})
          </h3>
          <div className="grid grid-cols-3 gap-2 ml-6">
            {[
              { label: "Adults", value: request.adults || 0 },
              { label: "Children", value: request.children || 0 },
              { label: "Infants", value: request.infants || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-2 bg-muted rounded">
                <div className="text-lg font-semibold text-foreground">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Schedule */}
        <div>
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <RiCalendarLine className="size-4 text-muted-foreground" />
            Travel Schedule
          </h3>
          <div className="space-y-2 ml-6">
            <div>
              <span className="text-xs uppercase text-muted-foreground">
                Departure
              </span>
              <p className="font-mono text-xs">
                {departureDate
                  ? format(departureDate, "MMM dd, yyyy · HH:mm")
                  : "—"}
              </p>
            </div>
            {returnDate && (
              <div>
                <span className="text-xs uppercase text-muted-foreground">
                  Return
                </span>
                <p className="font-mono text-xs">
                  {format(returnDate, "MMM dd, yyyy · HH:mm")}
                </p>
              </div>
            )}
            {nights && (
              <div className="pt-2 border-t border-border">
                <Badge variant="secondary" className="text-xs">
                  {isRoundTrip ? "Round Trip" : "One Way"} • {nights} night
                  {nights !== 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Requested Services */}
        <div>
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <RiCheckLine className="size-4 text-muted-foreground" />
            Requested Services
          </h3>
          <div className="space-y-2 ml-6">
            {requestedServices.map(({ key, label, icon: Icon, check }) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className={`size-4 rounded border flex items-center justify-center ${
                    check
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  {check && <RiCheckLine className="size-3" />}
                </div>
                <Icon className="size-3 text-muted-foreground" />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trip Purpose */}
        {request.tripPurpose && (
          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <RiMapPinLine className="size-4 text-muted-foreground" />
              Trip Purpose
            </h3>
            <div className="ml-6">
              <p className="text-xs capitalize">
                {request.tripPurpose.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        )}

        {/* Special Requests */}
        {request.specialRequests && (
          <div>
            <button
              onClick={() => setExpandNotes(!expandNotes)}
              className="w-full font-medium text-foreground mb-2 flex items-center justify-between text-sm hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <RiAlertLine className="size-4 text-muted-foreground" />
                Special Requests
              </span>
              <RiArrowDownSLine
                className={`size-4 transition-transform ${expandNotes ? "scale-y-[-1]" : ""}`}
              />
            </button>
            {expandNotes && (
              <div className="mt-2 p-3 bg-muted rounded text-xs max-h-32 overflow-y-auto border-l-2 border-primary/50">
                {request.specialRequests}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
