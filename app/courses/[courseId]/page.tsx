import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CourseSidebar } from "@/components/layout/CourseSidebar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  getAllCourses,
  getCourseBySlug,
  totalEstimatedMinutes,
  totalLessons,
} from "@/lib/content";
import { formatMinutes, pad } from "@/lib/utils";

interface Props {
  params: { courseId: string };
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ courseId: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourseBySlug(params.courseId);
  if (!course) return {};
  return {
    title: course.title,
    description: course.subtitle,
  };
}

export default function CoursePage({ params }: Props) {
  const course = getCourseBySlug(params.courseId);
  if (!course) notFound();

  const lessonsCount = totalLessons(course);
  const minutes = totalEstimatedMinutes(course);

  return (
    <AppShell sidebar={<CourseSidebar course={course} />}>
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: course.title },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="accent">{course.level}</Badge>
          <Badge variant="outline">{course.durationWeeks} weeks</Badge>
          <Badge variant="outline">
            <Clock size={10} /> {formatMinutes(minutes)}
          </Badge>
          <Badge variant="outline">
            <BookOpen size={10} /> {lessonsCount} lessons
          </Badge>
        </div>

        <h1 className="mt-5 text-[34px] font-semibold leading-tight tracking-tight sm:text-[42px]">
          {course.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
          {course.subtitle}
        </p>

        <p className="mt-6 max-w-2xl leading-relaxed text-text/90">
          {course.description}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Outcomes
            </h3>
            <ul className="mt-3 space-y-2 text-[14px]">
              {course.outcomes.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Prerequisites
            </h3>
            <ul className="mt-3 space-y-2 text-[14px]">
              {course.prerequisites.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="mt-12 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
          The 12-week curriculum
        </h2>
        <ul className="mt-4 grid gap-3">
          {course.weeks.map((w) => (
            <li key={w.id}>
              <Link
                href={`/courses/${course.slug}/week/${w.id}`}
                className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-muted">
                      Week {pad(w.number)}
                    </span>
                    <Badge variant="outline">{w.stage}</Badge>
                  </div>
                  <h3 className="mt-1.5 text-[16px] font-medium leading-snug">
                    {w.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[13.5px] text-muted">
                    {w.summary}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="mt-2 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text"
                />
              </Link>
            </li>
          ))}
        </ul>

        {course.capstone && (
          <section className="mt-12 rounded-lg border border-accent/30 bg-accent/[0.04] p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-accent">
              Capstone
            </h3>
            <h4 className="mt-2 text-[18px] font-semibold">
              {course.capstone.title}
            </h4>
            <p className="mt-2 text-[14px] leading-relaxed text-text/90">
              {course.capstone.summary}
            </p>
            <ul className="mt-3 list-disc pl-5 text-[13.5px] text-text/85">
              {course.capstone.deliverables.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 flex items-center justify-between text-[12px] text-muted">
          <span>
            Authored by {course.authoredBy} · Last updated {course.lastUpdated}
          </span>
          <Link
            href={`/interview/${course.slug}`}
            className="hover:text-text"
          >
            Interview prep set →
          </Link>
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
