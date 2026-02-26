"use client";

import * as React from "react";
import { differenceInDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useRouter } from "@/i18n/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useLocationAutocomplete } from "@/hooks/use-location-autocomplete";
import { useTripStore } from "@/store/trip-store";
import { SERVICE_FEE_RATE } from "@/lib/configs";
import type { TripItem } from "@/lib/plan_trip-types";

import type { GuestCount, TripRequestDialogProps } from "./types";
import { DialogHeader } from "./dialog-header";
import { TravelDates } from "./travel-dates";
import { QuickServices } from "./quick-services";
import { SelectedServices } from "./selected-services";
import { LocationDetails } from "./location-details";
import { Travelers } from "./travelers";
import { ContactInformation } from "./contact-information";
import { DialogFooter } from "./dialog-footer";

export type { GuestCount, ContactInfo, TripRequestDialogProps } from "./types";

export function TripRequestDialog({
  trigger,
  open,
  onOpenChange,
}: TripRequestDialogProps) {
  const router = useRouter();
  const store = useTripStore();
  const { tripInfo, updateTripInfo, items, addItem, removeItem } = store;

  const {
    departureDate,
    returnDate,
    adults = 2,
    children = 0,
    infants = 0,
    name = "",
    email = "",
    phoneNumber = "",
    departureCity = "",
    specialRequests = "",
  } = tripInfo;

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: departureDate ? new Date(departureDate) : undefined,
    to: returnDate ? new Date(returnDate) : undefined,
  });

  const [guests, setGuests] = React.useState<GuestCount>({
    adults,
    children,
    infants,
  });

  const [contactInfo, setContactInfo] = React.useState({
    name,
    email,
    phoneNumber,
    departureCity,
    specialRequests,
  });

  const updateContact = React.useCallback(
    (updates: Partial<typeof contactInfo>) => {
      setContactInfo((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const locationAutocomplete = useLocationAutocomplete({
    initialQuery: departureCity
  });
  const {
    query: departureQuery,
    setQuery: setDepartureQuery,
    suggestions: departureSuggestions,
    isSearching: isDepartureSearching,
    isLocating: isDepartureLocating,
    error: departureLocationError,
    detectCurrentLocation: detectCurrentDepartureLocation,
  } = locationAutocomplete;

  const handleDepartureChange = React.useCallback(
    (value: string) => {
      setDepartureQuery(value);
      updateContact({ departureCity: value });
    },
    [setDepartureQuery, updateContact],
  );

  const handleUseCurrentDepartureLocation = React.useCallback(async () => {
    const suggestion = await detectCurrentDepartureLocation();
    if (suggestion) handleDepartureChange(suggestion.name);
  }, [detectCurrentDepartureLocation, handleDepartureChange]);

  const handleGuestChange = (type: keyof GuestCount, delta: number) => {
    setGuests((prev) => {
      const newValue = prev[type] + delta;
      const limits = { adults: 16, children: 15, infants: 5 };

      if (newValue < 0) return prev;
      if (type === "adults" && newValue < 1) return prev;
      if (newValue > limits[type]) return prev;

      return { ...prev, [type]: newValue };
    });
  };

  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  // calculate items total
  const itemsTotal = items.reduce((acc, item) => {
    if (item.type === "guide") {
      return acc + (item.price || 0) * (nights || 1);
    }
    return acc + (item.price || 0);
  }, 0);

  const hasItems = items.length > 0;
  const estimatedPerNight = 150;
  const basePrice = hasItems ? itemsTotal : (nights || 1) * estimatedPerNight;

  const serviceFee = Math.round(basePrice * SERVICE_FEE_RATE);
  const totalPrice = basePrice + serviceFee;

  const totalGuests = guests.adults + guests.children + guests.infants;

  const canSubmit = !!(
    dateRange?.from &&
    dateRange?.to &&
    contactInfo.departureCity.trim() &&
    contactInfo.name.trim() &&
    contactInfo.email.trim() &&
    guests.adults > 0
  );

  const saveToStore = () => {
    updateTripInfo({
      departureCity: contactInfo.departureCity,
      departureDate: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : "",
      returnDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
      arrivalDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants,
      travelers: totalGuests,
      name: contactInfo.name,
      email: contactInfo.email,
      phoneNumber: contactInfo.phoneNumber,
      specialRequests: contactInfo.specialRequests,
      destination: "Kigali, Rwanda",
    });
  };

  const handleRequestQuote = () => {
    saveToStore();
    onOpenChange?.(false);
    router.push(`/plan-trip/review`);
  };

  const handleAddAddons = () => {
    saveToStore();
    onOpenChange?.(false);
    router.push(`/plan-trip`);
  };

  const toggleItem = React.useCallback(
    (itemId: string, itemData: TripItem) => {
      const exists = items.some((i) => i.id === itemId);
      if (exists) {
        removeItem(itemId);
      } else {
        addItem(itemData);
      }
    },
    [items, addItem, removeItem],
  );

  const itemsCount = items.length;
  const selectedItemsDisplay = items.map((item) => item.title).join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent
        className="sm:max-w-7xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col"
        showCloseButton={true}
      >
        <DialogHeader
          nights={nights}
          totalGuests={totalGuests}
          itemsCount={itemsCount}
          selectedItemsDisplay={selectedItemsDisplay}
        />

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-8">
              <TravelDates
                dateRange={dateRange}
                setDateRange={setDateRange}
              />

              <QuickServices
                items={items}
                toggleItem={toggleItem}
                removeItem={removeItem}
              />

              <SelectedServices
                items={items}
                removeItem={removeItem}
                hasItems={hasItems}
              />
            </div>

            <div className="space-y-6">
              <LocationDetails
                departureQuery={departureQuery}
                handleDepartureChange={handleDepartureChange}
                isDepartureSearching={isDepartureSearching}
                departureSuggestions={departureSuggestions}
                isDepartureLocating={isDepartureLocating}
                handleUseCurrentDepartureLocation={handleUseCurrentDepartureLocation}
                departureLocationError={departureLocationError}
              />

              <Separator />

              <Travelers
                guests={guests}
                handleGuestChange={handleGuestChange}
              />

              <Separator />

              <ContactInformation
                contactInfo={contactInfo}
                updateContact={updateContact}
              />
            </div>
          </div>
        </div>

        <DialogFooter
          hasItems={hasItems}
          totalPrice={totalPrice}
          nights={nights}
          handleAddAddons={handleAddAddons}
          dateRange={dateRange}
          contactInfo={contactInfo}
          handleRequestQuote={handleRequestQuote}
          canSubmit={canSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
