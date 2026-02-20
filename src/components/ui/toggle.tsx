"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: "primary" | "gold";
}

export function Toggle({ checked, onChange, color = "primary" }: ToggleProps) {
  const bgColor = color === "gold" ? "peer-checked:bg-accent-gold" : "peer-checked:bg-primary";

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={cn(
          "relative w-11 h-6 bg-white/10 rounded-full peer",
          "peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full",
          "after:content-[''] after:absolute after:top-[2px] after:start-[2px]",
          "after:bg-white after:border-gray-300 after:border after:rounded-full",
          "after:h-5 after:w-5 after:transition-all",
          bgColor
        )}
      />
    </label>
  );
}
