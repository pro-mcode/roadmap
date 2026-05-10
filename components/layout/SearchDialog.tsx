"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { SearchableItem } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lazy-load Fuse only on first open to avoid shipping fuse on initial load
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Global ⌘K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!open) {
          // Re-open is handled by parent; we just dispatch a custom event.
          document.dispatchEvent(new CustomEvent("roadmap:search:open"));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    if (!q.trim()) {
      setResults([]);
      return;
    }
    (async () => {
      const { search } = await import("@/lib/search");
      if (!cancelled) setResults(search(q, 16));
    })();
    return () => {
      cancelled = true;
    };
  }, [q]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchableItem[]> = {};
    for (const r of results) {
      g[r.type] = g[r.type] ?? [];
      g[r.type].push(r);
    }
    return g;
  }, [results]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-start justify-center bg-canvas/70 p-4 pt-[8vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={16} className="text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lessons, topics, interview questions…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-hint"
          />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-muted hover:text-text"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto thin-scroll">
          {results.length === 0 && q.trim() && (
            <p className="px-5 py-8 text-center text-sm text-muted">
              No results for "{q}"
            </p>
          )}
          {results.length === 0 && !q.trim() && (
            <p className="px-5 py-8 text-center text-sm text-muted">
              Start typing to search across all lessons and interview questions.
            </p>
          )}
          {Object.entries(grouped).map(([type, items]) => (
            <section key={type} className="border-b border-border last:border-0">
              <p className="bg-elevated px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted">
                {type}
              </p>
              <ul>
                {items.map((it, i) => (
                  <li key={i}>
                    <Link
                      href={it.href}
                      onClick={onClose}
                      className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-elevated"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium leading-snug">
                          {it.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[12px] text-muted">
                          {it.summary}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-1">
                        {it.tags.slice(0, 2).map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
