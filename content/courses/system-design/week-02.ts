import type { Week } from "@/types/content";
import {
  blocks,
  callout,
  code,
  diagram,
  h2,
  h3,
  p,
  ul,
} from "@/content/courses/_helpers";

export const week02: Week = {
  id: "week-02",
  number: 2,
  title: "Distributed systems patterns",
  stage: "Distributed",
  summary:
    "Microservices, service discovery, circuit breakers, API gateways, event-driven architectures, CQRS and event sourcing — the standard distributed-systems toolbox.",
  objectives: [
    "Pick microservice boundaries that survive a year of change.",
    "Apply circuit breakers and bulkheads to prevent cascading failure.",
    "Use API gateways for cross-cutting concerns deliberately.",
    "Model event-driven systems with explicit ordering and replay guarantees.",
  ],
  concepts: [
    "Service boundaries; data ownership",
    "Service discovery: DNS, sidecar, mesh",
    "Circuit breakers, bulkheads, timeouts",
    "API gateway responsibilities",
    "CQRS, event sourcing, projections",
  ],
  deliverables: [
    "Decomposition exercise: split a monolith with explicit data ownership.",
    "Circuit breaker with state diagram and tests.",
  ],
  reviewGate:
    "If a downstream service starts returning 503s, what happens to your service? Draw the failure path.",
  stack: ["Diagrams", "Service mesh awareness"],
  modules: [
    {
      id: "sd-w02-m1",
      title: "Distributed patterns",
      summary: "The patterns you'll either ship or get burned by.",
      progression: "core",
      lessons: [
        {
          id: "sd-w02-l1",
          slug: "circuit-breakers",
          title: "Circuit breakers and bulkheads",
          summary:
            "Stop hopeful retries from amplifying outages. Open the circuit, shed load, half-open to probe.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["resilience"],
          blocks: blocks(
            diagram(
              `[ CLOSED ] --(fail rate ↑)--> [ OPEN ]
   ▲                                  │
   │                              (timeout)
   │                                  ▼
   └---(probe success)----------[ HALF-OPEN ]`,
              "Circuit breaker state diagram",
            ),
            callout(
              "production",
              "Circuit breakers prevent your service from becoming part of the outage. Pair with bulkheads (separate thread pools / connections per downstream) so one slow dependency can't drain your whole worker pool.",
            ),
          ),
        },
        {
          id: "sd-w02-l2",
          slug: "cqrs-and-event-sourcing",
          title: "CQRS and event sourcing",
          summary:
            "Split reads from writes. Persist intent (events) instead of state. Build read models from the stream.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["cqrs", "event-sourcing"],
          blocks: blocks(
            ul([
              "Event sourcing: the event log is the source of truth.",
              "CQRS: write model handles commands; read models are projections optimized per query.",
              "Replay: rebuild any projection by replaying the log.",
              "Cost: complexity. Reward: audit trail, time travel, decoupled reads.",
            ]),
          ),
          interviewQuestions: [
            {
              id: "iv-sd-w02-l2-1",
              level: "senior",
              category: "Architecture",
              question:
                "When is event sourcing a bad fit?",
              modelAnswer:
                "When the domain is CRUD with no audit requirement, when ad-hoc queries against current state are the primary need, when the team isn't ready to operate replay tooling. Event sourcing rewards domains where the history matters (ledgers, audit-heavy workflows). It punishes domains where it doesn't.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Boundaries follow data ownership",
      summary:
        "Two services sharing a table are one service in two repos.",
      details:
        "The cleanest microservice boundary is data ownership: this service is the only writer to these tables. If you can't draw that line, you don't have services — you have a distributed monolith.",
    },
  ],
};
