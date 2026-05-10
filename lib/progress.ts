/**
 * Progress persistence
 * --------------------
 * Lightweight client-only progress store backed by localStorage.
 * We avoid Zustand persistence middleware to keep this dependency-free
 * for a single source of truth.
 */

const KEY = "roadmap.progress.v1";

export interface ProgressState {
  /** lessonKey = `${courseSlug}::${weekId}::${lessonSlug}` */
  completedLessons: Record<string, true>;
  /** weekKey = `${courseSlug}::${weekId}` */
  completedWeeks: Record<string, true>;
  /** Last visited lesson per course slug */
  lastVisited: Record<string, { weekId: string; lessonSlug: string }>;
}

const initialState: ProgressState = {
  completedLessons: {},
  completedWeeks: {},
  lastVisited: {},
};

export function lessonKey(
  courseSlug: string,
  weekId: string,
  lessonSlug: string,
): string {
  return `${courseSlug}::${weekId}::${lessonSlug}`;
}

export function weekKey(courseSlug: string, weekId: string): string {
  return `${courseSlug}::${weekId}`;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as ProgressState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function setLessonComplete(
  courseSlug: string,
  weekId: string,
  lessonSlug: string,
  complete: boolean,
): ProgressState {
  const state = loadProgress();
  const key = lessonKey(courseSlug, weekId, lessonSlug);
  if (complete) state.completedLessons[key] = true;
  else delete state.completedLessons[key];
  saveProgress(state);
  return state;
}

export function setWeekComplete(
  courseSlug: string,
  weekId: string,
  complete: boolean,
): ProgressState {
  const state = loadProgress();
  const key = weekKey(courseSlug, weekId);
  if (complete) state.completedWeeks[key] = true;
  else delete state.completedWeeks[key];
  saveProgress(state);
  return state;
}

export function recordVisit(
  courseSlug: string,
  weekId: string,
  lessonSlug: string,
): ProgressState {
  const state = loadProgress();
  state.lastVisited[courseSlug] = { weekId, lessonSlug };
  saveProgress(state);
  return state;
}
