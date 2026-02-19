import { Link } from "@/i18n/navigation";
import { getRequests } from "@/lib/data-fetching";
import {
  RiCheckboxCircleLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiUserLine,
} from "@remixicon/react";
import { getTranslations } from "next-intl/server";
import { formatDate } from "@/lib/utils";
import type { Booking } from "@/lib/schema/booking-schema";

export default async function BookingsPage() {
  const t = await getTranslations("Admin.bookings");
  const allBookings = await getRequests();
  // Filter for paid/confirmed requests
  const bookings = allBookings.filter(
    (b) => b.status === "confirmed" || b.status === "completed",
  );

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => {
          const hasFlight =
            booking.requestedItems?.some(
              (i) => i.type === "flight" || i.category === "flight",
            ) || booking.needsFlights;
          const hasHotel =
            booking.requestedItems?.some(
              (i) => i.type === "hotel" || i.category === "hotel",
            ) || booking.needsHotel;
          const hasCar =
            booking.requestedItems?.some(
              (i) => i.type === "car" || i.category === "car",
            ) || booking.needsCar;
          const hasGuide =
            booking.requestedItems?.some(
              (i) => i.type === "guide" || i.category === "guide",
            ) || booking.needsGuide;

          return (
            <div
              key={booking.id}
              className="bg-primary-foreground border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="p-5 border-b border-border bg-linear-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    #{booking.id.toUpperCase().substring(0, 8)}
                  </span>
                  <span
                    className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded ${booking.status === "confirmed" || booking.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <h3 className="font-display text-lg font-medium text-foreground mt-2">
                  {booking.tripPurpose || "Trip Request"}
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <RiUserLine className="size-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {booking.name} • {booking.travelers} {t("card.travelers")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RiCalendarLine className="size-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {booking.arrivalDate
                      ? formatDate(booking.arrivalDate)
                      : "N/A"}{" "}
                    -{" "}
                    {booking.departureDate
                      ? formatDate(booking.departureDate)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {hasFlight && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      {t("card.badges.flight")}
                    </span>
                  )}
                  {hasHotel && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      {t("card.badges.hotel")}
                    </span>
                  )}
                  {hasCar && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      {t("card.badges.car")}
                    </span>
                  )}
                  {hasGuide && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      {t("card.badges.guide")}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-border bg-muted/30">
                <Link
                  href={`/admin/bookings/${booking.id}/fulfill`}
                  className="flex items-center justify-between text-sm font-medium text-primary hover:underline"
                >
                  <span className="flex items-center gap-2">
                    <RiCheckboxCircleLine className="size-4" />
                    {t("card.manageFulfillment")}
                  </span>
                  <RiArrowRightLine className="size-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
          <RiCheckboxCircleLine className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">
            {t("empty.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("empty.description")}
          </p>
        </div>
      )}
    </div>
  );
}
