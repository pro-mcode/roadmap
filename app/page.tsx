import Link from "next/link";
import { ArrowRight, BookOpenCheck, Code2, Shield, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { getAllCourses, totalEstimatedMinutes, totalLessons } from "@/lib/content";
import { formatMinutes } from "@/lib/utils";

export default function HomePage() {
  const courses = getAllCourses();
  const totalLessonsAll = courses.reduce((s, c) => s + totalLessons(c), 0);

  return (
    <AppShell>
      <div className="bg-grid">
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <Badge variant="accent" className="mb-5">
            v1.0 · production-grade learning platform
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Engineering roadmaps for the work that{" "}
            <span className="gradient-text">actually moves money</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Two structured 12-week paths into the deep end of modern engineering — fintech
            infrastructure, web3 systems, and smart contract security auditing. Every
            week is grounded in real production thinking, with interview prep and
            architecture insights woven through.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/courses/${courses[0].slug}`}
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-5 text-[15px] font-medium text-accent-contrast hover:bg-accent/90"
            >
              Start the fintech path
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/courses"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-border-strong bg-transparent px-5 text-[15px] font-medium text-text hover:bg-elevated"
            >
              Browse all courses
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Courses" value={String(courses.length)} />
            <Stat label="Weeks" value={String(courses.reduce((s, c) => s + c.durationWeeks, 0))} />
            <Stat label="Lessons" value={String(totalLessonsAll)} />
            <Stat
              label="Estimated time"
              value={formatMinutes(courses.reduce((s, c) => s + totalEstimatedMinutes(c), 0))}
            />
          </div>
        </section>
      </div>

      <section className="border-t border-border bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="mb-2 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
            The two paths
          </h2>
          <p className="max-w-2xl text-[20px] leading-snug">
            Choose the track that fits where you're going. Each one is a complete,
            opinionated curriculum — not a list of links.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {courses.map((c, i) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${
                      c.accent === "indigo"
                        ? "border-accent/30 bg-accent/[0.08] text-accent"
                        : "border-danger/30 bg-danger/[0.08] text-danger"
                    }`}
                  >
                    {c.accent === "indigo" ? (
                      <Code2 size={16} />
                    ) : (
                      <Shield size={16} />
                    )}
                  </span>
                  <Badge variant="outline">{c.level}</Badge>
                  <Badge variant="outline">{c.durationWeeks} weeks</Badge>
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                  {c.subtitle}
                </p>
                <div className="mt-6 flex items-center justify-between text-[12px] text-muted">
                  <span>
                    {totalLessons(c)} lessons · {formatMinutes(totalEstimatedMinutes(c))}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:text-text">
                    Open path <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="mb-8 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
            What's inside
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<BookOpenCheck size={16} />}
              title="Documentation-grade lessons"
              body="Every lesson combines deep explanation, code examples, callouts, and architecture diagrams — designed to be read like a book and skimmed like a reference."
            />
            <Feature
              icon={<Sparkles size={16} />}
              title="Interview-ready"
              body="Each major topic ships with model-answer interview questions across beginner, intermediate, senior, and staff levels — with trade-offs and real-world examples."
            />
            <Feature
              icon={<Code2 size={16} />}
              title="Production insights"
              body="Every week ends with the operational lessons that only show up in production: what breaks, why it breaks, and how senior engineers prevent it."
            />
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-accent/30 bg-accent/[0.08] text-accent">
        {icon}
      </span>
      <h3 className="mt-4 text-[16px] font-semibold">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
