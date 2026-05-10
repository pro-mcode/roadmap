import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Code2, Shield } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  getAllCourses,
  totalEstimatedMinutes,
  totalLessons,
} from "@/lib/content";
import { formatMinutes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All courses",
  description:
    "Browse the full catalog of structured 12-week engineering roadmaps.",
};

export default function CoursesIndexPage() {
  const courses = getAllCourses();
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Courses
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Two complete 12-week paths into the deep end of modern engineering.
          Pick one and commit.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.slug}`}
              className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${
                    c.accent === "indigo"
                      ? "border-accent/30 bg-accent/[0.08] text-accent"
                      : "border-danger/30 bg-danger/[0.08] text-danger"
                  }`}
                >
                  {c.accent === "indigo" ? <Code2 size={16} /> : <Shield size={16} />}
                </span>
                <Badge variant="outline">{c.level}</Badge>
                <Badge variant="outline">{c.durationWeeks} weeks</Badge>
              </div>
              <h2 className="mt-4 text-[22px] font-semibold leading-snug">
                {c.title}
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                {c.subtitle}
              </p>
              <div className="mt-6 flex items-center justify-between text-[12px] text-muted">
                <span>
                  {totalLessons(c)} lessons · {formatMinutes(totalEstimatedMinutes(c))}
                </span>
                <span className="inline-flex items-center gap-1 group-hover:text-text">
                  Open path <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
