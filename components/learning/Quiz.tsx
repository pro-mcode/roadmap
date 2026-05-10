"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/content";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  return (
    <ol className="space-y-4">
      {questions.map((q, i) => (
        <QuizCard key={q.id} index={i + 1} question={q} />
      ))}
    </ol>
  );
}

function QuizCard({
  index,
  question,
}: {
  index: number;
  question: QuizQuestion;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === question.correctIndex;

  return (
    <li className="rounded-lg border border-border bg-surface px-5 py-4">
      <p className="text-[15px] font-medium">
        <span className="mr-2 font-mono text-[12px] text-muted">Q{index}.</span>
        {question.question}
      </p>
      <div className="mt-3 grid gap-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = question.correctIndex === i;
          const showResult = selected !== null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                "border-border bg-elevated hover:border-border-strong",
                showResult && isSelected && correct && "border-success/50 bg-success/[0.07]",
                showResult && isSelected && !correct && "border-danger/50 bg-danger/[0.07]",
                showResult && !isSelected && isAnswer && "border-success/40",
              )}
            >
              <span className="font-mono text-[11px] text-muted">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {showResult && isSelected && correct && (
                <Check size={14} className="text-success" />
              )}
              {showResult && isSelected && !correct && (
                <X size={14} className="text-danger" />
              )}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="mt-3 rounded-md border border-border bg-elevated px-3 py-2 text-[13px] text-text/90">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {correct ? "Correct" : "Explanation"}
          </span>
          <br />
          {question.explanation}
        </p>
      )}
    </li>
  );
}
