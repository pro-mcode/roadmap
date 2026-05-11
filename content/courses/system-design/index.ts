import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";
import { week03 } from "./week-03";
import { week04 } from "./week-04";

export const systemDesignCourse: Course = {
  id: "system-design",
  slug: "system-design",
  title: "System Design",
  subtitle:
    "From scalability fundamentals to fintech and crypto-grade production architectures.",
  description:
    "Four weeks on the system-design craft: foundations, distributed systems, messaging and infrastructure, and the production architectures used by fintech and crypto teams. Each week builds toward a concrete capstone — the kind of design you'd defend at a senior interview or walk a CTO through.",
  durationWeeks: 4,
  level: "senior",
  progressionLevel: "advanced",
  discipline: "architecture",
  audience:
    "Backend engineers heading toward senior and staff roles in fintech, distributed systems, or crypto infrastructure.",
  outcomes: [
    "Reason about CAP, consistency, and latency from first principles.",
    "Choose between Kafka, RabbitMQ, and BullMQ deliberately.",
    "Design payment, ledger, and crypto-custody systems end to end.",
    "Defend a system design at the senior / staff interview bar.",
  ],
  prerequisites: [
    "Comfortable with at least one backend stack in production.",
    "Working familiarity with databases and HTTP.",
  ],
  prerequisiteCourses: ["nodejs-express", "database-design"],
  accent: "rose",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02, week03, week04],
  projects: [
    {
      id: "sd-p1",
      title: "Payments architecture diagram + ADRs",
      summary:
        "Design an end-to-end payments system with explicit consistency, idempotency, and reconciliation. Document with ADRs.",
      difficulty: "senior",
      deliverables: [
        "Architecture diagram",
        "Three ADRs covering the hardest trade-offs",
        "Capacity model",
      ],
      estimatedHours: 10,
      unlocksAfter: "week-04",
    },
  ],
  capstone: {
    title: "Crypto custody architecture",
    summary:
      "Design a hot/warm/cold custody architecture with key management, signing approval workflow, ledger reconciliation, and observability.",
    deliverables: [
      "Component diagram",
      "Threat model",
      "Failure-mode analysis",
      "Runbook for a partial-signing outage",
    ],
  },
};
