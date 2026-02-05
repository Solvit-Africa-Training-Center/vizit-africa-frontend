import { z } from "zod";

// INFO: schemas for type inference - replaces database schema

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  role: z.enum(["customer", "admin"]).default("customer"),
  createdAt: z.string(),
});

export const requestSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  arrivalDate: z.string(),
  departureDate: z.string(),
  travelers: z.number().min(1).max(20),
  purpose: z.enum(["tourism", "business", "conference", "other"]).optional(),
  needsFlights: z.boolean().default(true),
  needsHotel: z.boolean().default(false),
  needsCar: z.boolean().default(false),
  needsGuide: z.boolean().default(false),
  notes: z.string().optional(),
  status: z
    .enum(["pending", "building", "ready", "selected", "paid", "fulfilled"])
    .default("pending"),
  createdAt: z.string(),
});

export const flightSchema = z.object({
  id: z.string(),
  airline: z.string(),
  airlineLogo: z.string(),
  flightNumber: z.string(),
  departureCity: z.string(),
  departureAirport: z.string(),
  departureTime: z.string(),
  arrivalCity: z.string(),
  arrivalAirport: z.string(),
  arrivalTime: z.string(),
  returnDepartureDate: z.string().optional(),
  returnArrivalDate: z.string().optional(),
  duration: z.string(),
  stops: z.number(),
  cabinClass: z.enum(["economy", "business", "first"]),
  price: z.number(),
  currency: z.string().default("USD"),
  seatsAvailable: z.number(),
  notes: z.string().optional(),
});

export const hotelSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  area: z.string(),
  stars: z.number().min(1).max(5).optional(),
  rating: z.number().min(1).max(5),
  reviewCount: z.number(),
  description: z.string(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  pricePerNight: z.number(),
  currency: z.string().default("USD"),
  roomTypes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      capacity: z.number(),
      price: z.number(),
    }),
  ),
  available: z.boolean(),
  notes: z.string().optional(),
});

export const carSchema = z.object({
  id: z.string(),
  type: z.enum(["sedan", "suv", "van", "luxury"]),
  name: z.string(),
  brand: z.string(),
  image: z.string(),
  capacity: z.number(),
  luggage: z.number(),
  transmission: z.enum(["automatic", "manual"]),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  features: z.array(z.string()),
  pricePerDay: z.number(),
  withDriver: z.boolean().default(false),
  currency: z.string().default("USD"),
  available: z.boolean(),
  notes: z.string().optional(),
});

export const guideSchema = z.object({
  id: z.string(),
  name: z.string(),
  photo: z.string(),
  type: z.enum(["full-day", "half-day", "airport"]).optional(),
  languages: z.array(z.string()),
  specialties: z.array(z.string()),
  experience: z.number(),
  rating: z.number().min(1).max(5),
  reviewCount: z.number(),
  bio: z.string(),
  pricePerDay: z.number(),
  currency: z.string().default("USD"),
  available: z.boolean(),
  notes: z.string().optional(),
});

export const packageSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  flights: z.array(flightSchema).optional(),
  hotels: z.array(hotelSchema).optional(),
  cars: z.array(carSchema).optional(),
  guides: z.array(guideSchema).optional(),
  expiresAt: z.string(),
  status: z.enum(["draft", "sent", "selected", "paid"]).default("draft"),
  createdAt: z.string(),
});

export const bookingSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  userId: z.string().optional(),
  selectedFlight: flightSchema.optional(),
  selectedHotel: hotelSchema.optional(),
  selectedCar: carSchema.optional(),
  selectedGuide: guideSchema.optional(),
  subtotal: z.number(),
  serviceFee: z.number(),
  total: z.number(),
  currency: z.string().default("USD"),
  status: z
    .enum([
      "draft",
      "pending_payment",
      "paid",
      "fulfilled",
      "completed",
      "cancelled",
    ])
    .default("draft"),
  bookedAt: z.string(),
});

export const paymentSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  amount: z.number(),
  method: z.enum(["mobile_money", "bank_transfer", "card"]),
  provider: z.string(),
  transactionId: z.string().optional(),
  status: z.enum(["pending", "completed", "failed"]),
  paidAt: z.string().optional(),
  createdAt: z.string(),
});

export const fulfillmentSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  flightTicketsUploaded: z.boolean().default(false),
  hotelConfirmed: z.boolean().default(false),
  hotelConfirmationNumber: z.string().optional(),
  carArranged: z.boolean().default(false),
  carProvider: z.string().optional(),
  driverAssigned: z.string().optional(),
  itinerarySent: z.boolean().default(false),
  fullyConfirmed: z.boolean().default(false),
  notes: z.string().optional(),
  updatedAt: z.string(),
});

export const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  country: z.string(),
  avatar: z.string(),
  content: z.string(),
  rating: z.number().min(1).max(5),
});

export const galleryImageSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  category: z.enum(["hotels", "transport", "experiences"]),
  caption: z.string().optional(),
});

export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
  bio: z.string().optional(),
});

// INFO: inferred types for use throughout the application
export type User = z.infer<typeof userSchema>;
export type Request = z.infer<typeof requestSchema>;
export type Flight = z.infer<typeof flightSchema>;
export type Hotel = z.infer<typeof hotelSchema>;
export type Car = z.infer<typeof carSchema>;
export type Guide = z.infer<typeof guideSchema>;
export type Package = z.infer<typeof packageSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type Fulfillment = z.infer<typeof fulfillmentSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
