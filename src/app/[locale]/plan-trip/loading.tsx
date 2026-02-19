import { Skeleton } from "@/components/ui/skeleton";

export default function PlanTripLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-32">
      <div className="mb-12">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 flex-1 rounded-md" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[500px] w-full rounded-2xl sticky top-24" />
        </div>
      </div>
    </div>
  );
}
