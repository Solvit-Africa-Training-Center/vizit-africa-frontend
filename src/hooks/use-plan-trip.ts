import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type TripInfo,
  type TripItem,
  type Flight,
  type Hotel,
  type Car,
  type Guide,
} from "@/lib/plan_trip-types";
import { useTripStore } from "@/store/trip-store";

interface UsePlanTripProps {
  initialHotels?: Hotel[];
  initialCars?: Car[];
  initialGuides?: Guide[];
}

export function usePlanTrip(props?: UsePlanTripProps) {
  const searchParams = useSearchParams();
  const {
    tripInfo,
    items,
    updateTripInfo,
    addItem,
    removeItem,
    updateItem,
    clearTrip,
    setDestination,
    setEntrySource,
  } = useTripStore();

  const [activeTab, setActiveTab] = useState("hotels");
  const [hotelSearch, setHotelSearch] = useState("");
  const [hotelPriceFilter, setHotelPriceFilter] = useState<any>("all");
  const [hotelStarsFilter, setHotelStarsFilter] = useState<any>("all");
  const [carSearch, setCarSearch] = useState("");
  const [carCategoryFilter, setCarCategoryFilter] = useState<any>("all");
  const [hotelPage, setHotelPage] = useState(1);
  const [carPage, setCarPage] = useState(1);

  // Initialize from search params
  useEffect(() => {
    const destination = searchParams.get("destination");
    const departure = searchParams.get("departure");
    const arrival = searchParams.get("arrival");
    const returnDate = searchParams.get("return");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const source = searchParams.get("source") as any;

    const updates: Partial<TripInfo> = {};

    if (destination && tripInfo.destination !== destination)
      updates.destination = destination;
    if (departure && tripInfo.departureCity !== departure)
      updates.departureCity = departure;
    if (arrival && tripInfo.arrivalDate !== arrival)
      updates.arrivalDate = arrival;
    if (returnDate && tripInfo.returnDate !== returnDate)
      updates.returnDate = returnDate;
    if (adults) updates.adults = Number.parseInt(adults);
    if (children) updates.children = Number.parseInt(children);

    if (Object.keys(updates).length > 0) {
      updateTripInfo(updates);
    }

    if (source) {
      setEntrySource(source);
    }
  }, [searchParams, tripInfo, updateTripInfo, setEntrySource]);

  // Derived state
  const days = useMemo(() => {
    if (!tripInfo.departureDate || !tripInfo.returnDate) return 3;
    const start = new Date(tripInfo.departureDate);
    const ret = new Date(tripInfo.returnDate);
    const diffTime = Math.abs(ret.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }, [tripInfo.departureDate, tripInfo.returnDate]);

  const travelers = (tripInfo.adults || 0) + (tripInfo.children || 0);
  
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0), 0);
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  // Filters
  const filteredHotels = useMemo(() => {
    return (props?.initialHotels || []).filter((h) => 
      (h.name || h.title || "").toLowerCase().includes(hotelSearch.toLowerCase())
    );
  }, [props?.initialHotels, hotelSearch]);

  const filteredCars = useMemo(() => {
    return (props?.initialCars || []).filter((c) => 
      (c.model || c.title || "").toLowerCase().includes(carSearch.toLowerCase())
    );
  }, [props?.initialCars, carSearch]);

  const paginatedHotels = filteredHotels.slice((hotelPage - 1) * 6, hotelPage * 6);
  const paginatedCars = filteredCars.slice((carPage - 1) * 6, carPage * 6);
  const hotelTotalPages = Math.ceil(filteredHotels.length / 6);
  const carTotalPages = Math.ceil(filteredCars.length / 6);

  // Actions
  const addNote = (note: string) => {
    const noteItem: TripItem = {
      id: `note-${Date.now()}`,
      type: "note",
      title: "Trip Note",
      description: note,
      data: note,
      quantity: 1,
      price: 0,
    };
    addItem(noteItem);
  };

  const selections = useMemo(() => {
    const flight = items.find((i) => i.type === "flight")?.data as Flight;
    const hotel = items.find((i) => i.type === "hotel")?.data as Hotel;
    const carItem = items.find((i) => i.type === "car");
    const car = carItem?.data as Car;
    const guide = items.find((i) => i.type === "guide")?.data as Guide;

    return {
      flight: flight || null,
      hotel: hotel || null,
      car: car || null,
      carWithDriver: !!carItem?.withDriver,
      guide: guide || null,
    };
  }, [items]);

  return {
    tripInfo,
    items,
    days,
    travelers,
    subtotal,
    serviceFee,
    total,
    selections,
    updateTripInfo,
    addItem,
    removeItem,
    updateItem,
    clearTrip,
    setDestination,
    addNote,
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
    hotelTotalPages,
    carTotalPages,
    filteredHotels,
    filteredCars,
    paginatedHotels,
    paginatedCars,
    initialGuides: props?.initialGuides || [],
  };
}

export type UsePlanTripReturn = ReturnType<typeof usePlanTrip>;
