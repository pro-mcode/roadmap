import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-6 text-[12px] text-muted sm:flex-row sm:items-center sm:px-8">
        <p className="font-mono uppercase tracking-wider">
          Engineering Roadmap · v1.0
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/courses" className="hover:text-text">
            Courses
          </Link>
          <Link href="/interview" className="hover:text-text">
            Interview prep
          </Link>
          <Link href="/about" className="hover:text-text">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
