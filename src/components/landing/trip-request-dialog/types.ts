import type { DateRange } from "react-day-picker";

export interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  departureCity: string;
  specialRequests: string;
}

export interface TripRequestDialogProps {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
