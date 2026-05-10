import Link from "next/link";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description:
    "How this platform is built and why each curriculum exists.",
};

export default function AboutPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          About this roadmap
        </h1>
        <div className="prose-doc mt-6">
          <p>
            This platform exists because most engineering content stops at the
            tutorial layer — enough to write code, not enough to design or audit
            production systems. The two roadmaps here are designed to bridge that
            gap with a real curriculum: structured weeks, deliverables, review
            gates, and interview-grade discussion of trade-offs.
          </p>
          <h2>How it's organized</h2>
          <p>
            Each course is twelve weeks. Each week opens with objectives,
            concepts, deliverables, a stack, and a review gate — the question
            you should be able to answer before moving on. Inside, a small
            number of substantive lessons combine deep explanation, code,
            architecture diagrams, callouts, exercises, quizzes, interview
            questions, and production insights.
          </p>
          <h2>How content is authored</h2>
          <p>
            Lessons are typed TypeScript modules under{" "}
            <code>/content/courses/&lt;slug&gt;</code>. The schema in{" "}
            <code>/types/content.ts</code> enforces structure. Optional MDX is
            supported per lesson via the <code>mdx</code> field.
          </p>
          <h2>Contributing</h2>
          <p>
            See the{" "}
            <Link href="https://github.com/" target="_blank">
              repository
            </Link>{" "}
            for the contribution guide and the content authoring guide. Pull
            requests for typo fixes, new exercises, and additional interview
            questions are especially welcome.
          </p>
        </div>
      </article>
      <Footer />
    </AppShell>
  );
}
