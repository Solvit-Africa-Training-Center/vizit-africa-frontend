export type UserRole = 'CLIENT' | 'ADMIN' | 'VENDOR';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
  is_active?: boolean;
}

export type ItemType = 'flight' | 'hotel' | 'car' | 'activity' | 'custom' | 'service';

export interface BookingItem {
  id: string;
  service?: string; // ID of the service if linked
  item_type: ItemType;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  status: string;
  metadata?: Record<string, any>;
  created_at: string;
  service_details?: any; // For admin view only
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
  metadata?: Record<string, any>;
}

export interface PackageQuote {
  status: 'quoted' | 'accepted' | 'expired';
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

export type BookingStatus = 'pending' | 'quoted' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  // Guest/User Info
  name: string;
  email: string;
  phone: string;
  
  // Trip Details
  arrivalDate?: string;
  departureDate?: string;
  travelers: number;
  adults: number;
  children: number;
  infants: number;
  
  // Needs
  needsFlights: boolean;
  needsHotel: boolean;
  needsCar: boolean;
  needsGuide: boolean;
  
  // Meta
  status: BookingStatus;
  currency: string;
  total_amount: number;
  notes?: string;
  specialRequests?: string;
  tripPurpose?: string;
  createdAt: string;
  updatedAt?: string;
  
  // Relationships
  items: BookingItem[]; // Confirmed items
  requestedItems?: any[]; // Raw requests from form
  quote?: PackageQuote;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
