"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  createServiceInputSchema,
  type CreateServiceInput,
  type ServiceResponse,
} from "@/lib/schema/service-schema";
import { createService, updateService } from "@/actions/services";
import { getVendors } from "@/actions/vendors";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteTrigger,
} from "@/components/ui/autocomplete";
import { createLocation, getLocations } from "@/actions/locations";

import { VendorForm } from "./vendor-form";
import { RiAddLine, RiCloseLine } from "@remixicon/react";
import { FieldError } from "@/components/ui/field";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type LocationSuggestion = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  source: "mapbox" | "open-meteo" | "db";
};

interface ServiceFormProps {
  initialData?: ServiceResponse;
  onSuccess?: (service: ServiceResponse) => void;
}

export function ServiceForm({ initialData, onSuccess }: ServiceFormProps) {
  const { data: vendorsData, isLoading: isVendorsLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const res = await getVendors();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await getLocations();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  const vendors = vendorsData || [];
  const locations = locationsData || [];
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState(
    initialData && initialData.location
      ? locations.find((l) => l.id === initialData.location)?.name || ""
      : "",
  );

  // If initial location is set but not in loaded locations yet, we might need a way to show it.
  // For now, simple logic.

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const localLocationSuggestions = locations
    .filter((item) =>
      item.name.toLowerCase().includes(locationQuery.trim().toLowerCase()),
    )
    .slice(0, 5);

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      service_type: (initialData?.service_type || "hotel") as
        | "hotel"
        | "car"
        | "activity"
        | "experience"
        | "tour"
        | "guide",
      description: initialData?.description || "",
      base_price: initialData ? Number(initialData.base_price) : 0,
      currency: initialData?.currency || "USD",
      capacity: initialData?.capacity || 1,
      status: (initialData?.status || "pending") as
        | "active"
        | "inactive"
        | "pending"
        | "deleted",
      location: initialData?.location as string | number | undefined,
      user: initialData?.user as string | number | null | undefined,
    },
    validators: {
      onChange: createServiceInputSchema as any,
    },
    onSubmit: async ({ value }) => {
      setSubmitStatus(null);
      const payload: CreateServiceInput = {
        ...value,
        location: value.location === "" ? undefined : value.location,
        user:
          value.user === "" || value.user === null || value.user === undefined
            ? undefined
            : typeof value.user === "string"
              ? value.user.trim()
              : value.user,
      };

      const result = initialData
        ? await updateService(initialData.id, payload)
        : await createService(payload);

      if (result.success) {
        toast.success(
          initialData
            ? "Service updated successfully"
            : "Service created successfully",
        );
        setSubmitStatus({
          type: "success",
          message: initialData
            ? "Service updated successfully."
            : "Service created successfully.",
        });
        if (!initialData) {
          form.reset();
          setLocationQuery("");
          setLocationSuggestions([]);
        }
        onSuccess?.(result.data);
      } else {
        toast.error(result.error);
        const userError = result.fieldErrors?.user?.[0];
        setSubmitStatus({
          type: "error",
          message: userError || result.error || "Failed to save service.",
        });
        if (result.fieldErrors) {
          console.error(result.fieldErrors);
          // @ts-ignore
          form.setErrors(result.fieldErrors);
        }
      }
    },
  });

  const queryClient = useQueryClient();

  const handleVendorCreated = (newVendor: any) => {
    queryClient.invalidateQueries({ queryKey: ["vendors"] });
    form.setFieldValue("user", String(newVendor.user));
    setIsVendorDialogOpen(false);
    toast.success(`Vendor ${newVendor.business_name} selected`);
  };

  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }

    // Don't search if query matches selected ID's name (avoid loop on creation)
    if (
      initialData &&
      locations.find((l) => l.id === initialData.location)?.name ===
        locationQuery
    ) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsLocationSearching(true);
        if (MAPBOX_ACCESS_TOKEN) {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              locationQuery,
            )}.json?autocomplete=true&types=country,region,place,locality&limit=5&access_token=${MAPBOX_ACCESS_TOKEN}`,
            { signal: controller.signal },
          );
          const data = await response.json();
          const suggestions = ((data.features || []) as any[]).map(
            (feature) => ({
              id: String(feature.id),
              name: String(feature.place_name),
              longitude: Number(feature.center?.[0]),
              latitude: Number(feature.center?.[1]),
              source: "mapbox" as const,
            }),
          );
          setLocationSuggestions(suggestions);
        } else {
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              locationQuery,
            )}&count=5&language=en&format=json`,
            { signal: controller.signal },
          );
          const data = await response.json();
          const suggestions = ((data.results || []) as any[]).map((item) => {
            const nameParts = [item.name, item.admin1, item.country].filter(
              Boolean,
            );
            return {
              id: String(item.id ?? `${item.latitude}-${item.longitude}`),
              name: nameParts.join(", "),
              latitude: Number(item.latitude),
              longitude: Number(item.longitude),
              source: "open-meteo" as const,
            };
          });
          setLocationSuggestions(suggestions);
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      } finally {
        setIsLocationSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [locationQuery]);

  const handleLocationSelect = async (
    field: { handleChange: (value: string | number | undefined) => void },
    suggestion: LocationSuggestion,
  ) => {
    const selectedName = suggestion.name.trim();
    const { longitude, latitude } = suggestion;

    const existingLocation = locations.find(
      (item) => item.name.toLowerCase() === selectedName.toLowerCase(),
    );

    if (existingLocation) {
      field.handleChange(existingLocation.id);
      setLocationQuery(existingLocation.name);
      setLocationSuggestions([]);
      return;
    }

    const createResult = await createLocation({
      name: selectedName,
      latitude,
      longitude,
    });

    if (!createResult.success) {
      toast.error(createResult.error);
      return;
    }

    field.handleChange(createResult.data.id);
    setLocationQuery(createResult.data.name);
    setLocationSuggestions([]);
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {submitStatus ? (
        <div
          className={
            submitStatus.type === "success"
              ? "rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
              : "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          }
        >
          {submitStatus.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="title">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                placeholder="e.g. Serengeti Safari 3 Days"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="service_type">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Select
                value={field.state.value}
                onValueChange={(val: any) => field.handleChange(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="tour">Tour</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the service..."
              className="min-h-[120px]"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="user">
        {(field) => (
          <div className="space-y-2">
            <Label>Vendor</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                {isVendorsLoading ? (
                  <div className="h-10 w-full animate-pulse rounded-md border border-input bg-muted" />
                ) : (
                  <Autocomplete
                    value={field.state.value ?? ""}
                    onValueChange={(val: any) => field.handleChange(val)}
                  >
                    <AutocompleteTrigger>
                      <span className="truncate">
                        {vendors.find(
                          (v) => String(v.user) === String(field.state.value),
                        )?.business_name || "Search vendor..."}
                      </span>
                    </AutocompleteTrigger>
                    <AutocompletePortal>
                      <AutocompletePositioner>
                        <AutocompletePopup>
                          <AutocompleteInput placeholder="Search vendors..." />
                          <AutocompleteList>
                            {vendors.map((vendor: any) => (
                              <AutocompleteItem
                                key={vendor.id}
                                value={String(vendor.user)}
                              >
                                {vendor.business_name}
                              </AutocompleteItem>
                            ))}
                          </AutocompleteList>
                        </AutocompletePopup>
                      </AutocompletePositioner>
                    </AutocompletePortal>
                  </Autocomplete>
                )}
              </div>

              <Dialog
                open={isVendorDialogOpen}
                onOpenChange={setIsVendorDialogOpen}
              >
                <DialogTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      title="Add New Vendor"
                    />
                  }
                >
                  <RiAddLine className="size-5" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Vendor</DialogTitle>
                  </DialogHeader>
                  <VendorForm onSuccess={handleVendorCreated} />
                </DialogContent>
              </Dialog>
            </div>
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form.Field name="base_price">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price</Label>
              <Input
                id="base_price"
                type="number"
                min="0"
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="currency">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={field.state.value}
                onValueChange={(val: any) => field.handleChange(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="RWF">RWF</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="capacity">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="location">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="location"
                  placeholder={
                    MAPBOX_ACCESS_TOKEN
                      ? "Search location (e.g. Kigali, Rwanda)"
                      : "Search existing locations or enter Location ID"
                  }
                  value={locationQuery}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setLocationQuery(nextValue);
                    if (
                      !MAPBOX_ACCESS_TOKEN &&
                      /^\d+$/.test(nextValue.trim())
                    ) {
                      field.handleChange(Number(nextValue.trim()));
                      return;
                    }
                    field.handleChange(undefined);
                  }}
                />
                {locationQuery ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => {
                      setLocationQuery("");
                      setLocationSuggestions([]);
                      field.handleChange(undefined);
                    }}
                  >
                    <RiCloseLine className="size-4" />
                  </Button>
                ) : null}
              </div>

              <div className="rounded-md border bg-background">
                {isLocationSearching ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    Searching...
                  </p>
                ) : locationSuggestions.length > 0 ? (
                  <div className="max-h-52 overflow-y-auto">
                    {locationSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => handleLocationSelect(field, suggestion)}
                      >
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                ) : localLocationSuggestions.length > 0 ? (
                  <div className="max-h-52 overflow-y-auto">
                    {localLocationSuggestions.map((item) => (
                      <button
                        key={String(item.id)}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          field.handleChange(item.id);
                          setLocationQuery(item.name);
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    Type country or city letters to search (for example: "Rwa",
                    "Ken", "Nai").
                  </p>
                )}
              </div>
            </div>

            {field.state.value ? (
              <p className="text-xs text-muted-foreground">
                Selected location ID: {String(field.state.value)}
              </p>
            ) : null}
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <div className="pt-4 flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          loading={form.state.isSubmitting}
          className="min-w-[150px]"
        >
          {form.state.isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Service"
              : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
