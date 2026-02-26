"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { createVendorProfile, updateVendor } from "@/actions/vendors";
import { Button } from "@/components/ui/button";
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
  vendorSchema,
  type VendorResponse,
  createVendorInputSchema,
} from "@/lib/unified-types";

interface VendorFormProps {
  onSuccess?: (vendor: VendorResponse) => void;
  initialData?: VendorResponse;
}

export function VendorForm({ onSuccess, initialData }: VendorFormProps) {
  const form = useForm({
    defaultValues: {
      email: initialData?.email || "",
      fullName: initialData?.fullName || "",
      phoneNumber: initialData?.phoneNumber || "",
      bio: initialData?.bio || "",
      businessName: initialData?.businessName || "",
      vendorType: (initialData?.vendorType || "guide") as
        | "hotel"
        | "car_rental"
        | "guide"
        | "experience"
        | "transport"
        | "other",
      address: initialData?.address || "",
      website: initialData?.website || "",
    },
    validators: {
      onChange: createVendorInputSchema as any,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = initialData
          ? await updateVendor(initialData.id, value)
          : await createVendorProfile(value);

        if (result.success) {
          toast.success(initialData ? "Vendor updated" : "Vendor created");
          onSuccess?.(result.data);
        } else {
          let errorMessage = result.error || "Failed to save vendor.";

          if (result.fieldErrors) {
            const firstError = Object.values(
              result.fieldErrors,
            ).flat()[0] as string;
            if (firstError) {
              errorMessage = firstError;
            }

            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              if (Object.keys(value).includes(field)) {
                // @ts-expect-error
                formApi.setFieldMeta(field, (prev) => ({
                  ...prev,
                  errorMap: {
                    ...prev?.errorMap,
                    onSubmit: Array.isArray(errors)
                      ? errors.join(", ")
                      : errors,
                  },
                  errors: Array.isArray(errors) ? errors : [errors],
                }));
              }
            });
          }

          toast.error(errorMessage);
        }
      } catch (_error) {
        toast.error("An error occurred");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        children={(field) => (
          <div>
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="fullName"
        children={(field) => (
          <div>
            <Label htmlFor={field.name}>Full Name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="businessName"
        children={(field) => (
          <div>
            <Label htmlFor={field.name}>Business Name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="phoneNumber"
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Phone</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />

        <form.Field
          name="vendorType"
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Type</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => field.handleChange(val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="car_rental">Car Rental</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </div>

      <form.Field
        name="address"
        children={(field) => (
          <div>
            <Label htmlFor={field.name}>Address</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="website"
        children={(field) => (
          <div>
            <Label htmlFor={field.name}>Website</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://..."
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="bio"
        children={(field) => (
          <div>
            <Label htmlFor={field.name}>Bio / Description</Label>
            <Textarea
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <Button type="submit" disabled={form.state.isSubmitting}>
        {form.state.isSubmitting
          ? "Saving..."
          : initialData
            ? "Update Vendor"
            : "Create Vendor"}
      </Button>
    </form>
  );
}
