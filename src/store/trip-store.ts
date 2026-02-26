import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TripInfo, TripItem } from "@/lib/plan_trip-types";

type EntrySource =
  | "widget"
  | "destinations"
  | "services"
  | "flights"
  | "experiences"
  | "gallery"
  | "direct";

interface TripState {
  tripInfo: TripInfo;
  items: TripItem[];

  entrySource: EntrySource;

  hasActiveTrip: () => boolean;
  itemCount: () => number;
  getItem: (id: string) => TripItem | undefined;

  updateTripInfo: (info: Partial<TripInfo>) => void;
  setDestination: (destination: string) => void;
  setEntrySource: (source: EntrySource) => void;

  addItem: (item: TripItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<TripItem>) => void;
  clearTrip: () => void;
}

const initialTripInfo: TripInfo = {
  name: "",
  email: "",
  phoneNumber: "",
  destination: "",
  departureCity: "",
  arrivalDate: null,
  departureDate: null,
  returnDate: null,
  arrivalTime: null,
  departureTime: null,
  returnTime: null,
  travelers: 2,
  adults: 2,
  children: 0,
  infants: 0,
  tripPurpose: "leisure",
  specialRequests: "",
  needsFlights: true,
  needsHotel: true,
  needsCar: false,
  needsGuide: false,
  preferredCabinClass: "economy",
  hotelStarRating: "4",
  carTypePreference: "4x4",
  guideLanguages: ["English"],
};

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      tripInfo: initialTripInfo,
      items: [],
      entrySource: "direct" as EntrySource,

      hasActiveTrip: () => {
        const { items, tripInfo } = get();
        return (
          items.length > 0 ||
          !!tripInfo.destination ||
          !!tripInfo.specialRequests
        );
      },

      itemCount: () => {
        return get().items.length;
      },

      getItem: (id) => {
        return get().items.find((i) => i.id === id);
      },

      updateTripInfo: (info) =>
        set((state) => ({
          tripInfo: { ...state.tripInfo, ...info },
        })),

      setDestination: (destination) =>
        set((state) => ({
          tripInfo: { ...state.tripInfo, destination },
        })),

      setEntrySource: (source) => set({ entrySource: source }),

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) {
            return {
              items: state.items.map((i) => (i.id === item.id ? item : i)),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i,
          ),
        })),

      clearTrip: () =>
        set({
          tripInfo: initialTripInfo,
          items: [],
          entrySource: "direct" as EntrySource,
        }),
    }),
    {
      name: "vizit-trip-storage-v4",
      partialize: (state) => ({
        tripInfo: state.tripInfo,
        items: state.items,
        entrySource: state.entrySource,
      }),
    },
  ),
);
