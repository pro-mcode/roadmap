import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";

export const algorithmsCourse: Course = {
  id: "algorithms",
  slug: "algorithms",
  title: "Algorithms & Data Structures",
  subtitle:
    "Backend-relevant algorithms: the structures you'll actually reach for, and the interview drill that proves you can.",
  description:
    "Two weeks focused on the algorithmic toolbox a backend engineer actually uses — hash maps, heaps, graphs, intervals, and the senior-interview patterns built on top of them. Each lesson pairs the data structure with a real backend scenario where it's the right answer.",
  durationWeeks: 2,
  level: "intermediate",
  progressionLevel: "intermediate",
  discipline: "computer-science",
  audience:
    "Engineers preparing for senior interviews or rebuilding the algorithmic fundamentals they skipped.",
  outcomes: [
    "Pick the right data structure quickly and justify it.",
    "Solve interview-grade graph, interval, and heap problems with confidence.",
    "Reason about amortized and average-case complexity, not just worst-case.",
    "Read and write clean, well-tested algorithmic code under time pressure.",
  ],
  prerequisites: [
    "Comfortable with one general-purpose programming language.",
    "Familiar with basic Big-O.",
  ],
  prerequisiteCourses: [],
  accent: "violet",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02],
  projects: [
    {
      id: "alg-p1",
      title: "Rate limiter from scratch",
      summary:
        "Implement token-bucket and sliding-window-log rate limiters with full test suites and benchmarks.",
      difficulty: "intermediate",
      deliverables: [
        "Two limiter implementations",
        "Property-based tests",
        "Microbenchmark comparison",
      ],
      estimatedHours: 6,
      unlocksAfter: "week-01",
    },
  ],
  capstone: {
    title: "Order-book matching engine, simplified",
    summary:
      "Build a price-time-priority matching engine using heaps and balanced trees. Run a deterministic replay test.",
    deliverables: [
      "Order book with O(log n) ops",
      "Deterministic replay harness",
      "Latency histogram",
    ],
  },
};
