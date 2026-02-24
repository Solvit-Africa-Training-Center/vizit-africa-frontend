import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactInfo } from "./types";

export function ContactInformation({
  contactInfo,
  updateContact,
}: {
  contactInfo: ContactInfo;
  updateContact: (updates: Partial<ContactInfo>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Contact Information</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={contactInfo.name}
            onChange={(e) => updateContact({ name: e.target.value })}
            className="h-11"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={contactInfo.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={contactInfo.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
              className="h-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="requests" className="text-sm font-medium">
            Special Requests
            <span className="text-muted-foreground ml-1">(Optional)</span>
          </Label>
          <Textarea
            id="requests"
            placeholder="Any dietary requirements, accessibility needs, or special occasions..."
            value={contactInfo.specialRequests}
            onChange={(e) => updateContact({ specialRequests: e.target.value })}
            className="min-h-20 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
