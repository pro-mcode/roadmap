import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Target } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CourseSidebar } from "@/components/layout/CourseSidebar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { InterviewSet } from "@/components/learning/InterviewSet";
import { ProductionInsights } from "@/components/learning/ProductionInsights";
import {
  getAllCourses,
  getCourseBySlug,
  getWeek,
} from "@/lib/content";
import { formatMinutes, pad } from "@/lib/utils";

interface Props {
  params: { courseId: string; weekId: string };
}

export async function generateStaticParams() {
  const out: { courseId: string; weekId: string }[] = [];
  for (const c of getAllCourses()) {
    for (const w of c.weeks) out.push({ courseId: c.slug, weekId: w.id });
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const week = getWeek(params.courseId, params.weekId);
  if (!week) return {};
  return {
    title: `Week ${week.number}: ${week.title}`,
    description: week.summary,
  };
}

export default function WeekPage({ params }: Props) {
  const course = getCourseBySlug(params.courseId);
  const week = getWeek(params.courseId, params.weekId);
  if (!course || !week) notFound();

  const totalMinutes = week.modules.reduce(
    (s, m) => s + m.lessons.reduce((ls, l) => ls + l.estimatedMinutes, 0),
    0,
  );

  return (
    <AppShell sidebar={<CourseSidebar course={course} />}>
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: course.title, href: `/courses/${course.slug}` },
            { label: `Week ${pad(week.number)}` },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="accent">Week {pad(week.number)}</Badge>
          <Badge variant="outline">{week.stage}</Badge>
          <span className="text-[12px] text-muted">
            {formatMinutes(totalMinutes)}
          </span>
        </div>

        <h1 className="mt-5 text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {week.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
          {week.summary}
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card title="Objectives" items={week.objectives} accent />
          <Card title="Concepts" items={week.concepts} />
          <Card title="Deliverables" items={week.deliverables} />
          <Card title="Stack" items={week.stack} />
        </section>

        <section className="mt-10 rounded-lg border border-border bg-elevated p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-accent/[0.06] text-accent">
              <Target size={14} />
            </span>
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">
                Review gate
              </h3>
              <p className="mt-1 text-[15px] leading-relaxed">
                {week.reviewGate}
              </p>
            </div>
          </div>
        </section>

        <h2 className="mt-12 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
          Lessons
        </h2>
        <ol className="mt-4 space-y-3">
          {week.modules.flatMap((m) =>
            m.lessons.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/courses/${course.slug}/week/${week.id}/lesson/${l.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="accent">{l.difficulty}</Badge>
                      <span className="text-[12px] text-muted">
                        {formatMinutes(l.estimatedMinutes)}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-[16px] font-medium leading-snug">
                      {l.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[13.5px] text-muted">
                      {l.summary}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="mt-2 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text"
                  />
                </Link>
              </li>
            )),
          )}
        </ol>

        {week.productionInsights && week.productionInsights.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
              Production insights
            </h2>
            <ProductionInsights insights={week.productionInsights} />
          </section>
        )}

        {week.interviewSet && week.interviewSet.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
              Interview prep
            </h2>
            <InterviewSet questions={week.interviewSet} />
          </section>
        )}
      </article>
      <Footer />
    </AppShell>
  );
}

function Card({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-surface p-5 ${
        accent ? "border-accent/30 bg-accent/[0.04]" : "border-border"
      }`}
    >
      <h3
        className={`font-mono text-[11px] uppercase tracking-wider ${
          accent ? "text-accent" : "text-muted"
        }`}
      >
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-[13.5px]">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span
              className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                accent ? "bg-accent" : "bg-muted"
              }`}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
