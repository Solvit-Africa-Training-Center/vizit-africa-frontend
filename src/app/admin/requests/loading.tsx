import { RiDashboardLine, RiFileListLine } from "@remixicon/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      {/* nav tabs */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
          <RiDashboardLine className="size-4 text-muted-foreground/50" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20">
          <RiFileListLine className="size-4 text-primary/50" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* table skeleton */}
      <div className="space-y-4">
        {/* toolbar skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <Skeleton className="h-10 w-full sm:w-80" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* table rows skeleton */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
