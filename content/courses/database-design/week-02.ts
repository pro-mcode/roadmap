import type { Week } from "@/types/content";
import {
  blocks,
  callout,
  code,
  h2,
  h3,
  p,
  ul,
} from "@/content/courses/_helpers";

export const week02: Week = {
  id: "week-02",
  number: 2,
  title: "Transactions, isolation, and NoSQL trade-offs",
  stage: "Applied",
  summary:
    "Transactions in depth, isolation levels by what they allow, and when NoSQL is the right answer instead of more SQL.",
  objectives: [
    "Choose isolation levels by the anomalies they tolerate.",
    "Use SELECT ... FOR UPDATE and advisory locks correctly.",
    "Recognize when DynamoDB, MongoDB, or Cassandra are the better fit.",
    "Design partition / sort keys for an access-pattern-driven schema.",
  ],
  concepts: [
    "Read committed, repeatable read, serializable",
    "Lost update, write skew, phantom reads",
    "Single-table design in DynamoDB",
    "Document model trade-offs in MongoDB",
    "Wide-column model in Cassandra",
  ],
  deliverables: [
    "Wallet service in Postgres that withstands a concurrency test.",
    "DynamoDB single-table design for an event-sourced API.",
  ],
  reviewGate:
    "Which SQL isolation level prevents write skew, and what does it cost you?",
  stack: ["Postgres", "DynamoDB", "MongoDB"],
  modules: [
    {
      id: "db-w02-m1",
      title: "Transactions in production",
      summary: "What isolation gives you and what it doesn't.",
      progression: "advanced",
      lessons: [
        {
          id: "db-w02-l1",
          slug: "isolation-by-anomaly",
          title: "Isolation levels by the anomalies they allow",
          summary:
            "Stop memorizing names. Memorize anomalies and what each level prevents.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["transactions", "isolation"],
          blocks: blocks(
            ul([
              "Read committed: prevents dirty reads. Allows non-repeatable reads, phantom reads, write skew.",
              "Repeatable read (Postgres): snapshot-based. Prevents non-repeatable reads. Still allows write skew.",
              "Serializable (Postgres SSI): prevents everything; aborts conflicting transactions with serialization_failure. Retry-loop required.",
            ]),
            code(
              "sql",
              `BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- ... your reads + writes ...
COMMIT;`,
              "Serializable wraps your txn — be prepared to retry on serialization_failure.",
            ),
          ),
        },
        {
          id: "db-w02-l2",
          slug: "nosql-when-and-why",
          title: "NoSQL: when and why",
          summary:
            "NoSQL stores reward access-pattern-first thinking. They punish schema-last thinking.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["nosql", "dynamodb"],
          blocks: blocks(
            p(
              "DynamoDB single-table design pre-computes joins by encoding multiple entity types into one table, partitioned by a composite key. The cost: you must know every access pattern up front. The gain: O(1) reads at any scale.",
            ),
            callout(
              "insight",
              "Pick SQL when you don't know your access patterns. Pick NoSQL when you do — and when you need scale-out without operational overhead.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-db-w02-l2-1",
              level: "senior",
              category: "NoSQL",
              question:
                "When would you choose DynamoDB over Postgres for a new fintech service?",
              modelAnswer:
                "When access patterns are known, predictable, and high-throughput; when you want serverless scale-out and bounded latency without operational tuning; when the data is naturally partitionable by tenant or account. Pick Postgres if you expect ad-hoc analytical queries, complex joins, or evolving access patterns.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Idempotency belongs at the database",
      summary:
        "Unique constraints on idempotency_key are stronger than application checks.",
      details:
        "A `UNIQUE(idempotency_key)` constraint converts duplicate POSTs into clean 23505 errors you can map to 200 OK on the second call. No locks, no race conditions.",
    },
  ],
};
