import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shared/page-header";
import { VendorRegistrationForm } from "@/components/forms/vendor-registration-form";

export default async function PartnerApplyPage() {
  const t = await getTranslations("Partners.apply");

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t("title") || "Partner Application"}
        overline="Join Vizit Africa"
        className="pt-24 md:pt-32"
      />

      <section className="marketing-section pt-0">
        <div className="marketing-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                Fill out the form below to apply. Our team reviews every
                application to ensure quality standards.
              </p>
            </div>

            <div className="bg-surface-cream border border-border/50 rounded-2xl shadow-sm p-6 md:p-10 relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              
              <div className="relative z-10">
                <VendorRegistrationForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
