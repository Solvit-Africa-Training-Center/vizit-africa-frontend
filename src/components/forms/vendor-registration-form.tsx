"use client";

import {
  RiAlertLine,
  RiArrowRightLine,
  RiBuildingLine,
  RiGlobalLine,
  RiLockPasswordLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { register } from "@/actions/auth";
import { registerVendor } from "@/actions/vendors";
import { useRouter } from "@/i18n/navigation";
import { 
  userSchema, 
  registerObjectSchema, 
  type RegisterInput,
  type CreateVendorInput 
} from "@/lib/unified-types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Combine schemas for the form
// We remove role from register as it's implied
const formSchema = registerObjectSchema.omit({ role: true }).extend({
  // Vendor specific fields from createVendorInputSchema
  // We omit fields that are already in registerInputSchema (email, full_name, phone_number)
  // EXCEPT bio which is in User but not in RegisterInput usually?
  // Wait, registerInputSchema has full_name, email, phone, password, re_password.
  // createVendorInputSchema has full_name, email, phone, bio, business_name, vendor_type, address, website.

  bio: z.string().optional(), // Make bio optional for registration
  business_name: z.string().min(2, "Business name is required"),
  vendor_type: z.enum([
    "hotel",
    "car_rental",
    "guide",
    "experience",
    "transport",
    "other",
  ]),
  address: z.string().min(1, "Address is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export function VendorRegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
      re_password: "",
      business_name: "",
      vendor_type: "hotel",
      address: "",
      website: "",
      bio: "",
    },
    validators: {
      // @ts-expect-error zod to tanstack adapter issue usually
      onChange: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setError(null);

      // 1. Register User
      const registerData: RegisterInput = {
        full_name: value.full_name,
        email: value.email,
        phone_number: value.phone_number,
        password: value.password,
        re_password: value.re_password,
        role: "VENDOR",
      };

      const registerResult = await register(registerData);

      if (!registerResult.success) {
        toast.error(
          registerResult.error ||
            "Registration failed. Please check the fields.",
        );
        setError(registerResult.error || "Registration failed");
        if (registerResult.fieldErrors) {
          Object.entries(registerResult.fieldErrors).forEach(
            ([field, errors]) => {
              if (Object.keys(value).includes(field)) {
                // @ts-expect-error
                formApi.setFieldMeta(field, (prev) => ({
                  ...prev,
                  errors: errors,
                }));
              }
            },
          );
        }
        return;
      }

      // 2. Create Vendor Profile
      // The user is now logged in (cookies set by register action)
      const vendorData: CreateVendorInput = {
        full_name: value.full_name,
        email: value.email,
        phone_number: value.phone_number,
        bio: value.bio || "New Vendor", // Default bio if empty
        business_name: value.business_name,
        vendor_type: value.vendor_type as any,
        address: value.address,
        website: value.website || "",
      };

      const vendorResult = await registerVendor(vendorData);

      if (!vendorResult.success) {
        toast.error(vendorResult.error || "Failed to create vendor profile.");
        setError(
          vendorResult.error ||
            "Failed to create vendor profile. Your account was created, please contact support.",
        );
        if (vendorResult.fieldErrors) {
          Object.entries(vendorResult.fieldErrors).forEach(
            ([field, errors]) => {
              if (Object.keys(value).includes(field)) {
                // @ts-expect-error
                formApi.setFieldMeta(field, (prev) => ({
                  ...prev,
                  errors: errors,
                }));
              }
            },
          );
        }
        return;
      }

      toast.success("Application submitted successfully!");
      router.push("/vendor/dashboard"); // Or a specific success page
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {error && (
        <Alert variant={"destructive"}>
          <RiAlertLine />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-1">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Account Details</h3>

        <form.Field name="full_name">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="full_name">Contact Person Full Name</Label>
              <InputGroup>
                <InputGroupInput
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiUserLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiMailLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="phone_number">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <InputGroup>
                <InputGroupInput
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="+250..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiPhoneLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon>
                    <RiLockPasswordLine />
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="re_password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="re_password">Confirm Password</Label>
                <InputGroup>
                  <InputGroupInput
                    id="re_password"
                    name="re_password"
                    type="password"
                    placeholder="Confirm password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon>
                    <RiLockPasswordLine />
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">
          Business Details
        </h3>

        <form.Field name="business_name">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <InputGroup>
                <InputGroupInput
                  id="business_name"
                  name="business_name"
                  placeholder="e.g. Serengeti Safaris Ltd."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiBuildingLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="vendor_type">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="vendor_type">Business Type</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val || "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel / Accommodation</SelectItem>
                    <SelectItem value="car_rental">Car Rental</SelectItem>
                    <SelectItem value="guide">Tour Guide</SelectItem>
                    <SelectItem value="experience">
                      Experience Provider
                    </SelectItem>
                    <SelectItem value="transport">Transport Company</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="website">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <InputGroup>
                  <InputGroupInput
                    id="website"
                    name="website"
                    placeholder="https://..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon>
                    <RiGlobalLine />
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="address">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <InputGroup>
                <InputGroupInput
                  id="address"
                  name="address"
                  placeholder="City, Country"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiMapPinLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
          loading={form.state.isSubmitting}
        >
          {form.state.isSubmitting
            ? "Submitting Application..."
            : "Submit Application"}
          {!form.state.isSubmitting && <RiArrowRightLine className="size-5" />}
        </Button>
      </div>
    </form>
  );
}
