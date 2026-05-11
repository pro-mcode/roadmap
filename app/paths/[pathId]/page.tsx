import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, GitBranch, Target, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  getAllCareerPaths,
  getCareerPathBySlug,
} from "@/lib/career-paths";
import { getCourseBySlug, totalLessons } from "@/lib/content";
import { accentClass, pad } from "@/lib/utils";

interface PageProps {
  params: Promise<{ pathId: string }>;
}

export async function generateStaticParams() {
  return getAllCareerPaths().map((p) => ({ pathId: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { pathId } = await params;
  const p = getCareerPathBySlug(pathId);
  if (!p) return { title: "Path not found" };
  return { title: p.title, description: p.subtitle };
}

export default async function CareerPathPage({ params }: PageProps) {
  const { pathId } = await params;
  const path = getCareerPathBySlug(pathId);
  if (!path) notFound();

  const courses = path.courseSlugs
    .map((slug) => getCourseBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Career paths", href: "/paths" },
            { label: path.title },
          ]}
        />
        <div className="mt-6 flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${accentClass(path.accent, "border")} ${accentClass(path.accent, "bg")} ${accentClass(path.accent, "text")}`}
          >
            <GitBranch size={18} />
          </span>
          <Badge variant="outline">{path.durationWeeks} weeks total</Badge>
          <Badge variant="outline">{courses.length} courses</Badge>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {path.title}
        </h1>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-muted">
          {path.subtitle}
        </p>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-muted">
          {path.description}
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Panel icon={<Target size={14} />} title="Outcomes">
            <ul className="space-y-2 text-[13.5px] leading-relaxed text-muted">
              {path.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {o}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={<Users size={14} />} title="Who it's for">
            <p className="text-[13.5px] leading-relaxed text-muted">
              {path.audience}
            </p>
          </Panel>
          <Panel icon={<GitBranch size={14} />} title="Course chain">
            <p className="text-[13.5px] leading-relaxed text-muted">
              Each course is self-contained but the order is deliberate — every
              course's outputs feed the next.
            </p>
          </Panel>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Sequence
          </h2>
          <ol className="space-y-3">
            {courses.map((c, i) => (
              <li key={c.id}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
                >
                  <span className="font-mono text-[12px] text-muted">
                    {pad(i + 1)}
                  </span>
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md border ${accentClass(c.accent, "border")} ${accentClass(c.accent, "bg")} ${accentClass(c.accent, "text")} font-mono text-[11px]`}
                  >
                    {c.title.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="text-[16.5px] font-semibold">{c.title}</h3>
                      <Badge variant="outline">{c.durationWeeks}w</Badge>
                      <Badge variant="outline">{c.progressionLevel}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
                      {c.subtitle}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-muted group-hover:translate-x-0.5 group-hover:text-text"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <Footer />
    </AppShell>
  );
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
