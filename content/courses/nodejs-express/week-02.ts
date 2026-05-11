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
  title: "Express at production quality",
  stage: "Framework",
  summary:
    "Middleware design, error contracts, validation, and the patterns that keep request handlers honest.",
  objectives: [
    "Design middleware stacks with explicit ordering and error contracts.",
    "Validate every request at the edge with Zod.",
    "Build a typed error taxonomy and a Problem+JSON response shape.",
    "Capture raw bodies for webhook signature verification.",
  ],
  concepts: [
    "Middleware ordering, async handler patterns",
    "Request validation (Zod) at the boundary",
    "Error taxonomy: 4xx vs 5xx, retriable vs not",
    "Problem+JSON, idempotency keys",
    "Raw body capture for signed requests",
  ],
  deliverables: [
    "Express skeleton with typed routes and Zod validation.",
    "Centralized error handler that returns Problem+JSON.",
    "Idempotency-Key middleware backed by Redis.",
  ],
  reviewGate:
    "Could a teammate hand off your Express service without a single Slack message?",
  stack: ["Express", "Zod", "Pino", "Redis"],
  modules: [
    {
      id: "node-w02-m1",
      title: "Express, the right way",
      summary: "Patterns and contracts that make Express services predictable.",
      progression: "core",
      lessons: [
        {
          id: "node-w02-l1",
          slug: "typed-routes-with-zod",
          title: "Typed routes with Zod validation",
          summary:
            "Stop trusting req.body. Validate every input at the boundary, then let TypeScript enforce the shape downstream.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["express", "zod", "validation"],
          blocks: blocks(
            code(
              "typescript",
              `import { z } from "zod";
import { Router } from "express";

const Body = z.object({
  amount: z.number().int().positive(),
  currency: z.enum(["USD", "EUR", "NGN"]),
  idempotencyKey: z.string().uuid(),
});
type Body = z.infer<typeof Body>;

export const router = Router();
router.post("/transfer", async (req, res, next) => {
  try {
    const body: Body = Body.parse(req.body);
    const result = await transfer(body);
    res.status(202).json(result);
  } catch (err) {
    next(err);
  }
});`,
              "A typed Express handler with edge validation.",
            ),
            callout(
              "tip",
              "Wrap this pattern in a tiny `route(schema, handler)` helper that does Zod parsing and try/catch for you. Saves boilerplate and standardizes error shape.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-node-w02-l1-1",
              level: "intermediate",
              category: "API design",
              question:
                "What's the difference between 400 and 422?",
              modelAnswer:
                "400 means the request couldn't be parsed at all (malformed JSON, missing required headers). 422 means the request was syntactically valid but semantically unprocessable (a referenced resource doesn't exist, a date range is inverted). Reserve 400 for parse failures so middleware can route them to a different log path; use 422 for business validation errors the client can fix.",
            },
          ],
        },
        {
          id: "node-w02-l2",
          slug: "error-taxonomy",
          title: "Error taxonomy and Problem+JSON",
          summary:
            "A central error class hierarchy and a single response shape downstream consumers can rely on.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["errors", "problem-json"],
          blocks: blocks(
            code(
              "typescript",
              `export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}
export class NotFound extends HttpError { constructor(msg = "not found") { super(404, "not_found", msg); } }
export class Conflict extends HttpError { constructor(msg = "conflict") { super(409, "conflict", msg); } }
export class Unprocessable extends HttpError { constructor(details: unknown) { super(422, "unprocessable", "validation failed", details); } }`,
              "A small typed error hierarchy.",
            ),
            code(
              "typescript",
              `// Centralized error handler
app.use((err: Error, req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).type("application/problem+json").json({
      type: \`/errors/\${err.code}\`,
      title: err.message,
      status: err.status,
      detail: err.details,
      instance: req.id,
    });
  }
  log.error({ err, requestId: req.id }, "unhandled");
  return res.status(500).type("application/problem+json").json({
    type: "/errors/internal",
    title: "internal server error",
    status: 500,
    instance: req.id,
  });
});`,
              "Problem+JSON response shape with request-id correlation.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Validate at the edge, trust internally",
      summary:
        "Inside your service, types are king. At the HTTP boundary, you must runtime-validate.",
      details:
        "Once a request crosses Zod parsing, downstream code can rely on the type. Push validation to the edge so internal handlers stay clean and unforgiving.",
    },
  ],
};
