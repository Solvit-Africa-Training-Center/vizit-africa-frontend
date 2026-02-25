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
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
            {t("settings.phone")}
          </Label>
          <div className="border-b border-border/50 py-3 text-lg font-light">
            {user.phone_number || "-"}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
            {t("settings.bio")}
          </Label>
          <div className="border-b border-border/50 py-3 text-lg font-light">
            {user.bio || t("settings.bioPlaceholder")}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
            {t("settings.currency")}
          </Label>
          <div className="border-b border-border/50 py-3 text-lg font-light">
            {user.preferred_currency || "USD"}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
            {t("settings.role")}
          </Label>
          <div className="border-b border-border/50 py-3 text-lg flex items-center gap-2">
            <Badge variant="outline" className="rounded-full px-3 font-mono text-[10px] font-bold tracking-widest uppercase">
              {user.role}
            </Badge>
          </div>
        </div>

        <div className="pt-8">
          <Button className="rounded-full px-10 h-12 font-display uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/10 transition-all duration-500 hover:scale-105">
            {t("settings.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
