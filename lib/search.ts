import Fuse from "fuse.js";
import { buildSearchIndex } from "./content";
import type { SearchableItem } from "@/types/content";

let cached: Fuse<SearchableItem> | null = null;

export function getFuse(): Fuse<SearchableItem> {
  if (cached) return cached;
  const index = buildSearchIndex();
  cached = new Fuse(index, {
    threshold: 0.34,
    ignoreLocation: true,
    includeScore: true,
    keys: [
      { name: "title", weight: 0.5 },
      { name: "summary", weight: 0.3 },
      { name: "tags", weight: 0.2 },
    ],
  });
  return cached;
}

export function search(query: string, limit = 20): SearchableItem[] {
  if (!query.trim()) return [];
  return getFuse()
    .search(query)
    .slice(0, limit)
    .map((r) => r.item);
}
