import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 text-[12px] text-muted"
    >
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {c.href && !isLast ? (
              <Link
                href={c.href}
                className="hover:text-text transition-colors"
              >
                {c.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-text")}>{c.label}</span>
            )}
            {!isLast && <ChevronRight size={12} className="opacity-60" />}
          </span>
        );
      })}
    </nav>
  );
}
