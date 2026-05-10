import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...rest }, ref) => {
    const variants: Record<Variant, string> = {
      primary:
        "bg-accent text-accent-contrast hover:bg-accent/90 border border-transparent",
      secondary:
        "bg-elevated text-text hover:bg-surface border border-border",
      ghost: "bg-transparent text-text hover:bg-elevated border border-transparent",
      outline:
        "bg-transparent text-text hover:bg-elevated border border-border-strong",
    };
    const sizes: Record<Size, string> = {
      sm: "h-8 px-3 text-[13px] rounded-md",
      md: "h-10 px-4 text-sm rounded-md",
      lg: "h-12 px-5 text-[15px] rounded-lg",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium",
          "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          variants[variant],
          sizes[size],
          className,
        )}
        {...rest}
      />
    );
  },
);
Button.displayName = "Button";
