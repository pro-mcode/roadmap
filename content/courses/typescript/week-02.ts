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
  title: "Async, generics, and library boundaries",
  stage: "Applied TypeScript",
  summary:
    "Type the asynchronous code you actually write. Generics that preserve information, library boundaries that don't leak, strict configs that pay dividends.",
  objectives: [
    "Type async code without losing inference.",
    "Author generics with bounded constraints and default parameters.",
    "Configure tsconfig for production-grade strictness.",
    "Use AsyncLocalStorage and AbortController with full typing.",
  ],
  concepts: [
    "Promise<T>, generators, async iterators",
    "Generic constraints, defaults, variance markers",
    "noUncheckedIndexedAccess, exactOptionalPropertyTypes",
    "Type-safe error handling",
    "Module boundaries and `unknown` at the edge",
  ],
  deliverables: [
    "tsconfig.json template with the strictest practical rules.",
    "Typed retry / circuit-breaker helper.",
    "Async iterator that batches an underlying source.",
  ],
  reviewGate:
    "Can you justify each strict flag in your tsconfig with a concrete bug it prevents?",
  stack: ["TypeScript", "Node.js", "Vitest"],
  modules: [
    {
      id: "ts-w02-m1",
      title: "Production-grade TypeScript",
      summary:
        "How senior engineers configure projects, type async code, and set library boundaries.",
      progression: "core",
      lessons: [
        {
          id: "ts-w02-l1",
          slug: "strictest-tsconfig",
          title: "The strictest tsconfig that ships",
          summary:
            "Strict isn't enough. Several flags off-by-default are critical for production code.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["tsconfig", "production"],
          blocks: blocks(
            h2("Beyond strict: true"),
            ul([
              "noUncheckedIndexedAccess — forces you to handle the undefined return when indexing into objects/arrays.",
              "exactOptionalPropertyTypes — distinguishes 'missing' from 'set to undefined'.",
              "noImplicitOverride — class methods must be marked override.",
              "noFallthroughCasesInSwitch — forgetting a break is now a build error.",
              "noUnusedLocals / noUnusedParameters — keep dead code out of the build.",
            ]),
            code(
              "json",
              `{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}`,
              "Drop this into a fresh project and tighten over time.",
            ),
            callout(
              "production",
              "Each strict flag corresponds to a real production bug. When a teammate balks at noUncheckedIndexedAccess, ask them how often they've debugged a 'TypeError: cannot read property X of undefined' that wouldn't happen here.",
            ),
          ),
        },
        {
          id: "ts-w02-l2",
          slug: "async-and-cancellation",
          title: "Async control flow with full typing",
          summary:
            "AbortController, structured concurrency, and the patterns that prevent your service from leaking promises.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["async", "abortcontroller"],
          blocks: blocks(
            code(
              "typescript",
              `import pLimit from "p-limit";

export async function fetchAll<T>(
  ids: string[],
  fetcher: (id: string, signal: AbortSignal) => Promise<T>,
  signal: AbortSignal,
  concurrency = 16,
): Promise<T[]> {
  const limit = pLimit(concurrency);
  const out = await Promise.all(
    ids.map((id) => limit(() => fetcher(id, signal))),
  );
  return out;
}`,
              "Bounded concurrency + propagated cancellation in 12 lines.",
            ),
            h3("Why this matters"),
            p(
              "If you call await in a tight loop, you've serialized your worker. If you spawn unbounded concurrency, you've DDOS'd your downstream. Pass an AbortSignal so a single cancellation propagates everywhere; bound concurrency so you can predict load.",
            ),
            callout(
              "warning",
              "If your function takes a Promise<T> but no AbortSignal, it cannot be cancelled. Most production async leaks trace back to functions that ignored cancellation in their signature.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-ts-w02-l2-1",
              level: "senior",
              category: "TypeScript / async",
              question:
                "Your Node service accumulates pending promises on hot reload. Where do you start?",
              modelAnswer:
                "Find the entry points that don't accept an AbortSignal — that's where leaks originate. Add Signal propagation, refactor unbounded fan-outs into p-limit pools, and ensure every external call has an explicit timeout. Add a `process.on('SIGTERM')` handler that fires the global AbortController so an in-flight request set drains cleanly during deploy.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-ts-w02-set-1",
      level: "senior",
      category: "TypeScript",
      question:
        "How do you type a function that takes a config object where some keys depend on the value of another key?",
      modelAnswer:
        "Use a discriminated union for the config: { kind: 'a'; aOnly: string } | { kind: 'b'; bOnly: number }. Each variant carries only the fields valid for that mode. The compiler narrows correctly inside switch/if. Trying to express this with optional fields is a common mistake — it permits illegal combinations.",
    },
  ],
  productionInsights: [
    {
      title: "Strict from day one",
      summary:
        "Tightening rules later costs more than starting strict.",
      details:
        "Every codebase that defers strict ends up with hundreds of opt-outs. Start every project with the strictest tsconfig you can tolerate; loosen only with explicit reasons. Teams that lead with strictness ship measurably fewer runtime type bugs.",
    },
  ],
};
