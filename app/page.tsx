import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Code2,
  GitBranch,
  Layers,
  Map,
  Shield,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import {
  getAllCourses,
  getCoursesByProgression,
  totalCurriculumWeeks,
  totalEstimatedMinutes,
  totalLessons,
} from "@/lib/content";
import { getAllCareerPaths } from "@/lib/career-paths";
import { formatMinutes } from "@/lib/utils";
import { accentClass } from "@/lib/utils";

export default function HomePage() {
  const courses = getAllCourses();
  const totalLessonsAll = courses.reduce((s, c) => s + totalLessons(c), 0);
  const totalMinutesAll = courses.reduce(
    (s, c) => s + totalEstimatedMinutes(c),
    0,
  );
  const totalWeeks = totalCurriculumWeeks();
  const paths = getAllCareerPaths();
  const byLevel = getCoursesByProgression();

  return (
    <AppShell>
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_50%_at_50%_0%,rgb(var(--c-accent)/0.12),transparent_70%)]"
        />
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <Badge variant="accent" className="mb-5">
            v2.0 · 10 courses · {totalWeeks}-week master roadmap
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            A premium engineering academy for{" "}
            <span className="gradient-text">
              fintech, distributed systems, and protocol work
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Ten standalone courses, six career paths, one coherent curriculum. From
            TypeScript fluency to crypto-custody architecture and audit-firm-grade
            security reviews — every week is documentation-deep and interview-ready.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/courses"
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-5 text-[15px] font-medium text-accent-contrast hover:bg-accent/90"
            >
              Browse courses
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/paths"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-border-strong bg-transparent px-5 text-[15px] font-medium text-text hover:bg-elevated"
            >
              <Map size={16} /> See career paths
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Courses" value={String(courses.length)} />
            <Stat label="Career paths" value={String(paths.length)} />
            <Stat label="Lessons" value={String(totalLessonsAll)} />
            <Stat label="Estimated time" value={formatMinutes(totalMinutesAll)} />
          </div>
        </section>
      </div>

      <section className="border-t border-border bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-2 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
                Standalone courses
              </h2>
              <p className="max-w-2xl text-[20px] leading-snug">
                Each course is a self-contained track with its own modules, lessons,
                projects, and interview drill.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-[13px] text-muted hover:text-text"
            >
              All {courses.length} courses →
            </Link>
          </div>

          <ProgressionRow title="Beginner" items={byLevel.beginner} />
          <ProgressionRow title="Intermediate" items={byLevel.intermediate} />
          <ProgressionRow title="Advanced" items={byLevel.advanced} />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="mb-2 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
            Career paths
          </h2>
          <p className="max-w-2xl text-[20px] leading-snug">
            Chained sequences of courses tuned for a specific outcome. Pick one
            and follow it end to end.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paths.map((p) => (
              <Link
                key={p.id}
                href={`/paths/${p.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${accentClass(p.accent, "border")} ${accentClass(p.accent, "bg")} ${accentClass(p.accent, "text")}`}
                  >
                    <GitBranch size={16} />
                  </span>
                  <Badge variant="outline">{p.durationWeeks}w</Badge>
                  <Badge variant="outline">{p.courseSlugs.length} courses</Badge>
                </div>
                <h3 className="mt-5 text-[20px] font-semibold leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {p.subtitle}
                </p>
                <div className="mt-6 inline-flex items-center gap-1 text-[12px] text-muted group-hover:text-text">
                  Open path <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="mb-8 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
            What's inside
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<BookOpenCheck size={16} />}
              title="Documentation-grade lessons"
              body="Deep explanation, real code, callouts, diagrams. Designed to be read like a book and skimmed like a reference."
            />
            <Feature
              icon={<Sparkles size={16} />}
              title="Interview-ready"
              body="Every major topic ships with model-answer interview questions across intermediate, senior, and staff levels."
            />
            <Feature
              icon={<Code2 size={16} />}
              title="Production insights"
              body="Each week ends with the operational lessons that only show up in production — what breaks and why."
            />
            <Feature
              icon={<Layers size={16} />}
              title="Career paths"
              body="Six pre-chained sequences from working backend engineer to fintech, distributed-systems, or audit-firm ready."
            />
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}

function ProgressionRow({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof getCoursesByProgression>[keyof ReturnType<
    typeof getCoursesByProgression
  >];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/courses/${c.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-md border ${accentClass(c.accent, "border")} ${accentClass(c.accent, "bg")} ${accentClass(c.accent, "text")}`}
              >
                <Code2 size={13} />
              </span>
              <Badge variant="outline">{c.durationWeeks}w</Badge>
              <Badge variant="outline">{c.discipline}</Badge>
            </div>
            <h4 className="mt-4 text-[17px] font-semibold leading-snug">
              {c.title}
            </h4>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
              {c.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-accent/30 bg-accent/[0.08] text-accent">
        {icon}
      </span>
      <h3 className="mt-4 text-[16px] font-semibold">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
