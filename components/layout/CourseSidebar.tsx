"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn, pad } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import type { Course } from "@/types/content";
import { Progress } from "@/components/ui/Progress";

interface Props {
  course: Course;
}

export function CourseSidebar({ course }: Props) {
  const pathname = usePathname();
  const { hydrated, isLessonComplete, isWeekComplete } = useProgress();

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const w of course.weeks) {
      for (const m of w.modules) {
        for (const l of m.lessons) {
          total += 1;
          if (hydrated && isLessonComplete(course.slug, w.id, l.slug)) done += 1;
        }
      }
    }
    return { total, done };
  }, [course, hydrated, isLessonComplete]);

  return (
    <aside
      className={cn(
        "border-r border-border bg-surface",
        "h-[calc(100vh-var(--header-h))] sticky top-[var(--header-h)] overflow-y-auto thin-scroll",
        "hidden md:block",
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <Link
          href={`/courses/${course.slug}`}
          className="block text-[13px] font-medium leading-tight"
        >
          {course.title}
        </Link>
        <p className="mt-1 line-clamp-2 text-[12px] text-muted">
          {course.subtitle}
        </p>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
          <span>
            {totals.done} / {totals.total} lessons
          </span>
        </div>
        <div className="mt-2">
          <Progress
            size="sm"
            value={totals.total === 0 ? 0 : totals.done / totals.total}
          />
        </div>
      </div>

      <nav className="px-2 py-2 text-sm">
        {course.weeks.map((w) => {
          const weekHref = `/courses/${course.slug}/week/${w.id}`;
          const weekActive = pathname?.startsWith(weekHref);
          const weekDone = hydrated && isWeekComplete(course.slug, w.id);
          return (
            <div key={w.id} className="mt-2">
              <Link
                href={weekHref}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md px-3 py-1.5",
                  "hover:bg-elevated",
                  weekActive && "bg-elevated",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="font-mono text-[11px] text-muted">
                    W{pad(w.number)}
                  </span>
                  <span className="truncate text-[13px]">{w.title}</span>
                </span>
                {weekDone && (
                  <Check size={12} className="shrink-0 text-success" />
                )}
              </Link>
              <ul className="mt-1 space-y-0.5 pl-2">
                {w.modules.map((m) => (
                  <li key={m.id}>
                    {m.lessons.map((l) => {
                      const href = `/courses/${course.slug}/week/${w.id}/lesson/${l.slug}`;
                      const active = pathname === href;
                      const done =
                        hydrated && isLessonComplete(course.slug, w.id, l.slug);
                      return (
                        <Link
                          key={l.id}
                          href={href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1 text-[12.5px]",
                            "text-muted hover:bg-elevated hover:text-text",
                            active && "bg-accent/10 text-accent",
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                              done
                                ? "border-success bg-success/20 text-success"
                                : "border-border",
                            )}
                          >
                            {done && <Check size={9} />}
                          </span>
                          <span className="truncate">{l.title}</span>
                          {active && (
                            <ChevronRight
                              size={12}
                              className="ml-auto shrink-0"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
