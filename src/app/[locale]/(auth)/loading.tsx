import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 relative z-10">
      <div className="space-y-2 text-center">
        <Skeleton className="h-10 w-48 mx-auto bg-white/10 rounded-full" />
        <Skeleton className="h-4 w-64 mx-auto bg-white/5 rounded-full" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-white/10 rounded-full" />
          <Skeleton className="h-12 w-full bg-white/5 rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-white/10 rounded-full" />
          <Skeleton className="h-12 w-full bg-white/5 rounded-2xl" />
        </div>
        <Skeleton className="h-14 w-full bg-white/10 rounded-full" />
      </div>
      <div className="text-center">
        <Skeleton className="h-4 w-48 mx-auto bg-white/5 rounded-full" />
      </div>
    </div>
  );
}
