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

export const week01: Week = {
  id: "week-01",
  number: 1,
  title: "Foundations: scalability, latency, CAP",
  stage: "Foundations",
  summary:
    "The first-principles vocabulary every system design conversation uses. Scalability, latency vs throughput, CAP and its honest reading.",
  objectives: [
    "Distinguish vertical vs horizontal scaling and stateful vs stateless services.",
    "Reason about latency and throughput independently.",
    "State CAP correctly — it's about partition behavior, not arbitrary choice.",
    "Use back-of-envelope numbers fluently.",
  ],
  concepts: [
    "Vertical vs horizontal scaling",
    "Latency vs throughput",
    "CAP theorem (and PACELC)",
    "Capacity modeling: napkin math",
  ],
  deliverables: [
    "Napkin-math worksheet (RPS, p99, storage growth) for a familiar service.",
  ],
  reviewGate:
    "State CAP in one sentence that distinguishes you from someone who memorized it.",
  stack: ["Whiteboard / Miro / docs"],
  modules: [
    {
      id: "sd-w01-m1",
      title: "What is system design",
      summary: "The discipline of making explicit trade-offs.",
      progression: "foundation",
      lessons: [
        {
          id: "sd-w01-l1",
          slug: "scalability-basics",
          title: "Scalability, the honest version",
          summary:
            "Horizontal scaling is the default, but stateful workloads make it expensive. Recognize the cost.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["scalability"],
          blocks: blocks(
            ul([
              "Stateless services scale out trivially.",
              "Stateful services (DBs, queues, caches) scale out via partitioning + replication, which buys you complexity.",
              "Sharding moves the routing problem upstream.",
              "Read replicas trade strong consistency for read scale-out.",
            ]),
          ),
        },
        {
          id: "sd-w01-l2",
          slug: "cap-theorem",
          title: "CAP, stated correctly",
          summary:
            "CAP is about behavior under a network partition — not a daily lifestyle choice.",
          estimatedMinutes: 20,
          difficulty: "senior",
          tags: ["cap", "distributed"],
          blocks: blocks(
            p(
              "When a partition occurs, you must choose between continuing to serve (and risk inconsistency) or refusing to serve (preserving consistency). Most systems are AP. Fintech and ledger systems are usually CP under partition.",
            ),
            callout(
              "insight",
              "PACELC is the more useful framing: if Partition, choose A or C; Else (no partition), choose Latency or Consistency.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-sd-w01-l2-1",
              level: "senior",
              category: "Distributed",
              question:
                "Is Postgres CP or AP? What about DynamoDB?",
              modelAnswer:
                "Single-leader Postgres is CP under partition — the follower can't accept writes. DynamoDB is configurable per-request: strongly consistent reads are CP, eventually consistent reads are AP. The 'choice' is a per-request property, not a global one.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Always write down the numbers",
      summary:
        "Napkin math turns hand-waving designs into defensible ones.",
      details:
        "RPS, p99 budget, payload size, storage growth, daily write volume — five numbers that make any design concrete. Senior designers reach for them automatically.",
    },
  ],
};
