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

export const week07: Week = {
  id: "week-07",
  number: 7,
  title: "Advanced fintech: settlement, payouts, treasury, and routing",
  stage: "Fintech Systems",
  summary:
    "Beyond the happy-path payment is a world of fiat rails, payout networks, treasury operations, and routing engines. Senior fintech engineering lives here.",
  objectives: [
    "Map the global fiat rails and the latency/cost trade-offs of each.",
    "Build a routing engine that selects payment processors per transaction.",
    "Design a treasury system that keeps the right balances in the right accounts.",
    "Implement netting, settlement, and liquidity rebalancing logic.",
  ],
  concepts: [
    "ACH, SEPA, Wire, Faster Payments, RTP, card networks, stablecoins",
    "Routing engines, fallbacks, fee optimization",
    "Internal netting, multilateral settlement",
    "Treasury accounts, float management, FX hedging",
    "Compliance: KYC/KYB, AML, sanctions screening",
  ],
  deliverables: [
    "Routing engine that scores payment options per transaction.",
    "Treasury dashboard showing all account balances by currency.",
    "Settlement reconciliation across multiple processors.",
  ],
  reviewGate:
    "Could you cut over to a backup payment processor for 30% of traffic without engineering work?",
  stack: ["PostgreSQL", "TypeScript", "Multiple PSPs"],
  modules: [
    {
      id: "w07-m1",
      title: "Routing and treasury",
      summary:
        "The behind-the-scenes engineering that makes fintech profitable.",
      lessons: [
        {
          id: "w07-l1",
          slug: "payment-routing",
          title: "Building a payment routing engine",
          summary:
            "Choose the right processor per transaction. The difference between a 0.3% and 0.5% fee at $1B/year is $2M.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["routing", "fees", "fallbacks"],
          blocks: blocks(
            h2("Why route at all?"),
            ul([
              "Fee optimization — different processors have different rates per card type, region, and ticket size.",
              "Reliability — when one processor's authorization rate drops, route around them.",
              "Compliance — some processors only support certain countries or merchant categories.",
              "Cash flow — route based on settlement timing and float.",
            ]),
            h3("Scoring"),
            p(
              "A router computes a score per (processor, transaction) tuple from features: fee, current uptime, historical authorization rate for this card BIN, regulatory eligibility. The highest score wins, ties broken by ordered preference. The router writes its decision to an audit log.",
            ),
            code(
              "typescript",
              `interface RouteContext {
  amount: number;
  currency: string;
  cardBin: string;
  countryCode: string;
}

interface RouteScore {
  processor: string;
  score: number;
  reasons: string[];
}

export function score(ctx: RouteContext, p: Processor, m: ProcessorMetrics): RouteScore {
  let s = 100;
  const reasons: string[] = [];

  // fee component (lower is better)
  s -= p.feeRateFor(ctx.cardBin) * 100;

  // reliability
  if (m.authRate7d < 0.95) { s -= 30; reasons.push("low-auth-rate"); }
  if (m.uptime1h < 0.99)   { s -= 50; reasons.push("processor-degraded"); }

  // eligibility
  if (!p.supportsCountry(ctx.countryCode)) return { processor: p.id, score: -Infinity, reasons: ["ineligible"] };

  return { processor: p.id, score: s, reasons };
}`,
              "A composable scoring function with explicit reasons.",
            ),
            callout(
              "production",
              "The audit log is non-negotiable. When the finance team asks 'why was this transaction routed to processor B?', the answer must be recoverable from data, not memory.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w07-l1-1",
              level: "senior",
              category: "Routing",
              question:
                "Your routing engine starts producing strange decisions in production. How do you debug?",
              modelAnswer:
                "First, confirm the audit log is intact — every decision should be reproducible from a (context, score, reasons) tuple. Replay the contexts through a frozen version of the scoring function and diff. If diffs exist, check whether processor metrics drifted (auth rate dropped) or eligibility tables changed (sanction list update). Add canary monitoring: scoring shadows the real router and any divergence > X% alerts. Never deploy a new scoring function without a shadow period.",
            },
          ],
        },
        {
          id: "w07-l2",
          slug: "treasury-and-netting",
          title: "Treasury operations and internal netting",
          summary:
            "How to keep enough money in each account to operate, without holding more than you need.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["treasury", "netting", "liquidity"],
          blocks: blocks(
            h2("Float, sweeps, and netting"),
            p(
              "A fintech operates dozens of accounts: one per currency, one per processor, one per regulated entity. Funds drift between them as customers pay in and out. Treasury automation rebalances these accounts on a schedule, sweeping excess to a master account and pulling funds when an operating account drops below threshold.",
            ),
            h3("Multilateral netting"),
            p(
              "If three internal entities owe each other various amounts, settling all of them individually is expensive. Net them: each entity has a single net position, and only those positions move on the rails. This reduces settlement cost and limits the time funds are 'in flight'.",
            ),
            diagram(
              `Without netting:
   A ──$100──▶ B ──$80──▶ C ──$60──▶ A      (3 transfers, $240 moved)

With netting:
   A net ‒$40        B net +$20        C net +$20
   A ──$40──▶ pool ──$20──▶ B
                   ──$20──▶ C            (3 transfers, $80 moved)`,
              "Bilateral vs multilateral settlement",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w07-l2-1",
              level: "senior",
              category: "Treasury",
              question:
                "How do you decide how much float to keep in a payout operating account?",
              modelAnswer:
                "Forecast next-day payout demand from historical data with a safety buffer (typically 1.5×–2× p99 daily volume). Keep enough float to cover that, plus the inbound funding lag (e.g. ACH is T+1). Anything above is excess and should be swept to a yield-bearing account or master treasury. Build a daily report: starting balance, payouts, sweeps, ending balance — the variance from forecast tells you if your model is drifting.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w07-set-1",
      level: "senior",
      category: "Compliance",
      question:
        "Walk me through how you'd integrate a sanctions screening provider without creating a single point of failure.",
      modelAnswer:
        "Sanctions checks must be run before money moves and the result must be auditable. Store the provider's response (with version) alongside the transaction. Fall back to a cached snapshot of the provider's list with a stale-time alert; never silently skip the check. If the provider is down for longer than your SLA allows, the system should refuse new payouts and alert ops, not approve blindly. Always document the regulatory rationale for the design.",
    },
  ],
  productionInsights: [
    {
      title: "Treat the audit log as the user",
      summary:
        "Every routing, treasury, and compliance decision must be reconstructable months later.",
      details:
        "When a regulator asks why a transaction was processed in a specific way, you need data, not opinion. Append-only audit logs with stable event ids let you replay decisions and prove your system behaved correctly even when memory and on-call engineers have moved on.",
    },
  ],
};
