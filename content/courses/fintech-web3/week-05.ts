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

export const week05: Week = {
  id: "week-05",
  number: 5,
  title: "Queues, event-driven systems, and BullMQ/Redis",
  stage: "Backend & Infrastructure",
  summary:
    "Asynchronous processing is how money moves at scale. We build the queue and event mental models that distinguish a system from a script.",
  objectives: [
    "Design queue architectures with bounded retries, dead-letter queues, and visibility timeouts.",
    "Choose between BullMQ, RabbitMQ, and Kafka with a clear rubric.",
    "Implement idempotent consumers and exactly-once-semantics where it matters.",
    "Reason about backpressure, fan-out, and consumer scaling.",
  ],
  concepts: [
    "At-most-once vs at-least-once vs exactly-once",
    "Visibility timeouts and message claim",
    "Dead-letter queues and poison messages",
    "Outbox pattern, change-data-capture",
    "BullMQ priorities, RabbitMQ exchanges, Kafka partitions",
  ],
  deliverables: [
    "BullMQ-based payout worker with retries, DLQ, and circuit breakers.",
    "Outbox table + worker that publishes domain events transactionally.",
    "Architecture decision record comparing queue choices for your team.",
  ],
  reviewGate:
    "When your queue worker dies mid-job, can you prove no money state has been lost or duplicated?",
  stack: ["Redis", "BullMQ", "RabbitMQ", "Kafka", "Postgres"],
  modules: [
    {
      id: "w05-m1",
      title: "Queue architecture",
      summary: "Why every reliable backend eventually grows a queue.",
      lessons: [
        {
          id: "w05-l1",
          slug: "queue-fundamentals",
          title: "Queue fundamentals: delivery, retries, and DLQs",
          summary:
            "The vocabulary you'll use forever: delivery semantics, visibility timeouts, retries, dead-letter queues, and the outbox pattern.",
          estimatedMinutes: 35,
          difficulty: "intermediate",
          tags: ["queues", "redis", "bullmq", "events"],
          blocks: blocks(
            h2("Three delivery semantics"),
            ul([
              "At-most-once: send and forget. Cheap; loses messages on failure.",
              "At-least-once: ack on success, redeliver on failure. Default for most systems. Requires idempotent consumers.",
              "Exactly-once: a marketing term. Achievable end-to-end only with idempotency + transactional commits.",
            ]),
            diagram(
              `┌──────────┐  enqueue  ┌────────┐  pop   ┌───────────┐
│ Producer │──────────▶│ Queue  │──────▶│ Consumer  │
└──────────┘           └────────┘       └───────────┘
                          │  ack/nack         │
                          │◀──────────────────┘
                          │
                  visibility timeout
                          │
                          ▼
                   redeliver if not acked`,
              "Generic queue mechanics",
            ),
            h3("The outbox pattern"),
            p(
              "Never publish a message in the same transaction that mutates your database — they aren't atomic. Instead, write the event into an `outbox` table within the transaction, then a separate worker reads from the outbox and publishes. If publishing fails, the message stays in the outbox and is retried.",
            ),
            code(
              "sql",
              `CREATE TABLE outbox (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  key TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);
CREATE INDEX outbox_unpublished ON outbox (created_at)
  WHERE published_at IS NULL;`,
              "Outbox table — the bridge between DB transactions and message bus.",
            ),
            callout(
              "insight",
              "The outbox + idempotency key pattern is how you build practically-exactly-once delivery on top of at-least-once primitives.",
            ),
          ),
          exercises: [
            {
              id: "w05-l1-e1",
              title: "Build an outbox publisher",
              difficulty: "intermediate",
              prompt:
                "Implement a small worker that polls the outbox, publishes to BullMQ, and marks rows as published. Handle crash recovery and duplicate publishes.",
              acceptanceCriteria: [
                "Poller is bounded by FOR UPDATE SKIP LOCKED so multiple workers don't double-publish.",
                "Failed publishes do not mark the row as published.",
                "Idempotency key is derived deterministically from the outbox row id.",
              ],
            },
          ],
          interviewQuestions: [
            {
              id: "iv-w05-l1-1",
              level: "senior",
              category: "Distributed systems",
              question:
                "When does a dead-letter queue actually save you, and when does it just hide problems?",
              modelAnswer:
                "A DLQ saves you when a single poison message would otherwise block the whole queue (e.g. a malformed event your code can't parse). It becomes a problem when you don't alert on DLQ depth and silently lose business events. Best practice: every DLQ has a documented owner, an alert at depth > 0, and a replay tool with idempotency. A DLQ without a replay path is a graveyard.",
            },
          ],
        },
        {
          id: "w05-l2",
          slug: "bullmq-patterns",
          title: "BullMQ patterns for fintech workloads",
          summary:
            "BullMQ is fast, Redis-backed, and pleasant to operate. We use it as the case study for queue patterns that translate everywhere.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["bullmq", "redis"],
          blocks: blocks(
            h2("Idempotent consumers"),
            code(
              "typescript",
              `import { Worker } from "bullmq";

const worker = new Worker(
  "payouts",
  async (job) => {
    // jobId carries the idempotency key; insert into a dedupe table first
    const inserted = await db.insertOnce("processed_jobs", { id: job.id });
    if (!inserted) return; // already done
    return processPayout(job.data);
  },
  { connection, concurrency: 16, lockDuration: 60_000 }
);

worker.on("failed", (job, err) => log.error({ err, jobId: job?.id }));`,
              "Idempotent consumer with concurrency and lock duration.",
            ),
            callout(
              "production",
              "Tune lockDuration to be > 2× your job's p99. If your job p99 is 12 seconds, set lockDuration ≥ 30 seconds. Otherwise the queue redelivers under load and you double-process.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w05-l2-1",
              level: "intermediate",
              category: "Queues",
              question: "What's the difference between BullMQ, RabbitMQ, and Kafka?",
              modelAnswer:
                "BullMQ: simple Redis-backed job queue, great for in-team workflows up to ~10k jobs/sec, weak ordering guarantees. RabbitMQ: AMQP broker with rich routing (topic/direct/fanout exchanges), strong message-level acknowledgments, modest throughput. Kafka: distributed log with strong ordering per partition, designed for very high throughput (millions/sec) and replayable streams. Choose BullMQ for jobs, RabbitMQ for routed work, Kafka for streams of events.",
              tradeoffs: [
                "Kafka's operational cost is high — choose it when you genuinely need replay or partitioned ordering.",
                "BullMQ's reliance on Redis means a single Redis cluster outage stops all jobs.",
              ],
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w05-set-1",
      level: "senior",
      category: "Event-driven systems",
      question:
        "How do you guarantee an event is published exactly once when the database write and the message publish happen in different systems?",
      modelAnswer:
        "End-to-end exactly-once is achievable only with the outbox + idempotent consumer pattern, or with a CDC system like Debezium reading the WAL. The DB transaction writes both your business state and the outbox row atomically; a separate worker publishes from the outbox. The consumer dedupes on a stable id. The label 'exactly-once' is achieved by combining at-least-once delivery with a deterministic idempotency contract.",
    },
  ],
  productionInsights: [
    {
      title: "Bound your retries",
      summary:
        "Unbounded retries are the most common cause of cascading failures.",
      details:
        "Set max-attempts AND max-age. A job that's been retried for 24 hours is no longer recoverable; it's noise. Move it to the DLQ and alert. Pair this with circuit breakers on downstream calls so retry storms can't take down the providers you depend on.",
    },
  ],
};
