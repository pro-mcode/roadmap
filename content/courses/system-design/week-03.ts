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

export const week03: Week = {
  id: "week-03",
  number: 3,
  title: "Messaging, queues, and infrastructure",
  stage: "Infrastructure",
  summary:
    "Kafka, RabbitMQ, BullMQ. CDNs, reverse proxies, load balancers. Redis as cache and as primitive. The infrastructure that turns services into systems.",
  objectives: [
    "Choose between Kafka, RabbitMQ, and BullMQ by access pattern.",
    "Design retry policies with exponential backoff and dead-letter queues.",
    "Place CDN, reverse proxy, and load balancer correctly.",
    "Use Redis as cache, as queue, and as a distributed lock — knowing when each is wrong.",
  ],
  concepts: [
    "Kafka log model, partitions, consumer groups",
    "RabbitMQ exchanges, routing keys, ack semantics",
    "BullMQ job queues, repeatable jobs",
    "DLQs, retries, idempotent consumers",
    "CDN, reverse proxy, L4 vs L7 LB",
    "Redis: caching, queues, locks",
  ],
  deliverables: [
    "Decision matrix: Kafka vs RabbitMQ vs BullMQ for three concrete scenarios.",
    "Idempotent consumer skeleton with DLQ and replay.",
  ],
  reviewGate:
    "Your queue consumer crashes mid-processing. Walk me through what happens to that message.",
  stack: ["Kafka", "RabbitMQ", "BullMQ", "Redis"],
  modules: [
    {
      id: "sd-w03-m1",
      title: "Messaging in production",
      summary: "Choosing the right queue is half the design.",
      progression: "core",
      lessons: [
        {
          id: "sd-w03-l1",
          slug: "kafka-vs-rabbit-vs-bull",
          title: "Kafka vs RabbitMQ vs BullMQ",
          summary:
            "Three queues, three different mental models. Use Kafka for log-shaped data, RabbitMQ for routing-shaped work, BullMQ for jobs you own end-to-end.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["queues"],
          blocks: blocks(
            ul([
              "Kafka: append-only log, partitions for parallelism, consumer groups for fan-out. Replay is native.",
              "RabbitMQ: broker with exchanges and routing keys; great for complex routing topologies.",
              "BullMQ: Redis-backed job queue; great for in-app background jobs with rich retry semantics.",
            ]),
            callout(
              "tip",
              "When in doubt: use Kafka if you'll ever need to replay; RabbitMQ if you have complex routing; BullMQ for repeatable jobs your service owns.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-sd-w03-l1-1",
              level: "senior",
              category: "Messaging",
              question:
                "How do you guarantee exactly-once processing of a Kafka message?",
              modelAnswer:
                "Strictly, you don't — you guarantee effectively-once via idempotent consumers. Persist the consumed (topic, partition, offset) tuple alongside the side effects in the same DB transaction. On replay, the unique constraint short-circuits the second execution. Combined with manual commit-after-DB-commit, you get effectively-once semantics.",
            },
          ],
        },
        {
          id: "sd-w03-l2",
          slug: "dlq-and-retries",
          title: "DLQs and retry policies",
          summary:
            "Exponential backoff, max attempts, then DLQ. Replay tooling so the DLQ doesn't become the graveyard.",
          estimatedMinutes: 20,
          difficulty: "intermediate",
          tags: ["retry", "dlq"],
          blocks: blocks(
            ul([
              "Exponential backoff with jitter: 1s, 2s, 4s, 8s + jitter.",
              "Cap max attempts (typically 5-7) before DLQ.",
              "DLQ messages must include the original headers + the failure context.",
              "Build a tool to replay DLQ items selectively — DLQs without replay are write-only logs.",
            ]),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Redis is a Swiss-army knife you should use carefully",
      summary:
        "It's a cache, a queue, a lock service, a pub/sub bus. None of these are durable by default.",
      details:
        "Redis is brilliant when you understand its durability story. Pick AOF persistence, configure fsync deliberately, and never use it as the primary store for anything you can't reconstruct.",
    },
  ],
};
