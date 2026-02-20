"use client";

import { RiAddLine } from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createLocation, getLocations } from "@/actions/locations";
import { createService, updateService } from "@/actions/services";
import { getVendors } from "@/actions/vendors";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type LocationSuggestion,
  useLocationAutocomplete,
} from "@/hooks/use-location-autocomplete";
import type { LocationResponse } from "@/lib/schema/location-schema";
import {
  type CreateServiceInput,
  createServiceInputSchema,
  type ServiceResponse,
} from "@/lib/schema/service-schema";
import type { VendorResponse } from "@/lib/schema/vendor-schema";
import { VendorForm } from "./vendor-form";

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

  const vendors: VendorResponse[] = vendorsData || [];
  const locations: LocationResponse[] = locationsData || [];
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const {
    query: locationQuery,
    setQuery: setLocationQuery,
    suggestions: locationSuggestions,
    isSearching: isLocationSearching,
    isLocating: isLocatingUser,
    error: locationSearchError,
    clear: clearLocationAutocomplete,
    clearSuggestions: clearLocationSuggestions,
    detectCurrentLocation,
  } = useLocationAutocomplete({
    countryCodes: "rw,ke,tz,ug,za,ng,gh",
  });

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const localLocationSuggestions = locations
    .filter((item) =>
      item.name.toLowerCase().includes(locationQuery.trim().toLowerCase()),
    )
    .slice(0, 5);
  const remoteLocationNames = new Set(
    locationSuggestions.map((item) => item.name.toLowerCase()),
  );
  const filteredLocalLocationSuggestions = localLocationSuggestions.filter(
    (item) => !remoteLocationNames.has(item.name.toLowerCase()),
  );

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
    onSubmit: async ({ value, formApi }) => {
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
          clearLocationAutocomplete();
        }
        onSuccess?.(result.data);
      } else {
        toast.error(
          result.error || "Failed to save service. Please check the fields.",
        );
        const userError = result.fieldErrors?.user?.[0];
        setSubmitStatus({
          type: "error",
          message: userError || result.error || "Failed to save service.",
        });
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (Object.keys(value).includes(field)) {
              // @ts-ignore
              formApi.setFieldMeta(field, (prev) => ({
                ...prev,
                errors: errors,
              }));
            }
          });
        }
      }
    },
  });

  const queryClient = useQueryClient();

  const handleVendorCreated = (newVendor: VendorResponse) => {
    queryClient.invalidateQueries({ queryKey: ["vendors"] });
    if (newVendor.user !== undefined && newVendor.user !== null) {
      form.setFieldValue("user", String(newVendor.user));
    }
    setIsVendorDialogOpen(false);
    toast.success(`Vendor ${newVendor.business_name} selected`);
  };

  useEffect(() => {
    if (!initialData?.location || locationQuery.trim()) {
      return;
    }

    const currentLocation = locations.find((item) => {
      return String(item.id) === String(initialData.location);
    });

    if (currentLocation) {
      setLocationQuery(currentLocation.name);
    }
  }, [initialData?.location, locationQuery, locations, setLocationQuery]);

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
      clearLocationSuggestions();
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
    clearLocationSuggestions();
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  };

  const handleExistingLocationSelect = (
    field: { handleChange: (value: string | number | undefined) => void },
    location: { id: string | number; name: string },
  ) => {
    field.handleChange(location.id);
    setLocationQuery(location.name);
    clearLocationSuggestions();
  };

  const handleUseCurrentLocation = async (field: {
    handleChange: (value: string | number | undefined) => void;
  }) => {
    const suggestion = await detectCurrentLocation();
    if (!suggestion) {
      return;
    }
    await handleLocationSelect(field, suggestion);
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
                onValueChange={(val) =>
                  field.handleChange(val as typeof field.state.value)
                }
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
                    onValueChange={(val) =>
                      field.handleChange(val as string | number | null)
                    }
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
                            {vendors.map((vendor) => (
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
                onValueChange={(val) =>
                  field.handleChange(val as typeof field.state.value)
                }
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
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="location">Location</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={isLocatingUser}
                onClick={() => void handleUseCurrentLocation(field)}
              >
                Use my location
              </Button>
            </div>

            <Autocomplete
              value={locationQuery}
              onValueChange={(value, details) => {
                setLocationQuery(value);

                if (details.reason === "item-press") {
                  const matchedExternal = locationSuggestions.find(
                    (item) => item.name === value,
                  );
                  if (matchedExternal) {
                    void handleLocationSelect(field, matchedExternal);
                    return;
                  }

                  const matchedLocal = filteredLocalLocationSuggestions.find(
                    (item) => item.name === value,
                  );
                  if (matchedLocal) {
                    handleExistingLocationSelect(field, matchedLocal);
                    return;
                  }
                }

                if (
                  details.reason === "input-change" ||
                  details.reason === "input-clear"
                ) {
                  field.handleChange(undefined);
                }
              }}
            >
              <AutocompleteInput
                id="location"
                placeholder="Search city or country"
                onBlur={field.handleBlur}
              />
              <AutocompletePortal>
                <AutocompletePositioner>
                  <AutocompletePopup className="w-[var(--anchor-width)]">
                    <AutocompleteList className="max-h-56 overflow-y-auto">
                      {isLocationSearching ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Searching...
                        </div>
                      ) : null}

                      {!isLocationSearching
                        ? locationSuggestions.map((suggestion) => (
                            <AutocompleteItem
                              key={`remote-${suggestion.id}`}
                              value={suggestion.name}
                            >
                              {suggestion.name}
                            </AutocompleteItem>
                          ))
                        : null}

                      {!isLocationSearching
                        ? filteredLocalLocationSuggestions.map((item) => (
                            <AutocompleteItem
                              key={`local-${String(item.id)}`}
                              value={item.name}
                            >
                              {item.name}
                            </AutocompleteItem>
                          ))
                        : null}

                      {!isLocationSearching &&
                      locationSuggestions.length === 0 &&
                      filteredLocalLocationSuggestions.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Type at least 2 letters to search locations.
                        </div>
                      ) : null}
                    </AutocompleteList>
                  </AutocompletePopup>
                </AutocompletePositioner>
              </AutocompletePortal>
            </Autocomplete>

            {locationSearchError ? (
              <p className="text-xs text-destructive">{locationSearchError}</p>
            ) : null}

            {field.state.value && locationQuery.trim() ? (
              <p className="text-xs text-muted-foreground">
                Selected location: {locationQuery}
              </p>
            ) : null}
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <div className="pt-4 flex justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            form.reset();
            clearLocationAutocomplete();
            setSubmitStatus(null);
          }}
        >
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
