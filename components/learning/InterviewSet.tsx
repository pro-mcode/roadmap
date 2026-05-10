"use client";

import { useState } from "react";
import type { InterviewQuestion } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function InterviewSet({
  questions,
}: {
  questions: InterviewQuestion[];
}) {
  return (
    <ol className="space-y-3">
      {questions.map((q) => (
        <InterviewRow key={q.id} q={q} />
      ))}
    </ol>
  );
}

export function InterviewRow({ q }: { q: InterviewQuestion }) {
  const [open, setOpen] = useState(false);
  return (
    <li id={q.id} className="rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{q.level}</Badge>
            <Badge variant="outline">{q.category}</Badge>
          </div>
          <p className="mt-2 text-[15px] font-medium">{q.question}</p>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "mt-1 shrink-0 text-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-border px-5 py-4 text-sm">
          <Section title="Model answer">{q.modelAnswer}</Section>
          {q.tradeoffs && q.tradeoffs.length > 0 && (
            <SectionList title="Trade-offs" items={q.tradeoffs} />
          )}
          {q.realWorldExample && (
            <Section title="Real-world example">{q.realWorldExample}</Section>
          )}
          {q.followUps && q.followUps.length > 0 && (
            <SectionList title="Follow-ups" items={q.followUps} />
          )}
        </div>
      )}
    </li>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h5 className="font-mono text-[11px] uppercase tracking-wider text-muted">
        {title}
      </h5>
      <p className="mt-1 leading-relaxed text-text/90">{children}</p>
    </div>
  );
}

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h5 className="font-mono text-[11px] uppercase tracking-wider text-muted">
        {title}
      </h5>
      <ul className="mt-1 list-disc pl-5 text-text/90">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
