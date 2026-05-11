import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function pluralize(count: number, singular: string, plural?: string) {
  return `${count} ${count === 1 ? singular : plural ?? `${singular}s`}`;
}

export function pad(n: number, width = 2): string {
  return n.toString().padStart(width, "0");
}

/**
 * Resolve a course/path accent color to Tailwind utility classes.
 * Keeps color logic in one place so adding a new accent only requires
 * editing this map.
 */
export type Accent =
  | "indigo"
  | "amber"
  | "rose"
  | "emerald"
  | "sky"
  | "violet"
  | "teal";

const ACCENT_MAP: Record<Accent, { border: string; bg: string; text: string }> = {
  indigo: {
    border: "border-indigo-400/30",
    bg: "bg-indigo-400/10",
    text: "text-indigo-300",
  },
  amber: {
    border: "border-amber-400/30",
    bg: "bg-amber-400/10",
    text: "text-amber-300",
  },
  rose: {
    border: "border-rose-400/30",
    bg: "bg-rose-400/10",
    text: "text-rose-300",
  },
  emerald: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/10",
    text: "text-emerald-300",
  },
  sky: {
    border: "border-sky-400/30",
    bg: "bg-sky-400/10",
    text: "text-sky-300",
  },
  violet: {
    border: "border-violet-400/30",
    bg: "bg-violet-400/10",
    text: "text-violet-300",
  },
  teal: {
    border: "border-teal-400/30",
    bg: "bg-teal-400/10",
    text: "text-teal-300",
  },
};

export function accentClass(
  accent: Accent,
  variant: "border" | "bg" | "text",
): string {
  return ACCENT_MAP[accent][variant];
}
