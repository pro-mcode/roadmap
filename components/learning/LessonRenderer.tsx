import type { Lesson } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { BlockRenderer } from "./BlockRenderer";
import { ExerciseList } from "./ExerciseList";
import { Quiz } from "./Quiz";
import { ResourceList } from "./ResourceList";
import { InterviewSet } from "./InterviewSet";
import { ProductionInsights } from "./ProductionInsights";
import { LessonHeader } from "./LessonHeader";
import { LessonComplete } from "./LessonComplete";

interface Props {
  courseSlug: string;
  weekId: string;
  lesson: Lesson;
  /** Pre-rendered shiki HTML, index-aligned with lesson.blocks. */
  highlights?: (string | undefined)[];
}

export function LessonRenderer({ courseSlug, weekId, lesson, highlights }: Props) {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <LessonHeader lesson={lesson} />
      <div className="mt-8">
        <BlockRenderer blocks={lesson.blocks} highlights={highlights} />
      </div>

      {lesson.productionInsights && lesson.productionInsights.length > 0 && (
        <section className="mt-12">
          <SectionTitle>Production insights</SectionTitle>
          <ProductionInsights insights={lesson.productionInsights} />
        </section>
      )}

      {lesson.exercises && lesson.exercises.length > 0 && (
        <section className="mt-12">
          <SectionTitle>Exercises</SectionTitle>
          <ExerciseList exercises={lesson.exercises} />
        </section>
      )}

      {lesson.quiz && lesson.quiz.length > 0 && (
        <section className="mt-12">
          <SectionTitle>Knowledge check</SectionTitle>
          <Quiz questions={lesson.quiz} />
        </section>
      )}

      {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 && (
        <section className="mt-12">
          <SectionTitle>Interview prep</SectionTitle>
          <InterviewSet questions={lesson.interviewQuestions} />
        </section>
      )}

      {lesson.resources && lesson.resources.length > 0 && (
        <section className="mt-12">
          <SectionTitle>Recommended resources</SectionTitle>
          <ResourceList resources={lesson.resources} />
        </section>
      )}

      <LessonComplete
        courseSlug={courseSlug}
        weekId={weekId}
        lessonSlug={lesson.slug}
      />
    </article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
      {children}
    </h2>
  );
}

// Re-export so the lesson page can use Badge if needed
export { Badge };
