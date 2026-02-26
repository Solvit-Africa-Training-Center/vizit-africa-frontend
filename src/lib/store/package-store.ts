import { create } from "zustand";
import { persist } from "zustand/middleware";

// flexible item shape used by the package builder — not the strict backend BookingItem
export interface PackageItem {
  id?: string | number;
  tempId?: string;
  serviceId?: string | number;
  service?: string | number; // Alias for UI
  title?: string;
  description?: string;
  type?: string;
  itemType?: string;
  quantity?: number;
  price?: number;
  quotePrice?: number;
  unitPrice?: number;
  isQuoted?: boolean;
  withDriver?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  // flight specifics
  departure?: string | null;
  departureTime?: string | null;
  arrival?: string | null;
  arrivalTime?: string | null;
  returnDate?: string | null;
  returnTime?: string | null;
  isRoundTrip?: boolean;
  // arbitrary extra fields from the builder UI
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

interface PackageState {
  // map booking id to items
  drafts: Record<string, PackageItem[]>;

  // actions
  addItem: (bookingId: string, item: PackageItem) => void;
  updateItem: (
    bookingId: string,
    itemId: string,
    updates: Partial<PackageItem>,
  ) => void;
  removeItem: (bookingId: string, itemId: string) => void;
  setItems: (bookingId: string, items: PackageItem[]) => void;
  clearDraft: (bookingId: string) => void;

  // selectors
  getItems: (bookingId: string) => PackageItem[];
}

export const usePackageStore = create<PackageState>()(
  persist(
    (set, get) => ({
      drafts: {},

      addItem: (bookingId, item) =>
        set((state) => {
          const currentItems = state.drafts[bookingId] || [];
          return {
            drafts: {
              ...state.drafts,
              [bookingId]: [...currentItems, item],
            },
          };
        }),

      updateItem: (bookingId, itemId, updates) =>
        set((state) => {
          const currentItems = state.drafts[bookingId] || [];
          const updatedItems = currentItems.map((item) =>
            item.id === itemId || item.tempId === itemId
              ? { ...item, ...updates }
              : item,
          );
          return {
            drafts: {
              ...state.drafts,
              [bookingId]: updatedItems,
            },
          };
        }),

      removeItem: (bookingId, itemId) =>
        set((state) => {
          const currentItems = state.drafts[bookingId] || [];
          const filteredItems = currentItems.filter(
            (item) => item.id !== itemId && item.tempId !== itemId,
          );
          return {
            drafts: {
              ...state.drafts,
              [bookingId]: filteredItems,
            },
          };
        }),

      setItems: (bookingId, items) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [bookingId]: items,
          },
        })),

      clearDraft: (bookingId) =>
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[bookingId];
          return { drafts: newDrafts };
        }),

      getItems: (bookingId) => get().drafts[bookingId] || [],
    }),
    {
      name: "package-builder-storage-v3",
    },
  ),
);
