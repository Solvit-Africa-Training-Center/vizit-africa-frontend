export interface Flight {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  departureCity: string;
  departureAirport: string;
  departureTime: string;
  arrivalCity: string;
  arrivalAirport: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  cabinClass: "economy" | "business" | "first";
  price: number;
  currency: string;
  seatsAvailable?: number;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  stars: number;
  pricePerNight: number;
  amenities: string[];
  rating: number;
  location: string;
  image?: string;
}

export interface Car {
  id: string;
  model: string;
  category: "sedan" | "suv" | "van";
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuelType: string;
  features: string[];
  image?: string;
  withDriver?: boolean;
}

export interface Guide {
  id: string;
  name: string;
  type: string;
  description: string;
  price?: number;
  image?: string;
  // Booking Enhancements
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  isRoundTrip?: boolean;
  returnDate?: string; // ISO Date string
  data?: Record<string, any>;
}

export interface Experience {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration?: string;
  location?: string;
  image?: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  price: string | number;
  category: string;
  image?: string;
}

export type TripItemType =
  | "flight"
  | "hotel"
  | "car"
  | "guide"
  | "experience"
  | "service"
  | "note";

export interface TripItem {
  id: string;
  type: TripItemType;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  // Dates can be specific to this item
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  isRoundTrip?: boolean;
  returnDate?: string;
  // Store original data object for reference if needed
  data?: Flight | Hotel | Car | Guide | Experience | Service | any;
  quantity?: number;
  withDriver?: boolean;
}

export interface TripInfo {
  departureCity: string;
  arrivalDate: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  tripPurpose:
    | "leisure"
    | "business"
    | "honeymoon"
    | "family"
    | "adventure"
    | "other";
  specialRequests: string;
  name: string;
  email: string;
  phone: string;
  destination?: string;
}

export interface Selections {
  flight: Flight | null;
  hotel: Hotel | null;
  car: Car | null;
  carWithDriver: boolean;
  guide: Guide | null;
}

export interface FilterState {
  search: string;
  priceRange: "all" | "budget" | "mid" | "luxury";
  stars: "all" | "3" | "4" | "4+" | "5";
  category: "all" | "sedan" | "suv" | "van";
}
