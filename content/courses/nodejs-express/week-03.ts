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
  title: "Webhooks, idempotency, and observability",
  stage: "Operations",
  summary:
    "The patterns that make a Node service operable: signed webhooks, idempotency keys, structured logging, graceful shutdown.",
  objectives: [
    "Implement HMAC webhook verification with timing-safe comparison.",
    "Persist raw payloads and enforce idempotency by event id.",
    "Add structured logging with request IDs propagated end to end.",
    "Handle SIGTERM gracefully so deploys never drop in-flight requests.",
  ],
  concepts: [
    "HMAC signing, replay windows, raw body capture",
    "Idempotency keys, inbox tables, dedupe",
    "Structured logging with pino",
    "Graceful shutdown, drain timeouts",
  ],
  deliverables: [
    "Webhook receiver with all five rules satisfied (verify-then-parse, replay window, raw body, persist, idempotent).",
    "pino logger with request IDs and base context.",
    "Graceful shutdown handler with health/readiness probes.",
  ],
  reviewGate:
    "Could a malicious replay of yesterday's webhook be silently accepted by your service? Prove that it can't.",
  stack: ["Express", "Pino", "Redis"],
  modules: [
    {
      id: "node-w03-m1",
      title: "Production operations",
      summary: "What separates a working service from an operable one.",
      progression: "advanced",
      lessons: [
        {
          id: "node-w03-l1",
          slug: "webhook-receiver",
          title: "Building a bulletproof webhook receiver",
          summary:
            "Verify signatures, enforce replay windows, persist raw payloads, and process exactly once.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["webhooks", "security", "idempotency"],
          blocks: blocks(
            h2("The five rules"),
            ul([
              "Verify the signature before parsing the body.",
              "Use a timing-safe comparison.",
              "Enforce a replay window (typically 5 minutes).",
              "Persist the raw payload before acking.",
              "Process idempotently — keyed by the provider event id.",
            ]),
            code(
              "typescript",
              `import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyWebhook(
  rawBody: Buffer,
  signature: string,
  timestamp: string,
  secret: string,
  replayWindowMs = 5 * 60_000,
): { ok: true } | { ok: false; reason: string } {
  const ageMs = Date.now() - Number(timestamp) * 1000;
  if (Number.isNaN(ageMs)) return { ok: false, reason: "bad-timestamp" };
  if (Math.abs(ageMs) > replayWindowMs) return { ok: false, reason: "replay" };

  const expected = createHmac("sha256", secret)
    .update(\`\${timestamp}.\${rawBody.toString("utf8")}\`)
    .digest();
  const provided = Buffer.from(signature, "hex");
  return expected.length === provided.length &&
    timingSafeEqual(expected, provided)
    ? { ok: true }
    : { ok: false, reason: "bad-signature" };
}`,
              "A reusable verifier with constant-time comparison.",
            ),
            callout(
              "warning",
              "Most beginner bugs are signing the parsed body instead of the raw bytes. JSON parsers normalize whitespace; the provider signed the original byte stream.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-node-w03-l1-1",
              level: "senior",
              category: "Webhooks",
              question:
                "A payments provider sends webhooks but doesn't include event ids. How do you achieve idempotency?",
              modelAnswer:
                "Synthesize a deterministic id from the payload — typically a hash of (resource_id, status, timestamp). Store the synthetic id with the raw payload. Document the tolerance window because the same logical state change can be sent multiple times with slightly different timestamps; consider (resource_id, status) as primary key with a 'last seen' timestamp to converge.",
            },
          ],
        },
        {
          id: "node-w03-l2",
          slug: "graceful-shutdown",
          title: "Graceful shutdown",
          summary:
            "On SIGTERM, stop accepting new requests, drain in-flight ones, then exit. Five lines that prevent a class of deploy bugs.",
          estimatedMinutes: 20,
          difficulty: "intermediate",
          tags: ["operations", "shutdown"],
          blocks: blocks(
            code(
              "typescript",
              `import { createServer } from "node:http";

const server = createServer(app);
server.listen(3000);

const shutdown = (sig: string) => {
  log.info({ sig }, "shutting down");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref(); // hard timeout
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));`,
              "Graceful shutdown with a hard cutoff.",
            ),
            callout(
              "production",
              "Pair SIGTERM handling with a /health/ready endpoint that returns 503 once shutdown begins. Your load balancer will stop sending new requests immediately, while in-flight ones drain.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Request IDs propagate or you debug blind",
      summary:
        "Generate at the edge, propagate via header, log everywhere.",
      details:
        "When something goes wrong, the request ID is how you correlate logs across services. Make it default in your express middleware and include it in every log line, every external call, and every error response.",
    },
  ],
};
