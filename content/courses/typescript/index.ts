import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";

export const typescriptCourse: Course = {
  id: "typescript",
  slug: "typescript",
  title: "TypeScript",
  subtitle:
    "Move past tutorial syntax into the type-system patterns that distinguish a senior runtime engineer.",
  description:
    "A focused, 2-week course on using the type system as a contract — discriminated unions, branded types, conditional and mapped types, and strict configurations that catch entire classes of bugs at compile time. We treat TypeScript as a tool for encoding invariants, not for type-annotating JavaScript after the fact.",
  durationWeeks: 2,
  level: "intermediate",
  progressionLevel: "beginner",
  discipline: "language",
  audience:
    "Working engineers who already use TypeScript daily and want to use it deliberately.",
  outcomes: [
    "Encode invariants using discriminated unions and branded types.",
    "Read and author conditional, mapped, and template-literal types.",
    "Set up a project with strictest type rules from day one.",
    "Type async code, generics, and library boundaries idiomatically.",
  ],
  prerequisites: [
    "Comfortable writing JavaScript / TypeScript at a basic level.",
    "Familiar with HTTP, async, and basic Node.js.",
  ],
  prerequisiteCourses: [],
  accent: "indigo",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02],
  projects: [
    {
      id: "ts-p1",
      title: "Typed money library",
      summary:
        "A small library that prevents mixing currencies at compile time, with rounding and conversion APIs.",
      difficulty: "intermediate",
      deliverables: [
        "Branded USD/EUR/NGN types",
        "Pure functions that respect the brand",
        "Vitest suite with type-level tests via tsd",
      ],
      estimatedHours: 6,
      unlocksAfter: "week-01",
    },
    {
      id: "ts-p2",
      title: "Retry helper with full inference",
      summary:
        "A higher-order retry function that preserves argument types and return types of the wrapped function.",
      difficulty: "senior",
      deliverables: [
        "Generic-preserving signature",
        "AbortController-aware cancellation",
        "Configurable backoff and predicate-based retry",
      ],
      estimatedHours: 5,
      unlocksAfter: "week-02",
    },
  ],
  capstone: {
    title: "Typed payment domain core",
    summary:
      "A small `payments-core` library: money type, payment state machine, and a typed retry helper. The seed of every later course's payment work.",
    deliverables: [
      "Branded money types",
      "Payment state as a discriminated union",
      "Exhaustive-switch helpers",
      "Typed retry / circuit-breaker helper",
    ],
  },
};
