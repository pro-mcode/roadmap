"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Search as SearchIcon } from "lucide-react";
import type { SearchableItem } from "@/types/content";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchableItem[]>([]);

  useEffect(() => {
    let cancel = false;
    if (!q.trim()) {
      setResults([]);
      return;
    }
    (async () => {
      const { search } = await import("@/lib/search");
      if (!cancel) setResults(search(q, 50));
    })();
    return () => {
      cancel = true;
    };
  }, [q]);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Search" }]}
        />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Search
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Search across every lesson, week, course, and interview question.
        </p>

        <div className="mt-8 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3">
          <SearchIcon size={16} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            autoFocus
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-hint"
          />
        </div>

        <ul className="mt-6 space-y-3">
          {results.map((r, i) => (
            <li key={i}>
              <Link
                href={r.href}
                className="block rounded-lg border border-border bg-surface px-5 py-4 hover:border-border-strong"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.type}</Badge>
                  {r.tags.slice(0, 2).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
                <h2 className="mt-2 text-[16px] font-medium">{r.title}</h2>
                <p className="mt-1 line-clamp-2 text-[13.5px] text-muted">
                  {r.summary}
                </p>
              </Link>
            </li>
          ))}
          {q.trim() && results.length === 0 && (
            <p className="text-center text-sm text-muted">
              No results for "{q}".
            </p>
          )}
        </ul>
      </div>
      <Footer />
    </AppShell>
  );
}
