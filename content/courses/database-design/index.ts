import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";

export const databaseDesignCourse: Course = {
  id: "database-design",
  slug: "database-design",
  title: "Database Design (SQL & NoSQL)",
  subtitle:
    "Schema discipline, transactional intuition, and the operational craft Postgres rewards — plus the NoSQL trade-offs you'll meet in production.",
  description:
    "Two weeks on the database craft that holds up under audit and traffic. We focus on Postgres because it's the most common production target, then contrast NoSQL trade-offs (DynamoDB, MongoDB, Cassandra) so you can pick the right tool for the right shape of data.",
  durationWeeks: 2,
  level: "intermediate",
  progressionLevel: "intermediate",
  discipline: "data",
  audience:
    "Backend engineers responsible for schema design, transactions, and operational ownership.",
  outcomes: [
    "Design schemas where invariants are enforced by constraints.",
    "Reason about transactions, isolation levels, and the anomalies they each allow.",
    "Plan online migrations on multi-million-row tables.",
    "Choose between SQL and NoSQL with a clear rubric.",
  ],
  prerequisites: [
    "Comfortable with SQL basics.",
    "Familiarity with one backend language.",
  ],
  prerequisiteCourses: [],
  accent: "amber",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02],
  projects: [
    {
      id: "db-p1",
      title: "Ledger schema with constraints",
      summary:
        "Design and implement a double-entry ledger schema where the database — not the application — enforces correctness.",
      difficulty: "senior",
      deliverables: [
        "Schema with CHECK / EXCLUSION constraints",
        "Online migration plan",
        "Index audit script",
      ],
      estimatedHours: 6,
      unlocksAfter: "week-01",
    },
  ],
  capstone: {
    title: "Online expand-contract migration",
    summary:
      "Plan and execute a zero-downtime migration on a 100M-row table: NOT NULL column with a default, validated under load.",
    deliverables: [
      "Phased migration script",
      "Backfill worker with throttling",
      "Validation queries",
      "Rollback plan",
    ],
  },
};
