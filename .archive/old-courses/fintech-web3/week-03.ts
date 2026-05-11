import type { Week } from "@/types/content";
import { blocks, callout, code, h2, h3, p, ul } from "@/content/courses/_helpers";
export const week03: Week = {
  id: "week-03",
  number: 3,
  title: "API architecture, authentication, and webhook security",
  stage: "Foundation Layer",
  summary:
    "Move past CRUD into deliberate API design: REST resource modeling, consistent error contracts, secure session models, and bullet-proof webhook receivers.",
  objectives: [
    "Design RESTful resources whose URLs, methods, and status codes communicate intent.",
    "Implement authentication using sessions, JWTs, and OAuth correctly — knowing when each is appropriate.",
    "Build a webhook receiver that survives replay attacks and out-of-order delivery.",
    "Define a service-wide error contract that's machine-readable and human-debuggable.",
  ],
  concepts: [
    "Resource design, idempotency, etag-based optimistic concurrency",
    "Sessions, JWTs, OAuth 2.1, OIDC, refresh-token rotation",
    "HMAC signatures, replay windows, timing-safe comparisons",
    "Problem+JSON, error code taxonomies, observability hooks",
  ],
  deliverables: [
    "Versioned REST API with OpenAPI spec and machine-readable error contract.",
    "Webhook receiver with HMAC verification, replay window, and audit log.",
    "Auth service with session rotation and password hashing best practices.",
  ],
  reviewGate:
    "Could a malicious replay of yesterday's webhook be silently accepted by your service? Prove that it can't.",
  stack: ["Node.js", "Fastify/Express", "JWT", "HMAC", "Postgres"],
  modules: [
    {
      id: "w03-m1",
      title: "Webhooks done right",
      summary:
        "Webhooks are how external systems push truth. Treating them casually is how data corruption begins.",
      lessons: [
        {
          id: "w03-l1",
          slug: "webhook-receiver",
          title: "Building a bulletproof webhook receiver",
          summary:
            "Verify signatures, enforce replay windows, persist raw payloads, and process exactly once. The five rules every receiver must follow.",
          estimatedMinutes: 35,
          difficulty: "intermediate",
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
  if (Math.abs(ageMs) > replayWindowMs)
    return { ok: false, reason: "replay-window" };

  const expected = createHmac("sha256", secret)
    .update(\`\${timestamp}.\${rawBody.toString("utf8")}\`)
    .digest();
  const provided = Buffer.from(signature, "hex");
  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return { ok: false, reason: "bad-signature" };
  }
  return { ok: true };
}`,
              "A reusable verifier that uses constant-time comparison.",
            ),
            callout(
              "warning",
              "Most beginner bugs are signing the parsed body instead of the raw bytes. JSON parsers normalize whitespace; the provider signed the original byte stream.",
            ),
            h3("Idempotency"),
            p(
              "Persist a unique-key on the provider event id. Insert into an `inbox` table with a UNIQUE constraint on event_id. Catch the duplicate-key error and return 200 OK without reprocessing.",
            ),
            code(
              "sql",
              `CREATE TABLE webhook_inbox (
  event_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ
);`,
              "Inbox table for at-most-once processing.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w03-l1-1",
              level: "senior",
              category: "Webhooks",
              question:
                "A payments provider sends webhooks but does not include event ids. How do you achieve idempotency?",
              modelAnswer:
                "Synthesize a deterministic id from the payload — typically a hash of (resource_id, status, timestamp). Store the synthetic id with the raw payload. The risk is that the same logical state change can be sent multiple times with slightly different timestamps; document the tolerance and consider using a (resource_id, status) primary key with a 'last seen' timestamp to converge.",
            },
          ],
        },
        {
          id: "w03-l2",
          slug: "auth-and-sessions",
          title: "Authentication: sessions, JWTs, and OAuth",
          summary:
            "Three primitives, three appropriate uses. We unpack the trade-offs and the failure modes you must understand before issuing a credential.",
          estimatedMinutes: 35,
          difficulty: "intermediate",
          tags: ["auth", "security", "jwt", "oauth"],
          blocks: blocks(
            h2("When each tool fits"),
            ul([
              "Sessions: traditional first-party web apps where you control the server.",
              "JWTs: distributed services that need to verify tokens without a round trip — but rotation and revocation are harder.",
              "OAuth 2.1 / OIDC: third-party apps acting on behalf of users.",
            ]),
            callout(
              "tradeoff",
              "JWTs sound modern but carry a hidden cost: revocation. Use short access-token lifetimes (5–15 min) and rotate refresh tokens.",
            ),
            h3("Password hashing"),
            p(
              "Use Argon2id (or bcrypt with cost ≥ 12) and never roll your own. Pepper the hash with a server-side secret so a database leak alone is insufficient to crack credentials.",
            ),
            code(
              "typescript",
              `import { hash, verify, argon2id } from "argon2";

export const hashPassword = (pw: string) =>
  hash(pw, { type: argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 });

export const checkPassword = (digest: string, pw: string) =>
  verify(digest, pw);`,
              "Modern password hashing in five lines.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w03-l2-1",
              level: "senior",
              category: "Authentication",
              question:
                "Walk me through refresh-token rotation and why it matters.",
              modelAnswer:
                "On every refresh, issue a new access token AND a new refresh token, marking the old refresh token as used. If a used refresh token ever returns, you assume theft and revoke the entire token family. This bounds the blast radius of a stolen refresh token to roughly one token-lifetime. Without rotation, a stolen refresh token grants indefinite access.",
              followUps: [
                "How do you detect rotation reuse in a multi-region deployment?",
                "What happens if rotation races during simultaneous tab refresh?",
              ],
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w03-set-1",
      level: "intermediate",
      category: "API design",
      question:
        "What does a 422 mean and when would you return it instead of 400?",
      modelAnswer:
        "400 means the request couldn't be parsed at all (malformed JSON, missing required headers). 422 means the request was syntactically valid but semantically unprocessable (a referenced resource doesn't exist, a date range is inverted). Reserve 400 for parse failures so middleware can route them to a different log path; use 422 for business validation errors that the client can fix.",
    },
  ],
  productionInsights: [
    {
      title: "Always sign the raw body",
      summary:
        "Every webhook signature standard signs the raw bytes. Re-serialize and you'll fail verification.",
      details:
        "Capture the body as a Buffer in middleware before any JSON parsing. Pass both the raw bytes and the parsed object down the stack. Production receivers should refuse to start if the framework eagerly parses bodies in a way that loses the original bytes.",
    },
  ],
};
