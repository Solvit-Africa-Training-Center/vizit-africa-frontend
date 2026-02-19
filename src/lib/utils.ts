import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FilterFn } from "@tanstack/react-table";

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
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
