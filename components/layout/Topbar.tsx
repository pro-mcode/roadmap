"use client";

import Link from "next/link";
import { Search, Menu, BookOpenCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useState } from "react";
import { SearchDialog } from "./SearchDialog";

export function Topbar({
  onMobileToggle,
}: {
  onMobileToggle?: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-30 flex h-[var(--header-h)] items-center justify-between gap-3 border-b border-border bg-canvas/80 px-4 backdrop-blur-md sm:px-6"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={onMobileToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
        >
          <Menu size={16} />
        </button>
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
            <BookOpenCheck size={14} />
          </span>
          <span>Engineering Roadmap</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:text-text sm:flex"
        >
          <Search size={14} />
          <span>Search lessons, topics, interviews…</span>
          <kbd className="ml-6 rounded border border-border bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted">
            ⌘K
          </kbd>
        </button>
        <button
          type="button"
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border sm:hidden"
        >
          <Search size={16} />
        </button>
        <ThemeToggle />
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
