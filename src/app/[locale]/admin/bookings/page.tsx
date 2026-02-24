import {
  RiCheckboxCircleLine,
} from "@remixicon/react";
import { getTranslations } from "next-intl/server";
import { getRequests } from "@/lib/simple-data-fetching";
import { AdminBookingCard } from "@/components/admin/AdminBookingCard";

export default async function BookingsPage() {
  const t = await getTranslations("Admin.bookings");
  const allBookings = await getRequests();
  // Filter for paid/confirmed requests
  const bookings = allBookings.filter(
    (b) => b.status === "confirmed" || b.status === "completed",
  );

  return (
    <div className="mx-auto max-w-9xl px-5 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <AdminBookingCard 
            key={booking.id} 
            booking={booking} 
            t={(key: string) => t(key)} 
          />
        ))}
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
