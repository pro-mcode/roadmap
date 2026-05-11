import type { Week } from "@/types/content";
import { blocks, callout, code, h2, ol, ul } from "@/content/courses/_helpers";
export const week11: Week = {
  id: "week-11",
  number: 11,
  title: "System design, observability, and CI/CD",
  stage: "Advanced Infrastructure",
  summary:
    "The senior-level system thinking and the production craft that ties everything from earlier weeks into a real platform.",
  objectives: [
    "Design systems for scale: capacity planning, partitioning, caching tiers.",
    "Instrument services with structured logs, metrics, and traces.",
    "Build CI/CD pipelines that prevent bad deploys and recover quickly when they happen.",
    "Operate Docker containers and reason about images, networks, and resource limits.",
  ],
  concepts: [
    "Capacity model, headroom, p99 budgeting",
    "Partitioning by key, hash, range; consistent hashing",
    "Caching: read-through, write-through, write-behind, TTLs",
    "Metrics, logs, traces; RED/USE methods",
    "Blue/green, canary, feature flags, rollback",
  ],
  deliverables: [
    "Architecture diagram for a 100-RPS payment service with explicit failure modes.",
    "Instrumentation pack: structured logger, metrics middleware, tracing context.",
    "CI pipeline that runs unit/integration/acceptance tests, builds an image, and deploys via canary.",
  ],
  reviewGate:
    "If your service starts dropping requests, can your dashboards tell you which subsystem is at fault within 60 seconds?",
  stack: ["Docker", "OpenTelemetry", "Prometheus", "GitHub Actions"],
  modules: [
    {
      id: "w11-m1",
      title: "Designing for scale and failure",
      summary:
        "Scale is just failure with more zeros. Design for the failure first.",
      lessons: [
        {
          id: "w11-l1",
          slug: "system-design-template",
          title: "A senior interview's system design template",
          summary:
            "A repeatable structure for system design questions: requirements, capacity, API, data, scale, failure, evolution.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["system-design", "interviews"],
          blocks: blocks(
            h2("The 7-step template"),
            ol([
              "Clarify functional and non-functional requirements (RPS, latency, durability).",
              "Capacity model — turn requirements into numbers (writes/sec, GB/year, peak factor).",
              "API surface — list the endpoints/RPCs you'll commit to.",
              "Data model — schemas, partitioning, indexes, retention.",
              "Architecture — diagram with components, async boundaries, caches.",
              "Failure modes — what fails first, what protects users, how you detect.",
              "Evolution — how the design degrades or upgrades over 10× growth.",
            ]),
            callout(
              "tip",
              "Interviewers want to see explicit numbers. Pick one, justify it, move on. 'Probably a few thousand RPS' loses; '5k peak RPS, 30% headroom, derived from 1M MAU × 4 actions/day × 3× peak' wins.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w11-l1-1",
              level: "senior",
              category: "System design",
              question:
                "Design a global payment processor that supports 10k TPS and < 200ms p99.",
              modelAnswer:
                "Start with capacity: 10k TPS × 86_400 = 864M events/day, partitioning by merchant ID. Region: keep money movement in the customer's region for compliance, replicate aggregates across regions. Sync write path: API → idempotency dedupe (Redis) → ledger write (Postgres) → outbox row. Async path: outbox worker → publish 'payment.captured' to Kafka → fan-out for analytics, notifications, settlement. p99 budget: 50ms idempotency, 80ms ledger commit (use prepared statements + connection pooling), 20ms response = 150ms with 50ms slack. Failure: provider degrade triggers route to backup; database failover via read-replica promotion; Kafka backpressure flips ingestion to 'queue-only' mode.",
              followUps: [
                "How do you handle a regional outage mid-transaction?",
                "What's your testing strategy for a system this size?",
              ],
            },
          ],
        },
        {
          id: "w11-l2",
          slug: "observability",
          title: "Observability: logs, metrics, traces",
          summary:
            "Three pillars, each with a job. Get them right and you'll debug production from your laptop in under five minutes.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["observability", "monitoring"],
          blocks: blocks(
            h2("Pick the right tool for the question"),
            ul([
              "Logs answer 'what happened in this specific request?'",
              "Metrics answer 'how is the system behaving in aggregate?'",
              "Traces answer 'where did this request spend its time and which services did it cross?'",
            ]),
            code(
              "typescript",
              `// Structured logging — every line a JSON object with stable keys
import pino from "pino";
const log = pino({ base: { service: "payments-api", env: process.env.ENV } });

log.info({ requestId, userId, route: "/transfer", durMs: 84, status: 200 });
log.error({ requestId, err: { code: err.code, message: err.message } }, "transfer failed");`,
              "Structured logs are what makes log search useful at scale.",
            ),
            callout(
              "production",
              "Add request IDs at the edge (or generate one). Propagate via headers. Every log line in every service for that request must carry it. Tracing without request IDs is archaeology.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w11-set-1",
      level: "senior",
      category: "CI/CD",
      question:
        "Walk me through a deploy that started bad and how you'd recover.",
      modelAnswer:
        "Detection: error rate alarm fires within 60 seconds of canary going to 5% traffic. Action: automatic rollback (traffic shifted back, deploy frozen). Diagnosis: pull canary logs, capture stack traces, compare to baseline. If the bug is obvious, push a fix and re-canary; if not, leave the rollback in place and dig deeper. Post-incident: write up the failure mode, add the test case that would have caught it, and update the deploy alarm sensitivity if the alert was slow.",
    },
  ],
  productionInsights: [
    {
      title: "Make rollback the default",
      summary:
        "If rolling back is harder than rolling forward, your team will roll forward into chaos.",
      details:
        "Use migrations that are forward-only and backward-compatible (expand-contract). Keep the previous version's binary readily available. Write deploys so that any deploy can be undone in under 60 seconds without waking up a senior engineer. The cultural payoff is enormous — small fixes ship fearlessly.",
    },
  ],
};
