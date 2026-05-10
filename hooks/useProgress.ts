"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ProgressState,
  lessonKey,
  loadProgress,
  recordVisit,
  setLessonComplete,
  setWeekComplete,
  weekKey,
} from "@/lib/progress";

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => ({
    completedLessons: {},
    completedWeeks: {},
    lastVisited: {},
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadProgress());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "roadmap.progress.v1") setState(loadProgress());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isLessonComplete = useCallback(
    (courseSlug: string, weekId: string, lessonSlug: string) =>
      Boolean(state.completedLessons[lessonKey(courseSlug, weekId, lessonSlug)]),
    [state],
  );

  const isWeekComplete = useCallback(
    (courseSlug: string, weekId: string) =>
      Boolean(state.completedWeeks[weekKey(courseSlug, weekId)]),
    [state],
  );

  const toggleLesson = useCallback(
    (courseSlug: string, weekId: string, lessonSlug: string) => {
      const next = !isLessonComplete(courseSlug, weekId, lessonSlug);
      setState(setLessonComplete(courseSlug, weekId, lessonSlug, next));
    },
    [isLessonComplete],
  );

  const toggleWeek = useCallback(
    (courseSlug: string, weekId: string) => {
      const next = !isWeekComplete(courseSlug, weekId);
      setState(setWeekComplete(courseSlug, weekId, next));
    },
    [isWeekComplete],
  );

  const visit = useCallback(
    (courseSlug: string, weekId: string, lessonSlug: string) => {
      setState(recordVisit(courseSlug, weekId, lessonSlug));
    },
    [],
  );

  return {
    state,
    hydrated,
    isLessonComplete,
    isWeekComplete,
    toggleLesson,
    toggleWeek,
    visit,
  };
}
