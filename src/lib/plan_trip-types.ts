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
}

export interface Guide {
  id: string;
  type: string;
  description: string;
  price: number;
  languages: string[];
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
