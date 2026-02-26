/**
 * Plan Trip Types
 * Specific types for the trip planning flow
 */

export interface Hotel {
  id: string | number;
  title: string;
  name?: string;
  description?: string;
  price: number;
  pricePerNight?: number;
  price_per_night?: number;
  image?: string;
  amenities?: string[];
  rating?: number;
  location?: string;
  address?: string;
  stars?: number;
}

export interface Car {
  id: string | number;
  title: string;
  model?: string;
  description?: string;
  price: number;
  pricePerDay?: number;
  image?: string;
  seats?: number;
  features?: string[];
  rating?: number;
  category?: string;
  transmission?: string;
  fuelType?: string;
  withDriver?: boolean;
}

export interface Guide {
  id: string | number;
  title: string;
  name?: string;
  description?: string;
  price: number;
  image?: string;
  experience?: string;
  languages?: string[];
  rating?: number;
  type?: string;
}

export interface TripInfo {
  name: string;
  email: string;
  phoneNumber: string;
  destination: string;
  departureCity: string;
  arrivalDate: string | null;
  departureDate: string | null;
  returnDate: string | null;
  arrivalTime: string | null;
  departureTime: string | null;
  returnTime: string | null;
  travelers: number;
  adults: number;
  children: number;
  infants: number;
  tripPurpose: string;
  specialRequests: string;
  needsFlights: boolean;
  needsHotel: boolean;
  needsCar: boolean;
  needsGuide: boolean;
  preferredCabinClass?: string | null;
  hotelStarRating?: string | null;
  carTypePreference?: string | null;
  budgetBracket?: string | null;
  guideLanguages?: string[];
}

export interface Experience {
  id: string | number;
  title: string;
  description?: string;
  price: number;
  image?: string;
  duration?: string;
  location?: string;
}

export interface Flight {
  id: string | number;
  title: string;
  price: number;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate?: string;
  airline?: string;
  flightNumber?: string;
}

export type TripItemType =
  | "flight"
  | "hotel"
  | "car"
  | "guide"
  | "transport"
  | "other"
  | "note"
  | "experience"
  | "activity"
  | "tour";

export interface TripItem {
  id: string;
  type: TripItemType;
  title: string;
  description?: string;
  price?: number;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  isRoundTrip?: boolean;
  withDriver?: boolean;
  returnDate?: string | null;
  returnTime?: string | null;
  quantity?: number;
  location?: string;
  metadata?: Record<string, any>;
  data?: any;
}

export type Service = Hotel | Car | Guide | Experience | Flight;

export interface FilterState {
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  [key: string]: any;
}
