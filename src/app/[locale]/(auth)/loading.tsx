import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8">
      <div className="space-y-2 text-center">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="text-center">
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}
