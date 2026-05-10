import {
  AlertTriangle,
  Info,
  Lightbulb,
  Sparkles,
  Wrench,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalloutVariant } from "@/types/content";
import type { ReactNode } from "react";

const config: Record<
  CalloutVariant,
  {
    icon: typeof Info;
    accent: string;
    label: string;
  }
> = {
  note: { icon: Info, accent: "info", label: "Note" },
  tip: { icon: Lightbulb, accent: "success", label: "Tip" },
  warning: { icon: AlertTriangle, accent: "warning", label: "Warning" },
  insight: { icon: Sparkles, accent: "accent", label: "Insight" },
  production: { icon: Wrench, accent: "accent", label: "In production" },
  tradeoff: { icon: Scale, accent: "warning", label: "Trade-off" },
};

const accentToClass: Record<string, string> = {
  info: "border-info/35 bg-info/[0.06] text-info",
  success: "border-success/35 bg-success/[0.06] text-success",
  warning: "border-warning/35 bg-warning/[0.06] text-warning",
  accent: "border-accent/35 bg-accent/[0.06] text-accent",
};

interface Props {
  variant: CalloutVariant;
  title?: string;
  children: ReactNode;
}

export function Callout({ variant, title, children }: Props) {
  const { icon: Icon, accent, label } = config[variant];
  return (
    <aside
      className={cn(
        "my-6 rounded-lg border bg-surface p-4 sm:p-5",
        "border-border",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
            accentToClass[accent],
          )}
        >
          <Icon size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {title ?? label}
          </p>
          <div className="mt-1 text-sm leading-relaxed text-text/90">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
