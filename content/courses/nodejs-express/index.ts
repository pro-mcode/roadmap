import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";
import { week03 } from "./week-03";

export const nodejsExpressCourse: Course = {
  id: "nodejs-express",
  slug: "nodejs-express",
  title: "Node.js + Express",
  subtitle:
    "The runtime mental model and the production-grade Express patterns behind every working backend.",
  description:
    "Three weeks of focused work on the Node.js runtime: event loop deeply, streams and backpressure, the async patterns that decide your service's tail latency. Then Express at production quality — middleware design, error contracts, validation, observability, and the patterns that keep request handlers honest.",
  durationWeeks: 3,
  level: "intermediate",
  progressionLevel: "intermediate",
  discipline: "backend",
  audience:
    "Engineers building production Node services that must hold up under load.",
  outcomes: [
    "Reason about latency at the event-loop level.",
    "Design Express middleware stacks with explicit error contracts.",
    "Implement webhook receivers that survive replay attacks and out-of-order delivery.",
    "Operate Node services with structured logging, metrics, and graceful shutdown.",
  ],
  prerequisites: [
    "Comfortable in TypeScript at the level of the TypeScript course in this platform.",
    "Working familiarity with HTTP and JSON APIs.",
  ],
  prerequisiteCourses: ["typescript"],
  accent: "emerald",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02, week03],
  projects: [
    {
      id: "node-p1",
      title: "Webhook receiver service",
      summary:
        "An Express service that accepts webhooks from a payment provider with HMAC verification, replay window, and an idempotent processor.",
      difficulty: "senior",
      deliverables: [
        "Raw-body capture middleware",
        "Constant-time signature verification",
        "Inbox table + idempotent dispatcher",
        "Integration test suite",
      ],
      estimatedHours: 8,
      unlocksAfter: "week-02",
    },
  ],
  capstone: {
    title: "Production-grade Express service",
    summary:
      "An Express service shaped like the ones senior engineers build: typed routes, middleware contracts, structured logging, error taxonomy, graceful shutdown.",
    deliverables: [
      "Typed Express + Zod stack",
      "Pino structured logging with request IDs",
      "Standardized Problem+JSON error contract",
      "Health, readiness, and shutdown handlers",
    ],
  },
};
