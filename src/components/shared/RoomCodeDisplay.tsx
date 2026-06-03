import { cn } from "@/lib/utils";

interface RoomCodeDisplayProps {
  code: string;
  size?: "md" | "lg";
}

export function RoomCodeDisplay({ code, size = "lg" }: RoomCodeDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest mb-2">
        Código de sala
      </p>
      <div
        className={cn(
          "inline-block font-heading font-extrabold tracking-[0.25em] text-[#F8FAFC] bg-[#1E1B2E] border border-[#2D2A3E] rounded-xl px-8 py-4",
          size === "lg" ? "text-5xl" : "text-3xl"
        )}
      >
        {code}
      </div>
      <p className="text-xs text-[#9CA3AF] mt-3">
        Los jugadores entran en{" "}
        <span className="text-[#F8FAFC] font-medium">
          {process.env.NEXT_PUBLIC_APP_URL}/play
        </span>
      </p>
    </div>
  );
}
