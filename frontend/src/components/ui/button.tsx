import { cn } from "@/lib/utils";
import { Icon } from "./icon";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-accent-purple text-white font-bold hover:shadow-[0_0_25px_rgba(46,123,255,0.4)] hover:scale-[1.02]",
  outline:
    "bg-transparent border border-white/20 text-white font-bold hover:bg-white/5 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_15px_rgba(46,123,255,0.2)]",
  ghost: "bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-sm rounded-lg",
  lg: "px-8 py-4 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 20} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 16 : 20} />}
    </button>
  );
}
