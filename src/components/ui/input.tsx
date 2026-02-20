import { cn } from "@/lib/utils";
import { Icon } from "./icon";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightIcon?: string;
}

export function Input({ label, rightIcon, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "w-full bg-gray-900/50 border border-primary/20 rounded-lg p-4 text-gray-100",
            "placeholder:text-gray-600 focus:border-primary/60 focus:outline-none",
            "focus:shadow-[0_0_0_2px_rgba(46,123,255,0.3)] transition-all",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <Icon
            name={rightIcon}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
          />
        )}
      </div>
    </div>
  );
}
