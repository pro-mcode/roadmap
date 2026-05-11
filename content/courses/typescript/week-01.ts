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

export const week01: Week = {
  id: "week-01",
  number: 1,
  title: "Type system as a contract",
  stage: "Foundations",
  summary:
    "Use the type system to encode invariants, not just to type-annotate JavaScript. Discriminated unions, exhaustive switches, branded types.",
  objectives: [
    "Model state machines as discriminated unions and let the compiler enforce them.",
    "Use branded types to prevent unit confusion at compile time.",
    "Configure tsconfig for the strictest practical rules.",
    "Read and write conditional and mapped types fluently.",
  ],
  concepts: [
    "Discriminated unions and exhaustive switches",
    "Branded / opaque / nominal typing",
    "Conditional and mapped types",
    "Template literal types",
    "Type-level testing",
  ],
  deliverables: [
    "Refactor an existing string-typed enum into a discriminated union.",
    "Add branded types for money in a small library.",
    "Author a Pretty<T> utility that flattens intersection types in tooltips.",
  ],
  reviewGate:
    "Can you express 'a successful transfer' as a single type that cannot represent illegal states?",
  stack: ["TypeScript", "Vitest", "tsd"],
  modules: [
    {
      id: "ts-w01-m1",
      title: "Modeling with the type system",
      summary:
        "Make illegal states unrepresentable. The compiler is your strictest reviewer.",
      progression: "foundation",
      lessons: [
        {
          id: "ts-w01-l1",
          slug: "discriminated-unions",
          title: "Discriminated unions and exhaustiveness",
          summary:
            "The single most powerful pattern in TypeScript. Model state machines as unions, then let the compiler force you to handle every transition.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["typescript", "types", "fp"],
          blocks: blocks(
            h2("Modeling state instead of stringly-typing it"),
            p(
              "Junior code stores a payment as { status: string } and litters the codebase with `if (status === 'failed')` checks. Senior code models payments as a discriminated union — every variant carries the data it needs and only that data.",
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
              "The compiler refuses to build if you forget a variant.",
            ),
            callout(
              "insight",
              "Every time you write `as any` or `// @ts-ignore`, ask: is there a discriminated union that would have made this honest?",
            ),
            h3("Branded types"),
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
              id: "ts-w01-l1-e1",
              title: "Refactor to a discriminated union",
              difficulty: "intermediate",
              prompt:
                "Given a Payout type with status: string, failureReason: string | null, and settledAt: Date | null, refactor it into a discriminated union that prevents impossible states.",
              acceptanceCriteria: [
                "Each variant has only the fields meaningful to that state.",
                "The compiler enforces exhaustive switches.",
                "Existing call sites compile after the refactor.",
              ],
            },
          ],
          interviewQuestions: [
            {
              id: "iv-ts-w01-l1-1",
              level: "senior",
              category: "TypeScript",
              question:
                "Walk me through how you'd type a higher-order retry helper that preserves the inner function's argument types and return type.",
              modelAnswer:
                "Use generic parameter forwarding: function retry<A extends unknown[], R>(fn: (...a: A) => Promise<R>, opts: RetryOpts): (...a: A) => Promise<R>. Inside, use a typed AbortController and explicit `unknown` for caught errors. Encode error classification as a discriminated union and let the caller specify which errors are retriable via a predicate.",
            },
          ],
        },
        {
          id: "ts-w01-l2",
          slug: "conditional-and-mapped-types",
          title: "Conditional and mapped types",
          summary:
            "Where TypeScript starts feeling like a small functional language. We use them to express helpers that adapt to their input types.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["typescript", "advanced-types"],
          blocks: blocks(
            h2("Conditional types"),
            code(
              "typescript",
              `type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
type DistributiveOmit<T, K extends keyof any> =
  T extends unknown ? Omit<T, K> : never;`,
              "Two utilities you'll write yourself before you discover them in the standard lib.",
            ),
            h3("Mapped types"),
            code(
              "typescript",
              `type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Optional<T> = { [P in keyof T]?: T[P] };
type ApiResponse<T> = { [K in keyof T as \`response_\${string & K}\`]: T[K] };`,
              "Mapped types remix object types deterministically.",
            ),
            callout(
              "tip",
              "When tooltips show ugly intersections, wrap with Pretty<T> = { [K in keyof T]: T[K] } & {} to flatten.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-ts-w01-l2-1",
              level: "senior",
              category: "TypeScript",
              question:
                "Why does `T extends U ? X : Y` distribute over union types?",
              modelAnswer:
                "When T is a naked type parameter (not wrapped in another generic), TypeScript distributes the conditional across the union: A | B | C becomes (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y). To opt out, wrap both sides: [T] extends [U]. This is the foundation of utilities like Exclude, Extract, and DistributiveOmit.",
            },
          ],
        },
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
