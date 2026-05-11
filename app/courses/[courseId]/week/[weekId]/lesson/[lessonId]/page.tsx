import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CourseSidebar } from "@/components/layout/CourseSidebar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LessonRenderer } from "@/components/learning/LessonRenderer";
import {
  getAdjacentLesson,
  getAllCourses,
  getCourseBySlug,
  getLesson,
  getWeek,
} from "@/lib/content";
import { highlightBlocks } from "@/lib/highlight";
import { pad } from "@/lib/utils";

interface Props {
  params: Promise<{ courseId: string; weekId: string; lessonId: string }>;
}

export async function generateStaticParams() {
  const out: { courseId: string; weekId: string; lessonId: string }[] = [];
  for (const c of getAllCourses()) {
    for (const w of c.weeks) {
      for (const m of w.modules) {
        for (const l of m.lessons) {
          out.push({ courseId: c.slug, weekId: w.id, lessonId: l.slug });
        }
      }
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId, weekId, lessonId } = await params;
  const lesson = getLesson(courseId, weekId, lessonId);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, weekId, lessonId } = await params;
  const course = getCourseBySlug(courseId);
  const week = getWeek(courseId, weekId);
  const lesson = getLesson(courseId, weekId, lessonId);
  if (!course || !week || !lesson) notFound();

  const highlights = await highlightBlocks(lesson.blocks);

  const prev = getAdjacentLesson(courseId, weekId, lessonId, "prev");
  const next = getAdjacentLesson(courseId, weekId, lessonId, "next");

  return (
    <AppShell sidebar={<CourseSidebar course={course} />}>
      <div className="mx-auto w-full max-w-3xl px-5 pt-8 sm:px-8">
        <Breadcrumbs
          items={[
            { label: course.title, href: `/courses/${course.slug}` },
            {
              label: `Week ${pad(week.number)}`,
              href: `/courses/${course.slug}/week/${week.id}`,
            },
            { label: lesson.title },
          ]}
        />
      </div>
      <LessonRenderer
        courseSlug={course.slug}
        weekId={week.id}
        lesson={lesson}
        highlights={highlights}
      />

      <nav className="mx-auto mt-10 flex max-w-3xl items-center justify-between gap-3 px-5 pb-16 sm:px-8">
        <div>
          {prev ? (
            <Link
              href={`/courses/${course.slug}/week/${prev.weekId}/lesson/${prev.lesson.slug}`}
              className="group inline-flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-border-strong"
            >
              <ArrowLeft
                size={16}
                className="mt-1 text-muted transition-transform group-hover:-translate-x-0.5"
              />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Previous
                </p>
                <p className="text-[14px] font-medium">{prev.lesson.title}</p>
              </div>
            </Link>
          ) : null}
        </div>
        <div>
          {next ? (
            <Link
              href={`/courses/${course.slug}/week/${next.weekId}/lesson/${next.lesson.slug}`}
              className="group inline-flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-border-strong"
            >
              <div className="min-w-0 text-right">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Next
                </p>
                <p className="text-[14px] font-medium">{next.lesson.title}</p>
              </div>
              <ArrowRight
                size={16}
                className="mt-1 text-muted transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ) : null}
        </div>
      </nav>

      <Footer />
    </AppShell>
  );
}
