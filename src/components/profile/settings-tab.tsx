"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type User } from "@/lib/unified-types";

interface SettingsTabProps {
  user: User;
}

export function SettingsTab({ user }: SettingsTabProps) {
  const t = useTranslations("Profile");

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-3xl font-medium mb-8">
        {t("settings.title")}
      </h2>
      <div className="space-y-6">
        <div className="grid gap-2">
          <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("settings.fullName")}
          </Label>
          <div className="border-b border-border py-2 text-lg">
            {user.full_name}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("settings.email")}
          </Label>
          <div className="border-b border-border py-2 text-lg">
            {user.email}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Phone Number
          </Label>
          <div className="border-b border-border py-2 text-lg">
            {user.phone_number || "-"}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Bio
          </Label>
          <div className="border-b border-border py-2 text-lg">
            {user.bio || "Travel enthusiast"}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Preferred Currency
          </Label>
          <div className="border-b border-border py-2 text-lg">
            {user.preferred_currency || "USD"}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Role
          </Label>
          <div className="border-b border-border py-2 text-lg flex items-center gap-2">
            <Badge variant="outline">{user.role}</Badge>
          </div>
        </div>

        <div className="pt-8">
          <Button>{t("settings.save")}</Button>
        </div>
      </div>
    </div>
  );
}
