import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TripInfo, Selections, FilterState } from "@/lib/plan_trip-types";

interface TripState {
  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Trip Details
  tripInfo: TripInfo;
  updateTripInfo: (info: Partial<TripInfo>) => void;

  // Selections
  selections: Selections;
  setSelections: (
    selections: Partial<Selections> | ((prev: Selections) => Selections),
  ) => void;

  // UI State (Not persisted, but kept in store for easy access if needed,
  // though hook handles local UI state like activeTab often)
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Actions
  resetTrip: () => void;
}

const initialTripInfo: TripInfo = {
  departureCity: "",
  arrivalDate: "",
  departureDate: "",
  adults: 2,
  children: 0,
  tripPurpose: "leisure",
  specialRequests: "",
  name: "",
  email: "",
  phone: "",
  destination: "",
};

const initialSelections: Selections = {
  hotel: null,
  car: null,
  carWithDriver: false,
  guide: null,
};

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      currentStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),

      tripInfo: initialTripInfo,
      updateTripInfo: (info) =>
        set((state) => ({
          tripInfo: { ...state.tripInfo, ...info },
        })),

      selections: initialSelections,
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

      activeTab: "hotels",
      setActiveTab: (tab) => set({ activeTab: tab }),

      resetTrip: () =>
        set({
          currentStep: 1,
          tripInfo: initialTripInfo,
          selections: initialSelections,
          activeTab: "hotels",
        }),
    }),
    {
      name: "vizit-trip-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        tripInfo: state.tripInfo,
        selections: state.selections,
        activeTab: state.activeTab,
      }),
    },
  ),
);
