"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { FilterState } from "../lib/plan_trip-types";
import {
  MOCK_HOTELS,
  MOCK_CARS,
  DRIVER_SURCHARGE,
  SERVICE_FEE_RATE,
  ITEMS_PER_PAGE,
} from "../lib/plan-trip-data";
import { useTripStore } from "@/store/trip-store";

export function usePlanTrip() {
  const searchParams = useSearchParams();
  const {
    currentStep,
    setCurrentStep,
    tripInfo,
    updateTripInfo,
    selections,
    setSelections,
    activeTab,
    setActiveTab,
    resetTrip,
  } = useTripStore();

  // Handle URL params for deep linking
  // Handle URL params for deep linking
  useEffect(() => {
    const serviceType = searchParams.get("service");
    const experienceId = searchParams.get("experience");
    const destination = searchParams.get("destination");
    const note = searchParams.get("note");

    if (serviceType) {
      // If coming from a "Book" button on Services page
      setCurrentStep(3); // Jump to Services step
      if (["hotels", "cars", "guides"].includes(serviceType)) {
        setActiveTab(serviceType);
      }
    } else if (destination) {
      if (tripInfo.destination !== destination) {
        updateTripInfo({ destination });
      }
      setCurrentStep(1);
    } else if (experienceId || note) {
      // If coming from Experiences page or Gallery
      const newNote = note || `Interested in experience: ${experienceId}`;
      if (!tripInfo.specialRequests.includes(newNote)) {
        updateTripInfo({
          specialRequests: tripInfo.specialRequests
            ? `${tripInfo.specialRequests}\n${newNote}`
            : newNote,
        });
      }
      setCurrentStep(1); // Start at beginning but with context
    }
  }, [
    searchParams,
    setCurrentStep,
    setActiveTab,
    updateTripInfo,
    tripInfo.specialRequests,
    tripInfo.destination,
  ]);

  // Local state for filters/pagination (doesn't need persistence)
  const [hotelSearch, setHotelSearch] = useState("");
  const [hotelPriceFilter, setHotelPriceFilter] =
    useState<FilterState["priceRange"]>("all");
  const [hotelStarsFilter, setHotelStarsFilter] =
    useState<FilterState["stars"]>("all");
  const [carSearch, setCarSearch] = useState("");
  const [carCategoryFilter, setCarCategoryFilter] =
    useState<FilterState["category"]>("all");

  const [hotelPage, setHotelPage] = useState(1);
  const [carPage, setCarPage] = useState(1);

  const days = useMemo(() => {
    if (!tripInfo.arrivalDate || !tripInfo.departureDate) return 3;
    const arrival = new Date(tripInfo.arrivalDate);
    const departure = new Date(tripInfo.departureDate);
    const diff = Math.ceil(
      (departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 3;
  }, [tripInfo.arrivalDate, tripInfo.departureDate]);

  const filteredHotels = useMemo(() => {
    let result = MOCK_HOTELS;

    if (hotelSearch) {
      result = result.filter((h) =>
        h.name.toLowerCase().includes(hotelSearch.toLowerCase()),
      );
    }

    if (hotelPriceFilter !== "all") {
      result = result.filter((h) => {
        if (hotelPriceFilter === "budget") return h.pricePerNight < 150;
        if (hotelPriceFilter === "mid")
          return h.pricePerNight >= 150 && h.pricePerNight <= 200;
        if (hotelPriceFilter === "luxury") return h.pricePerNight > 200;
        return true;
      });
    }

    if (hotelStarsFilter !== "all") {
      result = result.filter((h) => {
        if (hotelStarsFilter === "5") return h.stars === 5;
        if (hotelStarsFilter === "4+") return h.stars >= 4;
        if (hotelStarsFilter === "3") return h.stars === 3;
        return true;
      });
    }

    return result;
  }, [hotelSearch, hotelPriceFilter, hotelStarsFilter]);

  const filteredCars = useMemo(() => {
    let result = MOCK_CARS;

    if (carSearch) {
      result = result.filter((c) =>
        c.model.toLowerCase().includes(carSearch.toLowerCase()),
      );
    }

    if (carCategoryFilter !== "all") {
      result = result.filter((c) => c.category === carCategoryFilter);
    }

    return result;
  }, [carSearch, carCategoryFilter]);

  const paginatedHotels = useMemo(() => {
    const start = (hotelPage - 1) * ITEMS_PER_PAGE;
    return filteredHotels.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHotels, hotelPage]);

  const paginatedCars = useMemo(() => {
    const start = (carPage - 1) * ITEMS_PER_PAGE;
    return filteredCars.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCars, carPage]);

  const hotelTotalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const carTotalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);

  useEffect(
    () => setHotelPage(1),
    [hotelSearch, hotelPriceFilter, hotelStarsFilter],
  );
  useEffect(() => setCarPage(1), [carSearch, carCategoryFilter]);

  const subtotal = useMemo(() => {
    let sum = 0;
    if (selections.hotel) sum += selections.hotel.pricePerNight * days;
    if (selections.car) {
      sum += selections.car.pricePerDay * days;
      if (selections.carWithDriver) sum += DRIVER_SURCHARGE * days;
    }
    if (selections.guide) sum += selections.guide.price;
    return sum;
  }, [selections, days]);

  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const total = subtotal + serviceFee;
  const travelers = tripInfo.adults + tripInfo.children;

  const canProceedToContact =
    tripInfo.departureCity &&
    tripInfo.arrivalDate &&
    tripInfo.departureDate &&
    tripInfo.adults >= 1;

  const canProceedToServices = tripInfo.name && tripInfo.email;
  // Relaxed requirement: allow proceeding if EITHER hotel OR car is selected, or neither (optional)
  // But strict mode: at least one service. Let's keep strict for now.
  const canProceedToReview =
    selections.hotel || selections.car || selections.guide;

  const resetHotelFilters = () => {
    setHotelSearch("");
    setHotelPriceFilter("all");
    setHotelStarsFilter("all");
  };

  const resetCarFilters = () => {
    setCarSearch("");
    setCarCategoryFilter("all");
  };

  return {
    currentStep,
    setCurrentStep,
    tripInfo,
    setTripInfo: updateTripInfo, // Map to store action
    selections,
    setSelections,
    activeTab,
    setActiveTab,

    hotelSearch,
    setHotelSearch,
    hotelPriceFilter,
    setHotelPriceFilter,
    hotelStarsFilter,
    setHotelStarsFilter,
    carSearch,
    setCarSearch,
    carCategoryFilter,
    setCarCategoryFilter,

    hotelPage,
    setHotelPage,
    carPage,
    setCarPage,

    days,
    travelers,
    subtotal,
    serviceFee,
    total,
    filteredHotels,
    filteredCars,
    paginatedHotels,
    paginatedCars,
    hotelTotalPages,
    carTotalPages,

    canProceedToContact,
    canProceedToServices,
    canProceedToReview,

    resetHotelFilters,
    resetCarFilters,
    resetTrip,
  };
}
