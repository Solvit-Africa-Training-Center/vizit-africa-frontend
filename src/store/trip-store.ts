import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TripInfo,
  Selections,
  Flight,
  Hotel,
  Car,
  Guide,
} from "@/lib/plan_trip-types";

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
  selections: Selections;
  entrySource: EntrySource;

  // computed-like helpers
  hasActiveTrip: () => boolean;
  itemCount: () => number;

  // granular update actions
  updateTripInfo: (info: Partial<TripInfo>) => void;
  setSelections: (
    selections: Partial<Selections> | ((prev: Selections) => Selections),
  ) => void;

  // convenience actions for "add to trip" pattern
  addFlight: (flight: Flight) => void;
  addHotel: (hotel: Hotel) => void;
  addCar: (car: Car, withDriver?: boolean) => void;
  addGuide: (guide: Guide) => void;
  addNote: (note: string) => void;
  setDestination: (destination: string) => void;
  setEntrySource: (source: EntrySource) => void;

  // removals
  removeFlight: () => void;
  removeHotel: () => void;
  removeCar: () => void;
  removeGuide: () => void;

  resetTrip: () => void;
}

const initialTripInfo: TripInfo = {
  departureCity: "",
  arrivalDate: "",
  departureDate: "",
  adults: 2,
  children: 0,
  infants: 0,
  tripPurpose: "leisure",
  specialRequests: "",
  name: "",
  email: "",
  phone: "",
  destination: "",
};

const initialSelections: Selections = {
  flight: null,
  hotel: null,
  car: null,
  carWithDriver: false,
  guide: null,
};

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      tripInfo: initialTripInfo,
      selections: initialSelections,
      entrySource: "direct" as EntrySource,

      hasActiveTrip: () => {
        const { selections, tripInfo } = get();
        return !!(
          selections.flight ||
          selections.hotel ||
          selections.car ||
          selections.guide ||
          tripInfo.destination ||
          tripInfo.specialRequests
        );
      },

      itemCount: () => {
        const { selections, tripInfo } = get();
        let count = 0;
        if (selections.flight) count++;
        if (selections.hotel) count++;
        if (selections.car) count++;
        if (selections.guide) count++;
        if (tripInfo.specialRequests) count++;
        return count;
      },

      updateTripInfo: (info) =>
        set((state) => ({
          tripInfo: { ...state.tripInfo, ...info },
        })),

      setSelections: (selectionsOrUpdater) =>
        set((state) => {
          const newSelections =
            typeof selectionsOrUpdater === "function"
              ? selectionsOrUpdater(state.selections)
              : selectionsOrUpdater;
          return {
            selections: { ...state.selections, ...newSelections },
          };
        }),

      addFlight: (flight) =>
        set((state) => ({
          selections: { ...state.selections, flight },
        })),

      addHotel: (hotel) =>
        set((state) => ({
          selections: { ...state.selections, hotel },
        })),

      addCar: (car, withDriver = false) =>
        set((state) => ({
          selections: { ...state.selections, car, carWithDriver: withDriver },
        })),

      addGuide: (guide) =>
        set((state) => ({
          selections: { ...state.selections, guide },
        })),

      addNote: (note) =>
        set((state) => ({
          tripInfo: {
            ...state.tripInfo,
            specialRequests: state.tripInfo.specialRequests
              ? `${state.tripInfo.specialRequests}\n${note}`
              : note,
          },
        })),

      setDestination: (destination) =>
        set((state) => ({
          tripInfo: { ...state.tripInfo, destination },
        })),

      setEntrySource: (source) => set({ entrySource: source }),

      removeFlight: () =>
        set((state) => ({
          selections: { ...state.selections, flight: null },
        })),

      removeHotel: () =>
        set((state) => ({
          selections: { ...state.selections, hotel: null },
        })),

      removeCar: () =>
        set((state) => ({
          selections: {
            ...state.selections,
            car: null,
            carWithDriver: false,
          },
        })),

      removeGuide: () =>
        set((state) => ({
          selections: { ...state.selections, guide: null },
        })),

      resetTrip: () =>
        set({
          tripInfo: initialTripInfo,
          selections: initialSelections,
          entrySource: "direct" as EntrySource,
        }),
    }),
    {
      name: "vizit-trip-storage",
      partialize: (state) => ({
        tripInfo: state.tripInfo,
        selections: state.selections,
        entrySource: state.entrySource,
      }),
    },
  ),
);
