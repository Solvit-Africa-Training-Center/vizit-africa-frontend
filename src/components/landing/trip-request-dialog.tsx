"use client";

import * as React from "react";
import { format, differenceInDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTripStore } from "@/store/trip-store";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { 
  RiAddLine, 
  RiArrowRightLine, 
  RiSubtractLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiPlaneLine,
  RiSuitcaseLine,
  RiCheckboxCircleLine,
  RiUser2Line
} from "@remixicon/react";

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

interface TripRequestDialogProps {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TripRequestDialog({
  trigger,
  open,
  onOpenChange,
}: TripRequestDialogProps) {
  const router = useRouter();
  const locale = useLocale();
  const { updateTripInfo, tripInfo, items } = useTripStore();

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

  const handleGuestChange = (type: keyof GuestCount, delta: number) => {
    setGuests(prev => {
      const newValue = prev[type] + delta;
      const limits = { adults: 16, children: 15, infants: 5 };
      
      if (newValue < 0) return prev;
      if (type === 'adults' && newValue < 1) return prev;
      if (newValue > limits[type]) return prev;
      
      return { ...prev, [type]: newValue };
    });
  };

  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  // Calculate items total
  const itemsTotal = items.reduce((acc, item) => {
    if (item.type === "guide") {
      return acc + (item.price || 0) * (nights || 1);
    }
    return acc + (item.price || 0);
  }, 0);

  const hasItems = items.length > 0;
  const estimatedPerNight = 150;
  const basePrice = hasItems ? itemsTotal : (nights || 1) * estimatedPerNight;

  const serviceFee = Math.round(basePrice * 0.12);
  const taxFee = Math.round(basePrice * 0.08);
  const totalPrice = basePrice + serviceFee + taxFee;

  const totalGuests = guests.adults + guests.children + guests.infants;

  const canSubmit =
    dateRange?.from &&
    dateRange?.to &&
    contactInfo.departureCity.trim() &&
    contactInfo.name.trim() &&
    contactInfo.email.trim() &&
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
  };

  const handleRequestQuote = () => {
    saveToStore();
    router.push(`/${locale}/plan-trip/review`);
    onOpenChange?.(false);
  };

  const handleAddAddons = () => {
    saveToStore();
    router.push(`/${locale}/services`);
    onOpenChange?.(false);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "hotel": return RiHotelLine;
      case "car": return RiCarLine;
      case "guide": return RiUserStarLine;
      case "flight": return RiPlaneLine;
      default: return RiSuitcaseLine;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent 
        className="sm:max-w-7xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col"
        showCloseButton={true}
      >
        <div className="px-8 py-6 border-b bg-gradient-to-r from-primary/5 to-transparent shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
          
                Plan Your Journey
              </DialogTitle>
              <DialogDescription className="text-sm">
                Customize your Kigali experience with our premium planning service
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3 mr-5">
              {nights > 0 && (
                <Badge variant="secondary" className="font-mono">
                  {nights} {nights === 1 ? "night" : "nights"}
                </Badge>
              )}
              {totalGuests > 0 && (
                <Badge variant="outline" className="gap-1">
                  <RiUser2Line className="size-3" />
                  {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
                </Badge>
              )}
            </div>
          </div>
        </div>


        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
         
                  <h3 className="text-lg font-semibold">Travel Dates</h3>
                </div>
                <div>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    className="w-full"
                    classNames={{
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground font-semibold",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </div>

              {hasItems && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
  
                      <h3 className="text-lg font-semibold">Selected Services</h3>
                    </div>
                    <Badge variant="outline">{items.length} items</Badge>
                  </div>
                  <div className="rounded-xl border bg-card divide-y">
                    {items.map((item) => {
                      const Icon = getItemIcon(item.type);
                      return (
                        <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
                          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="size-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          <div className="text-sm font-semibold tabular-nums">
                            ${item.price?.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Location Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="departure" className="text-sm font-medium">
                      Departure City
                    </Label>
                    <Input
                      id="departure"
                      placeholder="e.g., New York, London, Tokyo"
                      value={contactInfo.departureCity}
                      onChange={(e) => updateContact({ departureCity: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Destination</Label>
                    <Input
                      value="Kigali, Rwanda"
                      disabled
                      className="h-11 bg-muted/50 text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Travelers</h3>
                </div>
                <div className="rounded-xl border bg-card divide-y">
                  {[
                    { key: 'adults', label: 'Adults', sub: 'Age 12+' },
                    { key: 'children', label: 'Children', sub: 'Age 2-11' },
                    { key: 'infants', label: 'Infants', sub: 'Under 2' }
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleGuestChange(key as keyof GuestCount, -1)}
                          disabled={guests[key as keyof GuestCount] <= (key === 'adults' ? 1 : 0)}
                        >
                          <RiSubtractLine className="size-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                          {guests[key as keyof GuestCount]}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleGuestChange(key as keyof GuestCount, 1)}
                        >
                          <RiAddLine className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div
                className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => updateContact({ needFlight: !contactInfo.needFlight })}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <RiPlaneLine className="size-5 text-primary" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium cursor-pointer">
                      Include Flight Booking
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      We'll find the best fares for you
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

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">

                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={contactInfo.name}
                      onChange={(e) => updateContact({ name: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={contactInfo.email}
                        onChange={(e) => updateContact({ email: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={contactInfo.phone}
                        onChange={(e) => updateContact({ phone: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requests" className="text-sm font-medium">
                      Special Requests
                      <span className="text-muted-foreground ml-1">(Optional)</span>
                    </Label>
                    <Textarea
                      id="requests"
                      placeholder="Any dietary requirements, accessibility needs, or special occasions..."
                      value={contactInfo.specialRequests}
                      onChange={(e) => updateContact({ specialRequests: e.target.value })}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              </div>

           
            </div>
          </div>
        </div>

        <div className="border-t bg-background px-8 py-6 shrink-0">
          <div className="flex items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {hasItems ? "Total Estimate" : "Estimated Total"}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary tabular-nums">
                  ${totalPrice.toLocaleString()}
                </span>
                {nights > 0 && (
                  <span className="text-sm text-muted-foreground">
                    for {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddAddons}
                disabled={!dateRange?.from || !contactInfo.departureCity}
                className="gap-2"
              >
                <RiAddLine className="size-4" />
                Add Extras
              </Button>
              <Button
                size="lg"
                onClick={handleRequestQuote}
                disabled={!canSubmit}
                className="gap-2 min-w-[180px]"
              >
                {canSubmit ? (
                  <>
                    Request Quote
                    <RiArrowRightLine className="size-4" />
                  </>
                ) : (
                  <>
                    <RiCheckboxCircleLine className="size-4" />
                    Complete Form
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}