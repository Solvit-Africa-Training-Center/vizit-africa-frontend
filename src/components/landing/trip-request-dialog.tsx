"use client";

import * as React from "react";
import { format, differenceInDays } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Users,
  Minus,
  Plus,
  Info,
  Check,
  Phone,
  Plane,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTripStore } from "@/store/trip-store";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { RiPlaneLine, RiAddLine, RiArrowRightLine } from "@remixicon/react";

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

interface TripRequestDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function GuestSelector({
  guests,
  onChange,
}: {
  guests: GuestCount;
  onChange: (guests: GuestCount) => void;
}) {
  const updateGuest = (type: keyof GuestCount, delta: number) => {
    const newValue = Math.max(0, guests[type] + delta);
    const limits = { adults: 16, children: 15, infants: 5 };

    if (newValue <= limits[type]) {
      onChange({
        ...guests,
        [type]: newValue,
      });
    }
  };

  const totalGuests = guests.adults + guests.children + guests.infants;
  const totalWithoutInfants = guests.adults + guests.children;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            totalGuests === 0 && "text-muted-foreground",
          )}
        >
          <Users className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {totalGuests > 0 ? (
              <>
                {guests.adults > 0 &&
                  `${guests.adults} Adult${guests.adults !== 1 ? "s" : ""}`}
                {guests.children > 0 &&
                  `, ${guests.children} Child${guests.children !== 1 ? "ren" : ""}`}
                {guests.infants > 0 &&
                  `, ${guests.infants} Infant${guests.infants !== 1 ? "s" : ""}`}
              </>
            ) : (
              "Add guests"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium">Adults</p>
              <p className="text-sm text-muted-foreground">Age 13+</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuest("adults", -1)}
                disabled={guests.adults === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {guests.adults}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuest("adults", 1)}
                disabled={guests.adults >= 16}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium">Children</p>
              <p className="text-sm text-muted-foreground">Age 2-12</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuest("children", -1)}
                disabled={guests.children === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {guests.children}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuest("children", 1)}
                disabled={guests.children >= 15}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium">Infants</p>
              <p className="text-sm text-muted-foreground">Under 2</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuest("infants", -1)}
                disabled={guests.infants === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {guests.infants}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuest("infants", 1)}
                disabled={guests.infants >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {totalWithoutInfants > 0 && (
            <>
              <Separator />
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Maximum capacity: 16 guests. Infants don't count toward total.
                </p>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TripRequestDialog({
  trigger,
  open,
  onOpenChange,
}: TripRequestDialogProps) {
  const router = useRouter();
  const locale = useLocale();
  const { updateTripInfo, setSelections, tripInfo } = useTripStore();

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: tripInfo.departureDate ? new Date(tripInfo.departureDate) : undefined,
    to: tripInfo.returnDate ? new Date(tripInfo.returnDate) : undefined,
  });

  const [guests, setGuests] = React.useState<GuestCount>({
    adults: tripInfo.adults || 2,
    children: tripInfo.children || 0,
    infants: tripInfo.infants || 0,
  });

  const [contactInfo, setContactInfo] = React.useState({
    name: tripInfo.name || "",
    email: tripInfo.email || "",
    phone: tripInfo.phone || "",
    departureCity: tripInfo.departureCity || "",
    specialRequests: tripInfo.specialRequests || "",
    agreeToTerms: false,
    needFlight: true,
  });

  const updateContact = (updates: Partial<typeof contactInfo>) => {
    setContactInfo((prev) => ({ ...prev, ...updates }));
  };

  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  // Pricing preview logic
  const pricePerNight = 150;
  const basePrice = (nights || 1) * pricePerNight;
  const serviceFee = Math.round(basePrice * 0.12);
  const taxFee = Math.round(basePrice * 0.08);
  const totalPrice = basePrice + serviceFee + taxFee;

  const canSubmit =
    dateRange?.from &&
    contactInfo.departureCity.trim() &&
    contactInfo.name.trim() &&
    contactInfo.email.trim() &&
    contactInfo.agreeToTerms &&
    guests.adults > 0;

  const saveToStore = () => {
    updateTripInfo({
      departureCity: contactInfo.departureCity,
      departureDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      returnDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants,
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      specialRequests: contactInfo.specialRequests,
      destination: "Kigali",
    });

    if (contactInfo.needFlight) {
      setSelections((prev) => ({
        ...prev,
        flight: {
          id: "requested",
          airline: "Best Option",
          flightNumber: "TBD",
          departureCity: contactInfo.departureCity,
          arrivalCity: "Kigali",
          departureAirport: "TBD",
          arrivalAirport: "KGL",
          departureTime: dateRange?.from
            ? format(dateRange.from, "yyyy-MM-dd")
            : "",
          arrivalTime: "",
          duration: "",
          price: 0,
          cabinClass: "Economy",
          stops: 0,
        },
      }));
    } else {
      setSelections((prev) => ({ ...prev, flight: null }));
    }
  };

  const handleRequestQuote = () => {
    saveToStore();
    // Use query params to trigger expansion logic in usePlanTrip
    const params = new URLSearchParams();
    params.set("from", contactInfo.departureCity);
    params.set("to", "Kigali");
    if (dateRange?.from) params.set("depart", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to) params.set("return", format(dateRange.to, "yyyy-MM-dd"));
    
    router.push(`/${locale}/plan-trip?${params.toString()}`);
    onOpenChange?.(false);
  };

  const handleAddAddons = () => {
    saveToStore();
    // service=hotels expands Stay & Services section
    const params = new URLSearchParams();
    params.set("service", "hotels");
    if (contactInfo.departureCity) params.set("from", contactInfo.departureCity);
    
    router.push(`/${locale}/plan-trip?${params.toString()}`);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 border-b bg-gradient-to-r from-slate-50 to-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Plan Your Trip
              </DialogTitle>
              <DialogDescription className="mt-1">
                Complete your details for a personalized Kigali experience
              </DialogDescription>
            </div>
            {nights > 0 && (
              <Badge variant="secondary" className="mt-1">
                {nights} night{nights !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Location Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Location
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Departure City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Where are you flying from?"
                    value={contactInfo.departureCity}
                    onChange={(e) =>
                      updateContact({ departureCity: e.target.value })
                    }
                    className="h-11 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value="Kigali, Rwanda"
                    disabled
                    className="h-11 pl-9 bg-muted/50 disabled:cursor-default disabled:opacity-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date and Guest Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Trip Details
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Travel Dates <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11",
                        !dateRange && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM dd")} -{" "}
                              {format(dateRange.to, "MMM dd, yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM dd, yyyy")
                          )
                        ) : (
                          "Select dates"
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Guests <span className="text-destructive">*</span>
                </Label>
                <GuestSelector guests={guests} onChange={setGuests} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plane className="size-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Include Flights</Label>
                  <p className="text-xs text-muted-foreground">
                    We'll find the best fares for your route.
                  </p>
                </div>
              </div>
              <Checkbox
                checked={contactInfo.needFlight}
                onCheckedChange={(checked) =>
                  updateContact({ needFlight: checked as boolean })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={contactInfo.name}
                    onChange={(e) => updateContact({ name: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+250 ..."
                      value={contactInfo.phone}
                      onChange={(e) => updateContact({ phone: e.target.value })}
                      className="h-11 pl-9"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={contactInfo.email}
                  onChange={(e) => updateContact({ email: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="requests" className="text-sm font-medium">
              Special Requests{" "}
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="requests"
              placeholder="Dietary requirements, accessibility, etc."
              value={contactInfo.specialRequests}
              onChange={(e) =>
                updateContact({ specialRequests: e.target.value })
              }
              className="h-11"
            />
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="rounded-xl border-2 bg-gradient-to-br from-slate-50 to-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Est. Quote Breakdown</h3>
                <Badge variant="outline" className="font-mono">
                  {nights}N
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Avg. Base Price ({nights} nights)
                  </span>
                  <span className="font-medium">
                    ${basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Service fee (12%)
                  </span>
                  <span className="font-medium">
                    ${serviceFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes (8%)</span>
                  <span className="font-medium">${taxFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-1">
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">Total Est.</span>
                    <span className="text-[10px] text-muted-foreground">
                      * Final quote via email in 48h
                    </span>
                  </div>
                  <span className="font-bold text-2xl">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3 rounded-lg border bg-muted/30 p-4">
            <Checkbox
              id="terms"
              checked={contactInfo.agreeToTerms}
              onCheckedChange={(checked) =>
                updateContact({ agreeToTerms: checked as boolean })
              }
              className="mt-1"
            />
            <div className="space-y-1">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                Final pricing depends on real-time availability.
              </p>
            </div>
          </div>
        </div>

        <CardFooter className="flex flex-col gap-3 border-t bg-slate-50/50 p-6 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleAddAddons}
            disabled={!dateRange?.from || !contactInfo.departureCity}
          >
            <RiAddLine className="mr-2 size-4" />
            Add Add-ons
          </Button>
          <Button
            className="w-full sm:flex-1"
            disabled={!canSubmit}
            onClick={handleRequestQuote}
          >
            {canSubmit ? (
              <>
                <RiArrowRightLine className="mr-2 size-4" />
                Request Quote Now
              </>
            ) : (
              "Complete Required Fields"
            )}
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}