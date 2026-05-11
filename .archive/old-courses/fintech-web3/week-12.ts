import type { Week } from "@/types/content";
import { blocks, callout, h2, h3, p, ul } from "@/content/courses/_helpers";
export const week12: Week = {
  id: "week-12",
  number: 12,
  title: "Capstone: end-to-end production review and senior interviews",
  stage: "Final Layer",
  summary:
    "Put it all together: a real-world capstone, a production architecture review, and the senior-level interview drill.",
  objectives: [
    "Ship the capstone: a payment-and-ledger system with on-chain settlement.",
    "Conduct a production architecture review of your own system.",
    "Run a full mock interview loop covering coding, system design, and behavior.",
    "Build a portfolio narrative around what you've engineered.",
  ],
  concepts: [
    "Architecture review checklist",
    "Mock interview drills",
    "Portfolio framing",
    "Decision logs and ADRs",
  ],
  deliverables: [
    "Capstone repo with full README, architecture diagram, runbook, and tests.",
    "ADR set documenting every major design decision.",
    "Recorded mock interview reflection with action items.",
  ],
  reviewGate:
    "Could a senior engineer pick up your capstone repo and ship a feature in 48 hours without messaging you?",
  stack: ["Everything", "End-to-end"],
  modules: [
    {
      id: "w12-m1",
      title: "Capstone and beyond",
      summary: "The week where you stop learning and start shipping.",
      lessons: [
        {
          id: "w12-l1",
          slug: "capstone-spec",
          title: "Capstone specification",
          summary:
            "Build a full fintech + web3 system end-to-end. The spec is opinionated — that's the point.",
          estimatedMinutes: 45,
          difficulty: "senior",
          tags: ["capstone", "production"],
          blocks: blocks(
            h2("System: 'Bridge'"),
            p(
              "Bridge is a fintech that lets users top up a stablecoin wallet from a fiat card payment, then withdraw to a bank account. Off-chain ledger, on-chain custody, full reconciliation across rails. The system you'll defend in interviews.",
            ),
            ul([
              "TypeScript backend with Postgres ledger and BullMQ job queue.",
              "Go service for high-throughput webhook ingestion.",
              "Solidity custody contract with role-based access and emergency pause.",
              "Next.js operator dashboard with progress + treasury views.",
              "Full test pyramid: unit, integration, end-to-end including a forked-mainnet test.",
            ]),
            h3("Required artifacts"),
            ul([
              "Architecture diagram (the kind you'd defend in front of a board).",
              "ADR for every major decision (stack, queue, ledger model, oracle).",
              "Runbook with on-call playbooks for each top failure mode.",
              "Capacity model with envelope numbers and headroom.",
              "Threat model that names attackers and what stops each.",
            ]),
            callout(
              "production",
              "If your README starts with 'just run npm install', you haven't finished. Real engineering writeups document the why.",
            ),
          ),
        },
        {
          id: "w12-l2",
          slug: "interview-loop",
          title: "Senior interview loop drill",
          summary:
            "A repeatable practice routine for the full interview loop: coding, system design, behavioral, take-home.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["interviews", "career"],
          blocks: blocks(
            h2("The drill"),
            p(
              "Spend a week running each round on yourself. Record. Watch back. Adjust.",
            ),
            ul([
              "Coding: pick a queue/ledger/payments problem, run it for 45 minutes against a friend, narrate every decision.",
              "System design: use the 7-step template; force yourself to write numbers on the whiteboard.",
              "Behavioral: prepare 6 STAR stories that cover technical leadership, conflict, failure, ownership, mentorship, ambiguity.",
              "Take-home: timebox to 6 hours with a written README; treat it like a tiny capstone.",
            ]),
            callout(
              "tip",
              "The biggest interview gap for senior engineers is talking. Practice narrating tradeoffs out loud. Silent thinking reads as confusion.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w12-l2-1",
              level: "staff",
              category: "Behavioral",
              question:
                "Tell me about a system you owned that failed in production.",
              modelAnswer:
                "Use STAR with technical depth: Situation (what was the system, what was at stake), Task (what was your responsibility), Action (what you actually did, including the bad calls), Result (what was the outcome, what you learned, what you changed structurally afterwards). The strongest signal is owning the failure without scapegoating, and showing that the lesson became a guardrail (alert, runbook, test) — not just a feeling.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w12-set-1",
      level: "staff",
      category: "Architecture review",
      question:
        "Walk me through a production architecture review checklist you'd apply to any service.",
      modelAnswer:
        "Reliability: SLOs, error budget, rollback readiness, runbooks. Security: authn/authz model, secret management, network boundaries, threat model. Data: durability guarantees, backup/restore drills, retention policy. Operability: dashboards, alerts, structured logs, traces. Capacity: headroom, scaling plan, load tests, dependency budgets. Cost: per-request cost, idle waste, scaling triggers. Evolution: deprecation plan for everything, migration playbooks. The goal isn't to bless a system as 'good'; it's to surface every place a future on-call engineer will hate you.",
    },
  ],
  productionInsights: [
    {
      title: "Build for the engineer who replaces you",
      summary:
        "Everything you write is read more than you'd expect. Optimize for the next person.",
      details:
        "Comments explain intent (the why), tests document contracts, ADRs preserve context. The system you can hand off in two weeks without a whiteboard session is the system that lets your team scale beyond you.",
    },
  ],
};
