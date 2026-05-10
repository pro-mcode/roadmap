"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

interface Props {
  courseSlug: string;
  weekId: string;
  lessonSlug: string;
}

export function LessonComplete({ courseSlug, weekId, lessonSlug }: Props) {
  const { hydrated, isLessonComplete, toggleLesson } = useProgress();
  const complete = hydrated && isLessonComplete(courseSlug, weekId, lessonSlug);

  return (
    <div className="mt-16 flex items-center justify-between rounded-lg border border-border bg-elevated px-5 py-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Mark progress
        </p>
        <p className="mt-1 text-sm">
          {complete
            ? "This lesson is marked complete on this device."
            : "Mark this lesson complete to track your progress."}
        </p>
      </div>
      <Button
        variant={complete ? "secondary" : "primary"}
        onClick={() => toggleLesson(courseSlug, weekId, lessonSlug)}
      >
        <Check
          size={14}
          className={cn(
            "transition-opacity",
            complete ? "opacity-100" : "opacity-60",
          )}
        />
        {complete ? "Completed" : "Mark complete"}
      </Button>
    </div>
  );
}
