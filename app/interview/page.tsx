import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { collectInterviewQuestions, getAllCourses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Interview prep",
  description:
    "Curated interview questions across all courses, with model answers, trade-offs, and real-world examples.",
};

export default function InterviewIndexPage() {
  const courses = getAllCourses();
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Interview prep" }]}
        />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Interview preparation
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Every major topic in every course ships with model-answer interview
          questions. Pick a course to drill into.
        </p>

        <div className="mt-10 grid gap-4">
          {courses.map((c) => {
            const total = collectInterviewQuestions(c).length;
            return (
              <Link
                key={c.id}
                href={`/interview/${c.slug}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 hover:border-border-strong"
              >
                <div>
                  <h2 className="text-[18px] font-semibold">{c.title}</h2>
                  <p className="mt-1 text-[14px] text-muted">{c.subtitle}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline">{total} questions</Badge>
                    <Badge variant="outline">{c.level}</Badge>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
