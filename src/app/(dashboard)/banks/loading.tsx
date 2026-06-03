import { Skeleton } from "@/components/ui/skeleton";

export default function BanksLoading() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 bg-[#2D2A3E]" />
          <Skeleton className="h-4 w-72 bg-[#2D2A3E]" />
        </div>
        <Skeleton className="h-10 w-36 bg-[#2D2A3E]" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24 bg-[#2D2A3E]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-[#2D2A3E]" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-36 bg-[#2D2A3E]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-[#2D2A3E]" />
          ))}
        </div>
      </div>
    </div>
  );
}
