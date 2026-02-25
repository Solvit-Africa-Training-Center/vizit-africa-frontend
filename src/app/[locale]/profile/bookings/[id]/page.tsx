import { notFound } from "next/navigation";
import { getBookingById } from "@/actions/bookings";
import { getSession } from "@/lib/auth/session";
import BookingDetailClient from "./booking-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Parallelize data fetching to avoid waterfalls
  const [session, bookingResult] = await Promise.all([
    getSession(),
    getBookingById(id),
  ]);

  if (!session) {
    notFound();
  }

  if (!bookingResult.success || !bookingResult.data) {
    notFound();
  }

  return <BookingDetailClient initialBooking={bookingResult.data} />;
}
