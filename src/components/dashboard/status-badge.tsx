import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  active: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  available: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/10 text-green-400 border-green-500/30",
  approved: "bg-green-500/10 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = statusColors[status] || "bg-white/10 text-white/60 border-white/20";
  return (
    <span
      className={cn(
        "inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
        colors,
        className
      )}
    >
      {(status ?? "unknown").replace("_", " ")}
    </span>
  );
}
