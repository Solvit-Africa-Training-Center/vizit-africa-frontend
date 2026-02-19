import { VendorRegistrationForm } from "@/components/forms/vendor-registration-form";

export default function PartnerApplyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Partner Application
            </h1>
            <p className="text-muted-foreground">
              Fill out the form below to apply. Our team reviews every
              application to ensure quality standards.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
            <VendorRegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
