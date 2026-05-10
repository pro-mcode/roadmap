import type {
  Course,
  CourseIndexEntry,
  InterviewQuestion,
  Lesson,
  SearchableItem,
  Week,
} from "@/types/content";
import { fintechWeb3Course } from "@/content/courses/fintech-web3";
import { rustSecurityCourse } from "@/content/courses/rust-security-audit";

/**
 * Central registry of all courses.
 * To add a new course, author its content under /content/courses/<slug>/
 * and import the exported Course object here.
 */
const courses: Course[] = [fintechWeb3Course, rustSecurityCourse];

export function getAllCourses(): Course[] {
  return courses;
}

export function getCourseIndex(): CourseIndexEntry[] {
  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    durationWeeks: c.durationWeeks,
    accent: c.accent,
  }));
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getWeek(courseSlug: string, weekId: string): Week | undefined {
  const course = getCourseBySlug(courseSlug);
  return course?.weeks.find((w) => w.id === weekId);
}

export function getLesson(
  courseSlug: string,
  weekId: string,
  lessonSlug: string,
): Lesson | undefined {
  const week = getWeek(courseSlug, weekId);
  if (!week) return undefined;
  for (const m of week.modules) {
    const lesson = m.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getAdjacentLesson(
  courseSlug: string,
  weekId: string,
  lessonSlug: string,
  direction: "prev" | "next",
):
  | { weekId: string; lesson: Lesson }
  | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const flat: Array<{ weekId: string; lesson: Lesson }> = [];
  for (const w of course.weeks) {
    for (const m of w.modules) {
      for (const l of m.lessons) flat.push({ weekId: w.id, lesson: l });
    }
  }
  const idx = flat.findIndex(
    (e) => e.weekId === weekId && e.lesson.slug === lessonSlug,
  );
  if (idx === -1) return undefined;
  const target = direction === "prev" ? idx - 1 : idx + 1;
  return flat[target];
}

export function totalLessons(course: Course): number {
  return course.weeks.reduce(
    (sum, w) => sum + w.modules.reduce((s, m) => s + m.lessons.length, 0),
    0,
  );
}

export function totalEstimatedMinutes(course: Course): number {
  return course.weeks.reduce(
    (sum, w) =>
      sum +
      w.modules.reduce(
        (s, m) =>
          s + m.lessons.reduce((ls, l) => ls + l.estimatedMinutes, 0),
        0,
      ),
    0,
  );
}

export function collectInterviewQuestions(
  course: Course,
): InterviewQuestion[] {
  const out: InterviewQuestion[] = [];
  for (const w of course.weeks) {
    if (w.interviewSet) out.push(...w.interviewSet);
    for (const m of w.modules) {
      for (const l of m.lessons) {
        if (l.interviewQuestions) out.push(...l.interviewQuestions);
      }
    }
  }
  return out;
}

export function buildSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];
  for (const course of courses) {
    items.push({
      type: "course",
      courseSlug: course.slug,
      title: course.title,
      summary: course.subtitle,
      tags: [course.level, "course"],
      href: `/courses/${course.slug}`,
    });
    for (const w of course.weeks) {
      items.push({
        type: "week",
        courseSlug: course.slug,
        weekId: w.id,
        title: `Week ${w.number}: ${w.title}`,
        summary: w.summary,
        tags: [w.stage, ...w.stack],
        href: `/courses/${course.slug}/week/${w.id}`,
      });
      for (const m of w.modules) {
        for (const l of m.lessons) {
          items.push({
            type: "lesson",
            courseSlug: course.slug,
            weekId: w.id,
            lessonSlug: l.slug,
            title: l.title,
            summary: l.summary,
            tags: l.tags,
            href: `/courses/${course.slug}/week/${w.id}/lesson/${l.slug}`,
          });
        }
      }
    }
    for (const q of collectInterviewQuestions(course)) {
      items.push({
        type: "interview",
        courseSlug: course.slug,
        title: q.question,
        summary: q.modelAnswer.slice(0, 220),
        tags: [q.level, q.category],
        href: `/interview/${course.slug}#${q.id}`,
      });
    }
  }
  return items;
}
