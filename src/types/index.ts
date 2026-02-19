export type UserRole = "CLIENT" | "ADMIN" | "VENDOR";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
  is_active?: boolean;
}

export type ItemType =
  | "flight"
  | "hotel"
  | "car"
  | "activity"
  | "custom"
  | "service";

export interface BookingItem {
  id: string;
  service?: string | null;
  item_type: ItemType;
  title: string;
  description?: string;
  start_date?: string | null;
  end_date?: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  status: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  service_details?: unknown;
}

export interface PackageQuoteItem {
  id?: string;
  service?: string;
  type: ItemType;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  metadata?: Record<string, unknown>;
}

export interface PackageQuote {
  status: "quoted" | "accepted" | "expired";
  sent_at: string;
  sent_by: string;
  currency: string;
  total_amount: number;
  items: PackageQuoteItem[];
  notes?: string;
  expires_at?: string;
  accepted_at?: string;
  accepted_by?: string;
}

export type BookingStatus =
  | "pending"
  | "quoted"
  | "confirmed"
  | "cancelled"
  | "completed";

// matches enriched BookingSerializer response
export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  arrivalDate?: string | null;
  departureDate?: string | null;
  travelers: number;
  adults: number;
  children: number;
  infants: number;
  needsFlights: boolean;
  needsHotel: boolean;
  needsCar: boolean;
  needsGuide: boolean;
  status: BookingStatus;
  currency: string;
  total_amount: number;
  specialRequests?: string;
  tripPurpose?: string;
  items: BookingItem[];
  quote?: PackageQuote | null;
  createdAt: string;
}

// admin response includes extra fields
export interface AdminBooking extends Booking {
  notes?: string;
  requestedItems?: RequestedItem[];
}

export interface RequestedItem {
  id?: string;
  service?: string;
  type: string;
  title: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
