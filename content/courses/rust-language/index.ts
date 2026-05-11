import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";

export const rustLanguageCourse: Course = {
  id: "rust-language",
  slug: "rust-language",
  title: "Rust Language",
  subtitle:
    "Ownership, borrowing, traits, async — the Rust mental model behind any serious systems engineer.",
  description:
    "Two compact weeks on Rust as a working language. We focus on the model — ownership, lifetimes, traits, error handling — and on the patterns you'll meet in every crate. By the end you can read async Rust, navigate large crates, and write idiomatic code.",
  durationWeeks: 2,
  level: "intermediate",
  progressionLevel: "intermediate",
  discipline: "language",
  audience:
    "Engineers adding Rust for systems programming, protocol work, or auditing.",
  outcomes: [
    "Fluent in ownership, borrowing, and lifetimes.",
    "Use traits and generics idiomatically.",
    "Read and write async Rust with tokio.",
    "Handle errors with Result, thiserror, anyhow appropriately.",
  ],
  prerequisites: [
    "Comfortable in at least one statically typed language.",
  ],
  prerequisiteCourses: [],
  accent: "rose",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02],
  projects: [
    {
      id: "rust-p1",
      title: "CLI log filter",
      summary:
        "A streaming log filter in Rust with clap, regex, and bounded memory usage.",
      difficulty: "intermediate",
      deliverables: [
        "Clap CLI",
        "Streaming reader/writer",
        "Benchmarked against a Go equivalent",
      ],
      estimatedHours: 6,
      unlocksAfter: "week-01",
    },
  ],
  capstone: {
    title: "Async TCP echo + line server",
    summary:
      "A tokio-based server handling N connections with bounded concurrency, graceful shutdown, and structured logging.",
    deliverables: [
      "Tokio server with bounded concurrency",
      "Graceful shutdown",
      "tracing-based structured logs",
    ],
  },
};
