import { getRequests } from "@/lib/simple-data-fetching";
import BookingsClient from "./bookings-client";

export default async function BookingsPage() {
  const allBookings = await getRequests();
  
  // Base filter for bookings that have been paid or completed
  const initialBookings = allBookings.filter(
    (b) => b.status === "paid" || b.status === "completed",
  );

  return <BookingsClient initialBookings={initialBookings} />;
}
