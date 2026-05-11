import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";
import { week03 } from "./week-03";

export const golangCourse: Course = {
  id: "golang",
  slug: "golang",
  title: "Golang",
  subtitle:
    "The language and runtime for backend systems that demand throughput and predictable latency.",
  description:
    "A 3-week deep dive into idiomatic Go: the type system, concurrency primitives, error-handling discipline, and the operational tooling that ships with the language. Every week is anchored in real backend work — services, queues, and gRPC contracts.",
  durationWeeks: 3,
  level: "intermediate",
  progressionLevel: "intermediate",
  discipline: "language",
  audience:
    "Engineers from any backend background adding Go to their toolbelt for high-throughput services.",
  outcomes: [
    "Read and write idiomatic Go: interfaces, channels, contexts, errors.",
    "Apply concurrency patterns (worker pools, fan-in/fan-out, structured concurrency).",
    "Operate Go services in production: pprof, GC, deployment.",
    "Design gRPC services with proto-defined contracts.",
  ],
  prerequisites: [
    "Comfortable in at least one backend language already.",
    "Working knowledge of HTTP and APIs.",
  ],
  prerequisiteCourses: [],
  accent: "teal",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02, week03],
  projects: [
    {
      id: "go-p1",
      title: "Concurrent worker pool",
      summary:
        "A reusable worker-pool library with bounded concurrency, context cancellation, and graceful shutdown.",
      difficulty: "intermediate",
      deliverables: [
        "Generic Pool[T] type",
        "Context cancellation propagation",
        "Benchmarks vs unbounded goroutines",
      ],
      estimatedHours: 6,
      unlocksAfter: "week-02",
    },
    {
      id: "go-p2",
      title: "gRPC ledger service",
      summary:
        "A small ledger service exposed via gRPC with proto-first contracts, integration tests, and pprof instrumentation.",
      difficulty: "senior",
      deliverables: [
        "Proto definitions",
        "Postgres-backed ledger",
        "Bench harness with latency histograms",
      ],
      estimatedHours: 12,
      unlocksAfter: "week-03",
    },
  ],
  capstone: {
    title: "High-throughput webhook ingester",
    summary:
      "A Go service that ingests webhooks at high RPS, deduplicates, and enqueues into a downstream queue. Production shape: graceful shutdown, structured logging, observability, and load tests.",
    deliverables: [
      "HTTP handler with explicit concurrency limits",
      "Redis-backed dedupe",
      "pprof + trace instrumentation",
      "k6 load test",
    ],
  },
};
