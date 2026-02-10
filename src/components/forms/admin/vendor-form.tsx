"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  createVendorInputSchema,
  type CreateVendorInput,
} from "@/lib/schema/vendor-schema";
import { createVendorProfile } from "@/actions/vendors";
import { Label } from "@/components/ui/label";
// Using standard inputs for now, or could use InputGroup if consistent
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VendorFormProps {
  onSuccess?: (vendor: any) => void;
}

export function VendorForm({ onSuccess }: VendorFormProps) {
  // const t = useTranslations("Admin.vendors"); // Assuming translations exist or will fallback

  const form = useForm({
    defaultValues: {
      business_name: "",
      vendor_type: "individual",
      description: "",
      contact_phone: "",
      address: "",
      website: "",
    },
    validators: {
      onChange: createVendorInputSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await createVendorProfile(value);
      if (result.success) {
        toast.success("Vendor created successfully");
        onSuccess?.(result.data);
      } else {
        toast.error(result.error);
        if (result.fieldErrors) {
          console.error(result.fieldErrors);
        }
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
      <form.Field name="business_name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              placeholder="e.g. Safari Adventures Ltd"
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

      <form.Field name="vendor_type">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="vendor_type">Vendor Type</Label>
            <Select
              value={field.state.value}
              onValueChange={(val: any) => field.handleChange(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="company">Company</SelectItem>
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

      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell us about the vendor..."
              value={field.state.value || ""}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="contact_phone">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone (Optional)</Label>
              <Input
                id="contact_phone"
                value={field.state.value || ""}
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

        <form.Field name="website">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                placeholder="https://..."
                value={field.state.value || ""}
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
      </div>

      <form.Field name="address">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              value={field.state.value || ""}
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

      <div className="pt-2 flex justify-end">
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? "Creating..." : "Create Vendor"}
        </Button>
      </div>
    </form>
  );
}
