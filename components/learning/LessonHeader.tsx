import type { Lesson } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";
import { formatMinutes } from "@/lib/utils";

export function LessonHeader({ lesson }: { lesson: Lesson }) {
  return (
    <header className="border-b border-border pb-8">
      <div className="flex items-center gap-2">
        <Badge variant="accent">{lesson.difficulty}</Badge>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
          <Clock size={12} /> {formatMinutes(lesson.estimatedMinutes)}
        </span>
      </div>
      <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">
        {lesson.title}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
        {lesson.summary}
      </p>
      {lesson.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {lesson.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </header>
  );
}
