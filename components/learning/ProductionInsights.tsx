import type { ProductionInsight } from "@/types/content";
import { Wrench } from "lucide-react";

export function ProductionInsights({
  insights,
}: {
  insights: ProductionInsight[];
}) {
  return (
    <ul className="space-y-3">
      {insights.map((p, i) => (
        <li
          key={i}
          className="rounded-lg border border-border bg-surface px-5 py-4"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/[0.06] text-accent">
              <Wrench size={14} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium">{p.title}</p>
              <p className="mt-1 text-sm text-text/85">{p.summary}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {p.details}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
