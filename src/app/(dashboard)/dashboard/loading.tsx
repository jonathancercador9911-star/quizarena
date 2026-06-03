import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-[#2D2A3E]" />
          <Skeleton className="h-4 w-64 bg-[#2D2A3E]" />
        </div>
        <Skeleton className="h-10 w-36 bg-[#2D2A3E]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl bg-[#2D2A3E]" />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 bg-[#2D2A3E]" />
        <Skeleton className="h-48 rounded-xl bg-[#2D2A3E]" />
      </div>
    </div>
  );
}
