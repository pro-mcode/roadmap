import type { Week } from "@/types/content";
import { blocks, callout, code, diagram, h2, h3, p } from "@/content/courses/_helpers";
export const week02: Week = {
  id: "week-02",
  number: 2,
  title: "TypeScript & async systems mastery",
  stage: "Foundation Layer",
  summary:
    "Modern fintech is mostly TypeScript at the edge. We move past tutorial syntax into the type-system patterns and async-control idioms that distinguish a senior runtime engineer.",
  objectives: [
    "Use the type system to encode invariants instead of writing runtime checks.",
    "Understand the event loop, microtasks, and the cost of awaiting in tight loops.",
    "Build robust async control flows: timeouts, cancellation, structured concurrency.",
    "Write production-quality libraries with conditional, mapped, and template-literal types.",
  ],
  concepts: [
    "Discriminated unions, exhaustive switches",
    "Branded types, opaque types, nominal typing",
    "Conditional and mapped types",
    "Event loop, microtask queue, AbortController",
    "Promise pools, p-limit, structured cancellation",
  ],
  deliverables: [
    "A typed money library that rejects mixed currencies at compile time.",
    "A retry/backoff utility with cancellation, jitter, and bounded concurrency.",
    "An ESLint config that enforces strictest type rules across the team.",
  ],
  reviewGate:
    "Can you express 'a successful transfer' as a single type that cannot represent illegal states?",
  stack: ["TypeScript", "Node.js", "AbortController"],
  modules: [
    {
      id: "w02-m1",
      title: "Type-system as a contract",
      summary:
        "Make illegal states unrepresentable. The compiler is your strictest reviewer.",
      lessons: [
        {
          id: "w02-l1",
          slug: "discriminated-unions",
          title: "Discriminated unions and exhaustiveness",
          summary:
            "The single most powerful pattern in TypeScript: model state machines as unions, then let the compiler force you to handle every transition.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["typescript", "types", "fp"],
          blocks: blocks(
            h2("Modeling state instead of stringly-typing it"),
            p(
              "Junior code stores a payment as `{ status: string }` and litters the codebase with `if (status === 'failed')` checks. Senior code models payments as a discriminated union — every variant carries the data it needs and only that data.",
            ),
            code(
              "typescript",
              `type Payment =
  | { status: "pending"; createdAt: Date }
  | { status: "authorized"; authCode: string; expiresAt: Date }
  | { status: "captured"; settlementId: string }
  | { status: "failed"; reason: FailureReason; retriable: boolean };

function next(p: Payment): Payment {
  switch (p.status) {
    case "pending":      return authorize(p);
    case "authorized":   return capture(p);
    case "captured":     return p;
    case "failed":       return p.retriable ? retry(p) : p;
    default: {
      const _exhaustive: never = p;
      return _exhaustive;
    }
  }
}`,
              "The compiler refuses to build if you forget to handle a variant.",
            ),
            callout(
              "insight",
              "Every time you write `as any` or `// @ts-ignore`, ask: is there a discriminated union that would have made this honest?",
            ),
            h3("Branded types for money"),
            p(
              "TypeScript is structural; numbers are interchangeable. That's a footgun in fintech. Brand them.",
            ),
            code(
              "typescript",
              `type Brand<T, K> = T & { readonly __brand: K };
type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;
const usd = (n: number) => n as USD;

function add(a: USD, b: USD): USD { return (a + b) as USD; }
add(usd(10), usd(5));   // ✅
add(usd(10), 5 as EUR); // ❌ compile error`,
            ),
          ),
          exercises: [
            {
              id: "w02-l1-e1",
              title: "Refactor to a discriminated union",
              difficulty: "intermediate",
              prompt:
                "Given a Payout type with `status: string`, `failureReason: string | null`, and `settledAt: Date | null`, refactor it into a discriminated union that prevents impossible states (e.g. settled but with a failure reason).",
              acceptanceCriteria: [
                "Each variant has only the fields meaningful to that state.",
                "The compiler enforces exhaustive switches.",
                "Existing call sites compile after the refactor.",
              ],
            },
          ],
          interviewQuestions: [
            {
              id: "iv-w02-l1-1",
              level: "senior",
              category: "TypeScript",
              question:
                "Walk me through how you'd type a higher-order retry helper that preserves the inner function's argument types and return type.",
              modelAnswer:
                "Use generic parameter forwarding: `function retry<A extends unknown[], R>(fn: (...a: A) => Promise<R>, opts: RetryOpts): (...a: A) => Promise<R>`. Inside, use a typed AbortController and explicit `unknown` for caught errors. Encode error classification as a discriminated union and let the caller specify which errors are retriable via a predicate.",
            },
          ],
        },
        {
          id: "w02-l2",
          slug: "event-loop-deeply",
          title: "The Node.js event loop, deeply",
          summary:
            "Why your CPU-bound function blocks every other request. The mental model that lets you reason about latency.",
          estimatedMinutes: 35,
          difficulty: "intermediate",
          tags: ["nodejs", "async", "event-loop"],
          blocks: blocks(
            h2("Phases, the microtask queue, and starvation"),
            diagram(
              `┌────────────────────────────────────┐
│  timers (setTimeout / setInterval)  │
├────────────────────────────────────┤
│  pending callbacks                  │
├────────────────────────────────────┤
│  idle, prepare                      │
├────────────────────────────────────┤
│  poll  (I/O callbacks)              │
├────────────────────────────────────┤
│  check  (setImmediate)              │
├────────────────────────────────────┤
│  close callbacks                    │
└────────────────────────────────────┘
   ↻  microtasks (promises) drain
       between every phase`,
              "Node.js event loop phases",
            ),
            p(
              "Every time the event loop yields, the microtask queue is drained completely. That's why a tight `await` loop over millions of promises starves I/O — the microtasks never let the poll phase run.",
            ),
            callout(
              "warning",
              "If you write `for (const x of huge) await fn(x)`, you've serialized your worker. Use a bounded concurrency pool with `p-limit` or `Promise.allSettled` chunks.",
            ),
            code(
              "typescript",
              `import pLimit from "p-limit";
const limit = pLimit(16);
const results = await Promise.allSettled(
  ids.map((id) => limit(() => fetchAccount(id)))
);`,
              "Bounded concurrency keeps the event loop healthy.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w02-l2-1",
              level: "senior",
              category: "Node.js runtime",
              question:
                "A Node service has 200ms p99 latency in the absence of load and 5000ms p99 under modest load. CPU is at 40%. What do you investigate?",
              modelAnswer:
                "Modest CPU but ballooning latency screams event-loop saturation, not CPU saturation. Capture event-loop lag (e.g. `monitorEventLoopDelay`). Likely culprits: synchronous JSON.stringify of huge objects, sync crypto, sync regex with catastrophic backtracking, or a `for await` over a stream that fans out into too many awaits. Move CPU work into worker threads, batch I/O, and use streams.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w02-set-1",
      level: "senior",
      category: "Async control flow",
      question:
        "How do you implement structured concurrency in Node.js without a native primitive?",
      modelAnswer:
        "Use a single AbortController per scope and pass its signal to every awaited operation. On error, abort the controller — every in-flight call sees the signal and unwinds. Wrap the whole scope in a try/finally that aborts on exit so leaks are impossible. Libraries like `unctx` and `AsyncLocalStorage` carry the controller through async boundaries without prop-drilling.",
      tradeoffs: [
        "AsyncLocalStorage adds modest overhead but avoids global mutation.",
        "AbortController forces every consumer to honor the signal — a discipline cost.",
      ],
    },
  ],
  productionInsights: [
    {
      title: "Type your boundaries, runtime-validate at edges",
      summary:
        "Inside your service, types are king. At HTTP/queue boundaries, you must runtime-validate.",
      details:
        "Use zod, valibot, or io-ts at the edge to convert untrusted JSON into typed values. Once validated, the rest of your codebase can rely on the type without paranoid checks.",
    },
  ],
};
