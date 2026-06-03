import { Skeleton } from "@/components/ui/skeleton";

export default function GamesLoading() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32 bg-[#2D2A3E]" />
          <Skeleton className="h-4 w-64 bg-[#2D2A3E]" />
        </div>
        <Skeleton className="h-10 w-40 bg-[#2D2A3E]" />
      </div>
      <Skeleton className="h-64 rounded-xl bg-[#2D2A3E]" />
    </div>
  );
}
