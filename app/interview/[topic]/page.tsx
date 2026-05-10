import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { InterviewSet } from "@/components/learning/InterviewSet";
import {
  collectInterviewQuestions,
  getAllCourses,
  getCourseBySlug,
} from "@/lib/content";

interface Props {
  params: { topic: string };
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ topic: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourseBySlug(params.topic);
  if (!course) return {};
  return {
    title: `Interview prep · ${course.title}`,
    description: `${collectInterviewQuestions(course).length} interview questions with model answers.`,
  };
}

export default function InterviewByCoursePage({ params }: Props) {
  const course = getCourseBySlug(params.topic);
  if (!course) notFound();
  const questions = collectInterviewQuestions(course);

  // group by category
  const grouped: Record<string, typeof questions> = {};
  for (const q of questions) {
    grouped[q.category] = grouped[q.category] ?? [];
    grouped[q.category].push(q);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Interview prep", href: "/interview" },
            { label: course.title },
          ]}
        />
        <div className="mt-5 flex items-center gap-2">
          <Badge variant="accent">{course.title}</Badge>
          <Badge variant="outline">{questions.length} questions</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Interview preparation
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Every question carries a model answer, trade-off analysis, and where
          relevant a real-world example. Click a card to expand the answer.
        </p>

        <div className="mt-10 space-y-12">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
                {category}
              </h2>
              <InterviewSet questions={items} />
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
