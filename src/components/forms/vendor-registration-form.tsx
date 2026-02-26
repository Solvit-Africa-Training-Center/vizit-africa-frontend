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
import { useTranslations } from "next-intl";
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

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

const steps = [
  {
    description: "Personal and login information",
    step: 1,
    title: "Account Details",
    fields: ["fullName", "email", "phoneNumber", "password", "rePassword"],
  },
  {
    description: "Company and services details",
    step: 2,
    title: "Business Details",
    fields: ["businessName", "vendorType", "website", "address"],
  },
  {
    description: "Review and submit",
    step: 3,
    title: "Final Review",
    fields: [],
  },
];

const formSchema = z.object({
  // From user/register schema
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(6, "Phone is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rePassword: z.string(),
  // Vendor specific fields
  bio: z.string().optional(),
  businessName: z.string().min(2, "Business name is required"),
  vendorType: z.enum([
    "hotel",
    "car_rental",
    "guide",
    "experience",
    "transport",
    "other",
  ]),
  address: z.string().min(1, "Address is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
}).refine(
  (data) => data.password === data.rePassword,
  { message: "Passwords don't match", path: ["rePassword"] }
);

type FormValues = z.infer<typeof formSchema>;

export function VendorRegistrationForm() {
  const t = useTranslations("Partners.apply");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      rePassword: "",
      businessName: "",
      vendorType: "hotel" as "hotel" | "car_rental" | "guide" | "experience" | "transport" | "other",
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
        fullName: value.fullName,
        email: value.email,
        phoneNumber: value.phoneNumber,
        password: value.password,
        rePassword: value.rePassword,
        role: "VENDOR",
      };

      const registerResult = await register(registerData);

      if (!registerResult.success) {
        toast.error(
          registerResult.error || t("messages.error"),
        );
        setError(registerResult.error || t("messages.error"));
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
      const vendorData: CreateVendorInput = {
        fullName: value.fullName,
        email: value.email,
        phoneNumber: value.phoneNumber,
        bio: value.bio || "New Vendor",
        businessName: value.businessName,
        vendorType: value.vendorType as any,
        address: value.address,
        website: value.website || "",
      };

      const vendorResult = await registerVendor(vendorData);

      if (!vendorResult.success) {
        toast.error(vendorResult.error || t("messages.profileError"));
        setError(
          vendorResult.error || t("messages.accountCreatedContactSupport"),
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

      toast.success(t("messages.success"));
      router.push("/vendor/dashboard"); // Or a specific success page
    },
  });

  const validateStep = async (stepNumber: number) => {
    // Basic synchronous validation for step fields before continuing.
    // In @tanstack/react-form, this can be complex to block sequentially 
    // without triggering overall submit, but we can trigger validation.
    
    const stepDef = steps.find((s) => s.step === stepNumber);
    if (!stepDef) return true;

    if (stepDef.fields.length === 0) return true;
    
    // Validate the specific fields. 
    const isStepValid = await form.validateAllFields("change"); // Wait for tanstack validation updates.
    
    // In Tanstack React Form v0, to prevent navigating we check the meta states of fields on this step
    const hasErrors = stepDef.fields.some(field => {
      const fieldMeta = form.state.fieldMeta[field as keyof FormValues];
      return fieldMeta?.isTouched && !fieldMeta?.isValid;
    });

    // We manually enforce valid checks or just let them progress for now and rely on submit validation
    return !hasErrors;
  };

  const handleNext = async () => {
    // Mark current fields as touched
    const stepDef = steps.find((s) => s.step === currentStep);
    if (stepDef) {
       stepDef.fields.forEach(field => {
          // @ts-expect-error dynamic access
          const meta = form.getFieldValue(field);
       });
    }

    // Move next step normally (TanStack handles validation feedback on submit usually, 
    // but in a multi-step form we typically just let users move ahead if they haven't submitted yet).
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center md:text-left mb-8">
        <Stepper value={currentStep} onValueChange={setCurrentStep}>
          {steps.map(({ step, title, description }) => (
            <StepperItem
              className="not-last:flex-1 max-md:items-start"
              key={step}
              step={step}
            >
              <StepperTrigger className="rounded max-md:flex-col">
                <StepperIndicator />
                <div className="text-center md:text-start">
                  <StepperTitle>{title}</StepperTitle>
                  <StepperDescription className="max-sm:hidden">
                    {description}
                  </StepperDescription>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Verify final step submission
          if (currentStep === steps.length) {
            form.handleSubmit();
          } else {
            handleNext();
          }
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

        <div className={`transition-opacity duration-300 ${currentStep === 1 ? "block opacity-100" : "hidden opacity-0"}`}>
          <div className="space-y-6">
            <h3 className="text-xl font-display font-light uppercase tracking-tight py-2 mb-2">
              {t("accountDetails")}
            </h3>

            <form.Field name="fullName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("labels.contactName")}</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder={t("placeholders.contactName")}
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
                  <Label htmlFor="email">{t("labels.email")}</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("placeholders.email")}
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

            <form.Field name="phoneNumber">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("labels.phone")}</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder={t("placeholders.phone")}
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
                    <Label htmlFor="password">{t("labels.password")}</Label>
                    <InputGroup>
                      <InputGroupInput
                        id="password"
                        type="password"
                        placeholder={t("placeholders.password")}
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

              <form.Field name="rePassword">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="rePassword">{t("labels.confirmPassword")}</Label>
                    <InputGroup>
                      <InputGroupInput
                        id="rePassword"
                        name="rePassword"
                        type="password"
                        placeholder={t("placeholders.confirmPassword")}
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
        </div>

        <div className={`transition-opacity duration-300 ${currentStep === 2 ? "block opacity-100" : "hidden opacity-0"}`}>
          <div className="space-y-6">
            <h3 className="text-xl font-display font-light uppercase tracking-tight py-2 mb-2">
              {t("businessDetails")}
            </h3>

            <form.Field name="businessName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="businessName">{t("labels.businessName")}</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="businessName"
                      name="businessName"
                      placeholder={t("placeholders.businessName")}
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
              <form.Field name="vendorType">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="vendorType">{t("labels.businessType")}</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.businessType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotel">{t("types.hotel")}</SelectItem>
                        <SelectItem value="car_rental">{t("types.car_rental")}</SelectItem>
                        <SelectItem value="guide">{t("types.guide")}</SelectItem>
                        <SelectItem value="experience">{t("types.experience")}</SelectItem>
                        <SelectItem value="transport">{t("types.transport")}</SelectItem>
                        <SelectItem value="other">{t("types.other")}</SelectItem>
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
                    <Label htmlFor="website">{t("labels.website")}</Label>
                    <InputGroup>
                      <InputGroupInput
                        id="website"
                        name="website"
                        placeholder={t("placeholders.website")}
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
                  <Label htmlFor="address">{t("labels.address")}</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="address"
                      name="address"
                      placeholder={t("placeholders.address")}
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
        </div>

        <div className={`transition-opacity duration-300 ${currentStep === 3 ? "block opacity-100" : "hidden opacity-0"}`}>
          <div className="space-y-6">
            <h3 className="text-xl font-display font-light uppercase tracking-tight py-2 mb-2">
              Final Review
            </h3>
            
            <div className="bg-muted/30 p-5 rounded-lg border text-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                By submitting your application, you agree to the Terms of Service and recognize our Vendor Partnership guidelines.
                Ensure all details, particularly your email and phone number, are accurate to avoid communication delays.
              </p>
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
                loading={form.state.isSubmitting}
                onClick={(e) => {
                   // Let standard html submission trigger onSubmit
                }}
              >
                {form.state.isSubmitting
                  ? t("submitting")
                  : t("submit")}
                {!form.state.isSubmitting && <RiArrowRightLine className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {currentStep < steps.length && (
          <div className="flex justify-between items-center pt-8 border-t">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                className="h-12 w-32 rounded-sm"
                onClick={handleBack}
              >
                Back
              </Button>
            ) : (
              <div /> // Placeholder for space-between 
            )}
            
            <Button
              type="button"
              className="h-12 w-32 rounded-sm gap-2 uppercase tracking-wide"
              onClick={handleNext}
            >
              Continue
            </Button>
          </div>
        )}
        
        {currentStep === steps.length && (
           <div className="flex justify-start items-center pt-2">
             <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-transparent px-0 underline underline-offset-4"
                onClick={handleBack}
                disabled={form.state.isSubmitting}
              >
                Go Back to edit details
              </Button>
           </div>
        )}

      </form>
    </div>
  );
}
