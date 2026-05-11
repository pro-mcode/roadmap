import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Layers } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  getAllCourses,
  getCoursesByDiscipline,
  totalCurriculumWeeks,
  totalEstimatedMinutes,
  totalLessons,
} from "@/lib/content";
import { accentClass, formatMinutes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All courses",
  description:
    "Ten standalone engineering courses across language, runtime, data, distributed systems, blockchain, and security.",
};

const DISCIPLINE_LABEL: Record<string, string> = {
  language: "Languages",
  backend: "Backend",
  data: "Data",
  "computer-science": "Computer Science",
  architecture: "Architecture",
  blockchain: "Blockchain",
  security: "Security",
  interview: "Interview prep",
  infrastructure: "Infrastructure",
};

export default function CoursesIndexPage() {
  const courses = getAllCourses();
  const byDiscipline = getCoursesByDiscipline();
  const totalWeeks = totalCurriculumWeeks();
  const totalLessonsAll = courses.reduce((s, c) => s + totalLessons(c), 0);
  const totalMinutesAll = courses.reduce(
    (s, c) => s + totalEstimatedMinutes(c),
    0,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Courses" }]}
        />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Courses
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Ten standalone tracks across the engineering disciplines fintech and
          protocol teams hire for. Pick one course, chain several into a career
          path, or take the full 24-week roadmap.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat icon={<BookOpen size={14} />} label="Courses" value={String(courses.length)} />
          <Stat icon={<Clock size={14} />} label="Weeks" value={String(totalWeeks)} />
          <Stat icon={<Layers size={14} />} label="Lessons" value={String(totalLessonsAll)} />
          <Stat icon={<Clock size={14} />} label="Est. time" value={formatMinutes(totalMinutesAll)} />
        </div>

        {Array.from(byDiscipline.entries()).map(([discipline, items]) => (
          <section key={discipline} className="mt-12">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {DISCIPLINE_LABEL[discipline] ?? discipline}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => {
                const course = courses.find((x) => x.slug === c.slug)!;
                return (
                  <Link
                    key={c.id}
                    href={`/courses/${c.slug}`}
                    className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md border ${accentClass(c.accent, "border")} ${accentClass(c.accent, "bg")} ${accentClass(c.accent, "text")} font-mono text-[11px]`}
                      >
                        {c.title.slice(0, 2).toUpperCase()}
                      </span>
                      <Badge variant="outline">{c.progressionLevel}</Badge>
                      <Badge variant="outline">{c.durationWeeks}w</Badge>
                    </div>
                    <h3 className="mt-4 text-[19px] font-semibold leading-snug">
                      {c.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-muted">
                      {c.subtitle}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-[12px] text-muted">
                      <span>
                        {totalLessons(course)} lessons ·{" "}
                        {formatMinutes(totalEstimatedMinutes(course))}
                      </span>
                      <span className="inline-flex items-center gap-1 group-hover:text-text">
                        Open <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </AppShell>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
