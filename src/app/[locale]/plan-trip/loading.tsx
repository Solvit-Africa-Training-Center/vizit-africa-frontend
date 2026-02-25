import { Skeleton } from "@/components/ui/skeleton";

export default function PlanTripLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-32">
      <div className="mb-12">
        <Skeleton className="h-10 w-64 mb-4 bg-white/10" />
        <Skeleton className="h-4 w-96 max-w-full bg-white/5" />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-12 flex-1 rounded-full bg-white/5"
              />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-64 w-full rounded-3xl bg-white/5 border border-white/5"
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[500px] w-full rounded-[2.5rem] sticky top-24 bg-white/5 border border-white/5" />
        </div>
      </div>
    </div>
  );
}
