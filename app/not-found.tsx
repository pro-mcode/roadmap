import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-5 py-24 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="text-muted">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md border border-border-strong px-4 text-sm hover:bg-elevated"
        >
          Back to home
        </Link>
      </div>
      <Footer />
    </AppShell>
  );
}
