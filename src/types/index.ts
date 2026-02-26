export type UserRole = "CLIENT" | "ADMIN" | "VENDOR";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  is_active?: boolean;
  bio?: string;
  preferred_currency?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
