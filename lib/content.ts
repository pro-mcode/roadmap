import type {
  CareerPath,
  Course,
  CourseIndexEntry,
  InterviewQuestion,
  Lesson,
  SearchableItem,
  Week,
} from "@/types/content";
import { typescriptCourse } from "@/content/courses/typescript";
import { nodejsExpressCourse } from "@/content/courses/nodejs-express";
import { golangCourse } from "@/content/courses/golang";
import { databaseDesignCourse } from "@/content/courses/database-design";
import { algorithmsCourse } from "@/content/courses/algorithms";
import { systemDesignCourse } from "@/content/courses/system-design";
import { blockchainFundamentalsCourse } from "@/content/courses/blockchain-fundamentals";
import { solidityCourse } from "@/content/courses/solidity";
import { rustLanguageCourse } from "@/content/courses/rust-language";
import { smartContractSecurityCourse } from "@/content/courses/smart-contract-security";
import { getAllCareerPaths } from "@/lib/career-paths";

/**
 * Central registry of all 10 standalone courses.
 * To add a new course, author its content under /content/courses/<slug>/
 * and import the exported Course object here.
 *
 * Course ordering reflects the optimal master-roadmap sequence: language
 * fluency → runtime → data → algorithms → systems → blockchain → security.
 */
const courses: Course[] = [
  typescriptCourse,
  nodejsExpressCourse,
  databaseDesignCourse,
  algorithmsCourse,
  systemDesignCourse,
  golangCourse,
  blockchainFundamentalsCourse,
  solidityCourse,
  rustLanguageCourse,
  smartContractSecurityCourse,
];

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
    discipline: c.discipline,
    progressionLevel: c.progressionLevel,
  }));
}

export function getCoursesByProgression() {
  const buckets: Record<
    "beginner" | "intermediate" | "advanced",
    CourseIndexEntry[]
  > = { beginner: [], intermediate: [], advanced: [] };
  for (const c of getCourseIndex()) buckets[c.progressionLevel].push(c);
  return buckets;
}

export function getCoursesByDiscipline() {
  const buckets = new Map<string, CourseIndexEntry[]>();
  for (const c of getCourseIndex()) {
    const list = buckets.get(c.discipline) ?? [];
    list.push(c);
    buckets.set(c.discipline, list);
  }
  return buckets;
}

export function totalCurriculumWeeks(): number {
  return courses.reduce((sum, c) => sum + c.durationWeeks, 0);
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
  for (const path of getAllCareerPaths()) {
    items.push({
      type: "path",
      courseSlug: path.slug,
      title: path.title,
      summary: path.subtitle,
      tags: ["career-path", `${path.durationWeeks}w`],
      href: `/paths/${path.slug}`,
    });
  }
  return items;
}
