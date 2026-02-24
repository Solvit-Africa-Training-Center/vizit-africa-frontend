import { Button } from "@/components/ui/button";
import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import type { GuestCount } from "./types";

export function Travelers({
  guests,
  handleGuestChange,
}: {
  guests: GuestCount;
  handleGuestChange: (type: keyof GuestCount, delta: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Travelers</h3>
      </div>
      <div className="rounded-xl border bg-card divide-y">
        {[
          { key: "adults", label: "Adults", sub: "Age 12+" },
          { key: "children", label: "Children", sub: "Age 2-11" },
          { key: "infants", label: "Infants", sub: "Under 2" },
        ].map(({ key, label, sub }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4"
          >
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() =>
                  handleGuestChange(key as keyof GuestCount, -1)
                }
                disabled={
                  guests[key as keyof GuestCount] <=
                  (key === "adults" ? 1 : 0)
                }
              >
                <RiSubtractLine className="size-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium tabular-nums">
                {guests[key as keyof GuestCount]}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() =>
                  handleGuestChange(key as keyof GuestCount, 1)
                }
              >
                <RiAddLine className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
