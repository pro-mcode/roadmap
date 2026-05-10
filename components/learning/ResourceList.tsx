import type { Resource } from "@/types/content";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function ResourceList({ resources }: { resources: Resource[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {resources.map((r, i) => (
        <li
          key={i}
          className="rounded-lg border border-border bg-surface px-4 py-3"
        >
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-[14px] font-medium leading-snug group-hover:text-accent">
                {r.title}
              </p>
              {r.author && (
                <p className="mt-0.5 text-[12px] text-muted">{r.author}</p>
              )}
              {r.note && (
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  {r.note}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Badge variant="outline">{r.kind}</Badge>
              <ExternalLink size={12} className="text-muted" />
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
