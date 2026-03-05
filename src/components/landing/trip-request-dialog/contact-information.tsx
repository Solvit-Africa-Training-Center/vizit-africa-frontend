import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactInfo } from "./types";
import { useTranslations } from "next-intl";

export function ContactInformation({
  contactInfo,
  updateContact,
}: {
  contactInfo: ContactInfo;
  updateContact: (updates: Partial<ContactInfo>) => void;
}) {
  const t = useTranslations("PlanTrip.conciergeDialog.sections");
  const tForm = useTranslations("PlanTrip.detailedPlanner.sections.identity");

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{t("contact")}</h3>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {tForm("fullName")}
          </Label>
          <Input
            id="name"
            placeholder={tForm("fullNamePlaceholder")}
            value={contactInfo.name}
            onChange={(e) => updateContact({ name: e.target.value })}
            className="h-11"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {tForm("email")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={tForm("emailPlaceholder")}
              value={contactInfo.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              {tForm("phone")}
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder={tForm("phonePlaceholder")}
              value={contactInfo.phoneNumber}
              onChange={(e) => updateContact({ phoneNumber: e.target.value })}
              className="h-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="requests" className="text-sm font-medium">
            {tForm("specialNarrative")}
            <span className="text-muted-foreground ml-1">(Optional)</span>
          </Label>
          <Textarea
            id="requests"
            placeholder={tForm("specialNarrativePlaceholder")}
            value={contactInfo.specialRequests}
            onChange={(e) => updateContact({ specialRequests: e.target.value })}
            className="min-h-20 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

