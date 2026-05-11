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

export const week04: Week = {
  id: "week-04",
  number: 4,
  title: "Production architecture: payments, crypto, observability",
  stage: "Production",
  summary:
    "The architectures fintech and crypto teams actually ship. Payments, ledgers, crypto custody, saga patterns, and the observability that makes them operable.",
  objectives: [
    "Design a payment system end-to-end with explicit idempotency and reconciliation.",
    "Reason about a ledger that holds up under audit.",
    "Place hot/warm/cold custody for crypto infrastructure.",
    "Use the saga pattern for distributed transactions you can't have.",
    "Wire observability (logs, metrics, traces) into every component.",
  ],
  concepts: [
    "Payment authorization vs capture vs settlement",
    "Double-entry ledger architecture",
    "Hot/warm/cold custody, key ceremony",
    "Saga pattern: choreography vs orchestration",
    "Observability: structured logs, RED/USE metrics, distributed traces",
  ],
  deliverables: [
    "Payments architecture diagram with idempotency, retries, and reconciliation.",
    "Crypto custody design with threat model.",
  ],
  reviewGate:
    "Walk a senior engineer through your custody architecture in 10 minutes.",
  stack: ["Postgres", "Kafka", "Redis", "OpenTelemetry"],
  modules: [
    {
      id: "sd-w04-m1",
      title: "Production architecture",
      summary: "End-to-end designs in fintech and crypto.",
      progression: "advanced",
      lessons: [
        {
          id: "sd-w04-l1",
          slug: "payment-system",
          title: "Designing a payment system",
          summary:
            "Authorization, capture, settlement — each step is its own state machine with its own idempotency contract.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["payments", "fintech"],
          blocks: blocks(
            diagram(
              `[client] → [api] → [auth-svc] → [card network]
                ↘ [capture-q] → [capture-svc] → [card network]
                                       ↓
                              [ledger]  →  [reconciliation]`,
              "Payment flow at a glance",
            ),
            ul([
              "Idempotency-Key required on every state-changing call.",
              "Inbox table at every async boundary — never lose a webhook.",
              "Reconciliation runs nightly against the provider's settlement report; mismatches become tickets, not silent drift.",
              "Every write is double-entry to the ledger.",
            ]),
          ),
        },
        {
          id: "sd-w04-l2",
          slug: "crypto-custody",
          title: "Crypto custody architecture",
          summary:
            "Hot/warm/cold tiers, key ceremony, signing approval workflow, ledger reconciliation, monitoring.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["crypto", "custody", "security"],
          blocks: blocks(
            ul([
              "Hot wallet: minimal balance, automated signing, monitored heavily.",
              "Warm wallet: M-of-N signing, manual approval, replenishes hot.",
              "Cold wallet: offline, HSM-backed, deep key ceremony to access.",
              "Every withdrawal lands in the ledger BEFORE the on-chain broadcast.",
              "Reconcile chain state against ledger every block.",
            ]),
            callout(
              "production",
              "The threat model for custody includes the operators. Design so that no single human can produce a valid signature. M-of-N with explicit duties is the default.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-sd-w04-l2-1",
              level: "senior",
              category: "Crypto / custody",
              question:
                "Design a withdrawal flow that's robust to a partial outage of your signing service.",
              modelAnswer:
                "Persist the withdrawal intent to the ledger as 'pending' before any signing call. The signing service consumes from a durable queue; failures retry with backoff. On-chain broadcast is idempotent — same nonce, same signed payload. Reconciliation worker watches both the chain and the ledger; mismatches alert an operator. If the signing service is down, withdrawals queue safely; on recovery, they process in order without double-spends.",
            },
          ],
        },
        {
          id: "sd-w04-l3",
          slug: "observability",
          title: "Observability: logs, metrics, traces",
          summary:
            "Three signals, each answering different questions. Logs for the what, metrics for the trend, traces for the path.",
          estimatedMinutes: 20,
          difficulty: "intermediate",
          tags: ["observability"],
          blocks: blocks(
            ul([
              "Structured logs with request_id, user_id, and operation name.",
              "RED metrics (rate, errors, duration) per endpoint.",
              "USE metrics (utilization, saturation, errors) per resource.",
              "Distributed traces tied to request_id; sample at the edge.",
            ]),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "The ledger is the source of truth",
      summary:
        "Reconciliation is the discipline that keeps it honest.",
      details:
        "Every production financial system reconciles against an external authority (card network, blockchain, settlement file) regularly. Drift detected within hours is a ticket; drift detected after months is a postmortem.",
    },
  ],
};
