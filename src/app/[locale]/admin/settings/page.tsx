import { RiSettings3Line } from "@remixicon/react";
import { getTranslations } from "next-intl/server";

export default async function AdminSettingsPage() {
  const t = await getTranslations("Admin.settings");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <RiSettings3Line className="size-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">
            Manage application settings and configurations
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-12 shadow-sm text-center">
        <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
          <RiSettings3Line className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We are currently working on the settings panel. Check back later for
          updates on system configuration and preferences.
        </p>
      </div>
    </div>
  );
}
