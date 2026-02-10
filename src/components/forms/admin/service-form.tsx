"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  createServiceInputSchema,
  type CreateServiceInput,
} from "@/lib/schema/service-schema";
import { createService } from "@/actions/services";
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
  AutocompleteTrigger,
  AutocompleteValue,
} from "@/components/ui/autocomplete";

import { VendorForm } from "./vendor-form";
import { RiAddLine, RiSearchLine } from "@remixicon/react";

export function ServiceForm() {
  const { data: vendorsData, isLoading: isVendorsLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const res = await getVendors();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  const vendors = vendorsData || [];
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      service_type: "tour",
      description: "",
      base_price: 0,
      currency: "USD",
      capacity: 1,
      status: "draft",
      location: "",
      vendor: "",
    },
    validators: {
      onChange: createServiceInputSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await createService(value);
      if (result.success) {
        toast.success("Service created successfully");
      } else {
        toast.error(result.error);
        if (result.fieldErrors) {
          console.error(result.fieldErrors);
        }
      }
    },
  });

  const queryClient = useQueryClient();

  const handleVendorCreated = (newVendor: any) => {
    queryClient.invalidateQueries({ queryKey: ["vendors"] });
    form.setFieldValue("vendor", newVendor.id);
    setIsVendorDialogOpen(false);
    toast.success(`Vendor ${newVendor.business_name} selected`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-card rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Create New Service</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
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
                {field.state.meta.errors ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
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
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
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
              {field.state.meta.errors ? (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="vendor">
          {(field) => (
            <div className="space-y-2">
              <Label>Vendor</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  {isVendorsLoading ? (
                    <div className="h-10 w-full animate-pulse rounded-md border border-input bg-muted" />
                  ) : (
                    <Autocomplete
                      value={
                        vendors.find((v) => v.id === field.state.value) || null
                      }
                      onValueChange={(val: any) => field.handleChange(val?.id)}
                    >
                      <AutocompleteTrigger>
                        <AutocompleteValue placeholder="Search vendor..." />
                      </AutocompleteTrigger>
                      <AutocompletePopup>
                        <AutocompleteInput placeholder="Search vendors..." />
                        <AutocompleteList>
                          {vendors.map((vendor: any) => (
                            <AutocompleteItem key={vendor.id} value={vendor}>
                              {vendor.business_name}
                            </AutocompleteItem>
                          ))}
                        </AutocompleteList>
                      </AutocompletePopup>
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
              {field.state.meta.errors ? (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
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
                {field.state.meta.errors ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
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
                {field.state.meta.errors ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
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
                {field.state.meta.errors ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="location">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="location">Location ID</Label>
              <Input
                id="location"
                placeholder="Location ID (e.g. 1)"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter Location ID for now.
              </p>
              {field.state.meta.errors ? (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <div className="pt-4 flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            disabled={form.state.isSubmitting}
            className="min-w-[150px]"
          >
            {form.state.isSubmitting ? "Creating..." : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
