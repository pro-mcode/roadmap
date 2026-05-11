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
  title: "Node.js runtime, deeply",
  stage: "Runtime",
  summary:
    "The mental model that lets you reason about Node latency. Event loop phases, microtasks, streams, backpressure.",
  objectives: [
    "Explain the Node event loop phases and the microtask queue.",
    "Use streams and backpressure to handle large workloads efficiently.",
    "Diagnose CPU-bound vs event-loop-bound vs I/O-bound issues.",
    "Move CPU work to worker threads correctly.",
  ],
  concepts: [
    "libuv, phases, poll vs check",
    "Microtask queue, queueMicrotask",
    "Streams: Readable, Writable, Transform, pipeline",
    "Worker threads, MessageChannel",
    "monitorEventLoopDelay",
  ],
  deliverables: [
    "Event-loop diagnostic helper printing lag at p50/p99.",
    "A streaming CSV transformer that handles backpressure.",
    "A small worker-thread pool for CPU-bound work.",
  ],
  reviewGate:
    "Given a Node service with rising p99 but flat CPU, can you name three plausible causes?",
  stack: ["Node.js", "TypeScript"],
  modules: [
    {
      id: "node-w01-m1",
      title: "Event loop and async control",
      summary: "How Node actually runs your code.",
      progression: "foundation",
      lessons: [
        {
          id: "node-w01-l1",
          slug: "event-loop-phases",
          title: "Event loop phases and the microtask queue",
          summary:
            "Each loop iteration cycles through phases: timers, pending callbacks, poll (I/O), check (setImmediate), close. Microtasks (promises) drain between each phase.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["nodejs", "event-loop"],
          blocks: blocks(
            diagram(
              `┌────────────────────────────────────┐
│  timers (setTimeout / setInterval) │
├────────────────────────────────────┤
│  pending callbacks                  │
├────────────────────────────────────┤
│  poll  (I/O callbacks)              │
├────────────────────────────────────┤
│  check  (setImmediate)              │
├────────────────────────────────────┤
│  close callbacks                    │
└────────────────────────────────────┘
   ↻  microtasks drain between phases`,
              "Node event loop phases",
            ),
            p(
              "When the event loop yields between phases, the microtask queue is drained completely. This is why a tight `await` loop over millions of promises starves I/O — microtasks never let the poll phase run.",
            ),
            callout(
              "warning",
              "If you write `for (const x of huge) await fn(x)`, you've serialized your worker. Use a bounded concurrency pool with `p-limit`.",
            ),
            code(
              "typescript",
              `import { monitorEventLoopDelay } from "node:perf_hooks";
const h = monitorEventLoopDelay({ resolution: 10 });
h.enable();

setInterval(() => {
  console.log("p50", h.percentile(50) / 1e6, "p99", h.percentile(99) / 1e6);
  h.reset();
}, 5000);`,
              "A 6-line event-loop lag monitor.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-node-w01-l1-1",
              level: "senior",
              category: "Node.js runtime",
              question:
                "A Node service has 200ms p99 baseline and 5000ms p99 under modest load. CPU sits at 40%. What's wrong?",
              modelAnswer:
                "Modest CPU + ballooning latency screams event-loop saturation, not CPU saturation. Likely culprits: synchronous JSON.stringify of huge objects, sync crypto, sync regex with catastrophic backtracking, or a `for await` over a stream that fans out into too many awaits. Capture event-loop lag, move CPU work into worker threads, batch I/O, and prefer streams.",
            },
          ],
        },
        {
          id: "node-w01-l2",
          slug: "streams-and-backpressure",
          title: "Streams and backpressure",
          summary:
            "When the data is bigger than memory, you stream. The discipline that makes streaming safe is backpressure.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["streams", "backpressure"],
          blocks: blocks(
            code(
              "typescript",
              `import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { createGunzip } from "node:zlib";
import { Transform } from "node:stream";

const filterRow = new Transform({
  transform(chunk, _enc, cb) {
    // pretend each chunk is one CSV line
    if (Buffer.from(chunk).includes("ERROR")) cb(null, chunk);
    else cb();
  },
});

await pipeline(
  createReadStream("logs.csv.gz"),
  createGunzip(),
  filterRow,
  createWriteStream("errors.csv"),
);`,
              "pipeline() handles errors, backpressure, and cleanup automatically.",
            ),
            callout(
              "tip",
              "Always reach for `pipeline` from `node:stream/promises`. Manually wiring `.pipe()` is the fastest path to silent leaks.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Bound everything",
      summary:
        "Every async operation should have a timeout, an AbortSignal, or both.",
      details:
        "Unbounded calls hold resources forever when downstreams misbehave. The cheapest discipline is to default-parameter every external call with `signal: AbortSignal.timeout(ms)`.",
    },
  ],
};
