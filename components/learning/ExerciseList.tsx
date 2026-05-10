"use client";

import { useState } from "react";
import type { Exercise } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  return (
    <ol className="space-y-3">
      {exercises.map((ex, i) => (
        <ExerciseRow key={ex.id} index={i + 1} exercise={ex} />
      ))}
    </ol>
  );
}

function ExerciseRow({
  index,
  exercise,
}: {
  index: number;
  exercise: Exercise;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-elevated font-mono text-[11px] text-muted">
            {index}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-medium">{exercise.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{exercise.difficulty}</Badge>
            </div>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4 text-sm">
          <p className="text-text/90">{exercise.prompt}</p>
          <h5 className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
            Acceptance criteria
          </h5>
          <ul className="mt-1 list-disc pl-5 text-text/90">
            {exercise.acceptanceCriteria.map((c, j) => (
              <li key={j}>{c}</li>
            ))}
          </ul>
          {exercise.hints && exercise.hints.length > 0 && (
            <>
              <h5 className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                Hints
              </h5>
              <ul className="mt-1 list-disc pl-5 text-muted">
                {exercise.hints.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </>
          )}
          {exercise.solutionSketch && (
            <>
              <h5 className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                Solution sketch
              </h5>
              <p className="mt-1 text-text/85">{exercise.solutionSketch}</p>
            </>
          )}
        </div>
      )}
    </li>
  );
}
