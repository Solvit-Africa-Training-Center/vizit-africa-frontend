"use client";

import { RiAlertLine, RiRefreshLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-5 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-4 text-destructive">
        <RiAlertLine className="size-12" />
      </div>
      <h2 className="font-display text-2xl font-medium text-foreground md:text-3xl">
        Something went wrong!
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        We encountered an error while loading the administrative dashboard.
        Please try again or contact support if the problem persists.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => reset()} className="gap-2">
          <RiRefreshLine className="size-4" />
          Try again
        </Button>
        <Button variant="outline" render={<Link href="/admin" />}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
