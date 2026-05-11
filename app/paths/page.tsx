import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, GitBranch, Layers, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAllCareerPaths } from "@/lib/career-paths";
import { getCourseBySlug } from "@/lib/content";
import { accentClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Career paths",
  description:
    "Goal-oriented sequences of courses tuned for fintech backend, distributed systems, smart-contract engineering, and audit work.",
};

export default function CareerPathsIndexPage() {
  const paths = getAllCareerPaths();
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Career paths" }]}
        />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Career paths
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Each path chains a deliberate sequence of courses into a goal: the
          shortest credible route from where you are to where you're going.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((p) => (
            <Link
              key={p.id}
              href={`/paths/${p.slug}`}
              className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${accentClass(p.accent, "border")} ${accentClass(p.accent, "bg")} ${accentClass(p.accent, "text")}`}
                >
                  <GitBranch size={16} />
                </span>
                <Badge variant="outline">
                  <Clock size={11} className="mr-1" />
                  {p.durationWeeks}w
                </Badge>
                <Badge variant="outline">
                  <Layers size={11} className="mr-1" />
                  {p.courseSlugs.length} courses
                </Badge>
              </div>
              <h2 className="mt-4 text-[19px] font-semibold leading-snug">
                {p.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-muted">
                {p.subtitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.courseSlugs.map((slug) => {
                  const c = getCourseBySlug(slug);
                  return c ? (
                    <span
                      key={slug}
                      className="rounded-md border border-border bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-muted"
                    >
                      {c.title}
                    </span>
                  ) : null;
                })}
              </div>
              <div className="mt-5 inline-flex items-center gap-1 text-[12px] text-muted group-hover:text-text">
                Open path <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
