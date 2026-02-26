import type { FilterFn } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const IMAGE_PLACEHOLDER = `data:image/svg+xml;base64,${btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">Vizit Africa</text></svg>',
)}`;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const facetedFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const value = row.getValue(columnId) as string;
  return filterValue.includes(value);
};

export function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatTime(time?: string | null) {
  if (!time) return "";
  // If already in 12h format or has AM/PM, return as is
  if (time.includes("AM") || time.includes("PM")) return time;

  try {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
}

export const SERVICE_GROUPS = [
  "flight",
  "hotel",
  "car",
  "guide",
  "transport",
  "other",
  "note",
] as const;
export type ServiceGroupKey = (typeof SERVICE_GROUPS)[number];

export function normalizeServiceType(type?: string): ServiceGroupKey {
  const value = (type || "").toLowerCase();
  if (value.includes("note")) return "note";
  if (value.includes("flight")) return "flight";
  if (
    value.includes("hotel") ||
    value.includes("accommodation") ||
    value.includes("bnb")
  )
    return "hotel";
  if (
    value.includes("transport")
  )
    return "transport";
  if (
    value.includes("car") ||
    value.includes("vehicle")
  )
    return "car";
  if (
    value.includes("guide") ||
    value.includes("tour") ||
    value.includes("experience") ||
    value.includes("activity")
  )
    return "guide";
  return "other";
}
