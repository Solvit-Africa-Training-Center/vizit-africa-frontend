import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 pt-32 pb-24 min-h-screen">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-16 w-96 max-w-full bg-white/5" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
      </header>

      <div className="flex items-center gap-8 mb-12 overflow-x-auto no-scrollbar pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 w-24 shrink-0 bg-white/10 rounded-full"
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square lg:aspect-square w-full rounded-[2.5rem] bg-white/5 border border-white/5" />
        <div className="space-y-12">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-40 w-full rounded-3xl bg-white/5 border border-white/5"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6 pt-12 border-t border-white/10">
            <Skeleton className="h-8 w-48 bg-white/10" />
            <div className="grid grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-12 w-16 bg-white/10" />
                  <Skeleton className="h-3 w-20 bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
