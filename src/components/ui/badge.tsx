import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg",
        variant === "gradient"
          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
          : "bg-white/5 border border-white/10 text-gray-300",
        className
      )}
    >
      {children}
    </span>
  );
}
