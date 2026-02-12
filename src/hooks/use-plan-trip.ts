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
import { flights } from "@/lib/dummy-data";

export function usePlanTrip() {
  const searchParams = useSearchParams();
  const {
    tripInfo,
    updateTripInfo,
    selections,
    setSelections,
    setEntrySource,
    addFlight,
    setDestination,
    addNote,
    resetTrip,
  } = useTripStore();

  // detect entry source and pre-fill from url params
  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const destination = searchParams.get("destination");
    const serviceType = searchParams.get("service");
    const flightId = searchParams.get("flight");
    const experienceId = searchParams.get("experience");
    const note = searchParams.get("note");
    const departDate = searchParams.get("depart");
    const returnDate = searchParams.get("return");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");
    const infantsParam = searchParams.get("infants");

    // pre-fill traveler counts + dates
    const updates: Partial<typeof tripInfo> = {};
    if (departDate && tripInfo.departureDate !== departDate)
      updates.departureDate = departDate;
    if (returnDate && tripInfo.returnDate !== returnDate)
      updates.returnDate = returnDate;
    if (adultsParam) updates.adults = parseInt(adultsParam);
    if (childrenParam) updates.children = parseInt(childrenParam);
    if (infantsParam) updates.infants = parseInt(infantsParam);
    if (from) updates.departureCity = from;
    if (to) updates.destination = to;
    if (Object.keys(updates).length > 0) updateTripInfo(updates);

    // detect source
    if (from || to) {
      setEntrySource("widget");
    } else if (flightId) {
      setEntrySource("flights");
      const match = flights.find((f) => f.id === flightId);
      if (match && !selections.flight) addFlight(match);
    } else if (destination) {
      setEntrySource("destinations");
      if (tripInfo.destination !== destination) setDestination(destination);
    } else if (serviceType) {
      setEntrySource("services");
    } else if (experienceId || note) {
      setEntrySource(experienceId ? "experiences" : "gallery");
      const newNote = note || `Interested in experience: ${experienceId}`;
      if (!tripInfo.specialRequests.includes(newNote)) addNote(newNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // local state for filters/pagination
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

  // which service tab is active (still used in services section)
  const [activeTab, setActiveTab] = useState(
    searchParams.get("service") || "hotels",
  );

  const days = useMemo(() => {
    if (!tripInfo.departureDate || !tripInfo.returnDate) return 3;
    const depart = new Date(tripInfo.departureDate);
    const ret = new Date(tripInfo.returnDate);
    const diff = Math.ceil(
      (ret.getTime() - depart.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 3;
  }, [tripInfo.departureDate, tripInfo.returnDate]);

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

  const travelers =
    tripInfo.adults + tripInfo.children + (tripInfo.infants || 0);

  const subtotal = useMemo(() => {
    let sum = 0;
    if (selections.flight) {
      const adultPrice = selections.flight.price;
      const infantPrice = Math.round(adultPrice * 0.1);
      const standardTravelers = tripInfo.adults + tripInfo.children;
      const infants = tripInfo.infants || 0;
      sum += standardTravelers * adultPrice + infants * infantPrice;
    }
    if (selections.hotel) sum += selections.hotel.pricePerNight * days;
    if (selections.car) {
      sum += selections.car.pricePerDay * days;
      if (selections.carWithDriver) sum += DRIVER_SURCHARGE * days;
    }
    if (selections.guide) sum += selections.guide.price;
    return sum;
  }, [selections, days, tripInfo.adults, tripInfo.children, tripInfo.infants]);

  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const total = subtotal + serviceFee;

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
    tripInfo,
    setTripInfo: updateTripInfo,
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

    resetHotelFilters,
    resetCarFilters,
    resetTrip,
  };
}
