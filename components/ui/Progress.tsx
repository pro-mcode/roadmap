import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0..1
  className?: string;
  size?: "sm" | "md";
}

export function Progress({ value, className, size = "md" }: Props) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-elevated",
        size === "sm" ? "h-1" : "h-1.5",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500"
        style={{ width: `${pct * 100}%` }}
      />
    </div>
  );
}
