import type { Week } from "@/types/content";
import { blocks, callout, code, h2, p, ul } from "@/content/courses/_helpers";
export const week10: Week = {
  id: "week-10",
  number: 10,
  title: "Go for backend systems and microservices",
  stage: "Advanced Infrastructure",
  summary:
    "Add Go to your toolbelt for the systems that demand throughput and predictable latency. We focus on the patterns and operational discipline that production Go engineers care about.",
  objectives: [
    "Read and write idiomatic Go: interfaces, channels, contexts, errors.",
    "Apply concurrency patterns (worker pools, fan-in/fan-out, structured concurrency).",
    "Design microservices with clear boundaries, contracts, and observability.",
    "Operate Go in production: GC tuning, profiling, distributing workloads.",
  ],
  concepts: [
    "Goroutines, channels, select",
    "Context cancellation and propagation",
    "Errors as values, error wrapping",
    "Microservice boundaries, gRPC vs REST",
    "pprof, trace, GC tuning",
  ],
  deliverables: [
    "Concurrent worker pool with bounded goroutines, context cancellation, and graceful shutdown.",
    "gRPC service with proto-defined contract and integration tests.",
    "Profiling report identifying allocations and goroutine leaks.",
  ],
  reviewGate:
    "Can you explain why your Go service does or does not need a worker pool, and prove it with a benchmark?",
  stack: ["Go", "gRPC", "PostgreSQL", "pprof"],
  modules: [
    {
      id: "w10-m1",
      title: "Go in practice",
      summary:
        "Go is small. Production Go is mostly about discipline around channels, contexts, and errors.",
      lessons: [
        {
          id: "w10-l1",
          slug: "context-and-cancellation",
          title: "Context, cancellation, and propagation",
          summary:
            "Every concurrent operation should answer to a context. The discipline that prevents goroutine leaks.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["go", "concurrency", "context"],
          blocks: blocks(
            h2("Context as a contract"),
            p(
              "Pass a context.Context as the first argument of any function that does I/O or work that may take time. The caller can cancel; the callee must respect the cancellation. This is how a single client disconnect propagates and frees server resources.",
            ),
            code(
              "go",
              `func FetchPaginated(ctx context.Context, ids []string) ([]Account, error) {
    out := make([]Account, len(ids))
    g, gctx := errgroup.WithContext(ctx)
    sem := make(chan struct{}, 16) // bounded concurrency

    for i, id := range ids {
        i, id := i, id
        sem <- struct{}{}
        g.Go(func() error {
            defer func() { <-sem }()
            a, err := getAccount(gctx, id)
            if err != nil { return err }
            out[i] = a
            return nil
        })
    }
    if err := g.Wait(); err != nil { return nil, err }
    return out, nil
}`,
              "errgroup + bounded semaphore is the standard Go fan-out pattern.",
            ),
            callout(
              "production",
              "If you create a goroutine without a path for cancellation, you've created a leak. Always pass a context, always check Done().",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w10-l1-1",
              level: "senior",
              category: "Go",
              question:
                "How do you detect goroutine leaks in production?",
              modelAnswer:
                "Expose `/debug/pprof/goroutine` and capture profiles before/after a load test or canary deploy. Diff the goroutine counts grouped by stack. Leaks present as ever-growing counts of identical stacks. In tests, use `goleak.VerifyNone(t)` after each test to catch leaks at the source. Alert when goroutine count grows monotonically over a window — that's almost always a leak.",
            },
          ],
        },
        {
          id: "w10-l2",
          slug: "microservices-boundaries",
          title: "Microservices: boundaries that don't leak",
          summary:
            "The hardest part of microservices is not the code — it's deciding where the seams go. Get the boundaries wrong and you've built a distributed monolith.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["microservices", "system-design"],
          blocks: blocks(
            h2("Conway's law works in both directions"),
            p(
              "If two services are owned by the same team and deploy together, you have a distributed monolith. If a single business operation requires synchronous calls across many services, you've recreated SQL JOINs over HTTP. Real microservice boundaries align with team ownership, deployment cadence, and failure isolation.",
            ),
            ul([
              "A service should be deployable independently. If you must coordinate releases, the seam is wrong.",
              "A service should own its data. Sharing a database between services is the most common anti-pattern.",
              "Cross-service calls should be async-friendly. Sync chains > 3 deep are a fragility multiplier.",
            ]),
            callout(
              "tradeoff",
              "Microservices add operational cost from day one but pay back in team scale. Below ~10 engineers, prefer a modular monolith.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w10-l2-1",
              level: "senior",
              category: "System design",
              question:
                "When does it make sense to extract a function into a microservice?",
              modelAnswer:
                "Three signals: (1) it has a different scaling profile (CPU-heavy or memory-heavy work that drowns the rest), (2) it has a different deployment cadence or different team owner, (3) it has a different security/compliance boundary. If none of those apply, you've extracted a service for the wrong reason and you'll pay for it in latency, debuggability, and on-call.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w10-set-1",
      level: "senior",
      category: "Go performance",
      question:
        "Your Go service shows 80% CPU in GC under load. What's your investigation path?",
      modelAnswer:
        "Capture an alloc profile (`pprof -alloc_objects`) and a CPU profile. Identify the top allocators and decide whether they're avoidable: pool short-lived buffers, switch from interface to concrete types in hot paths, prefer pre-allocated slices, avoid unnecessary string conversions. If the workload is genuinely high allocation, raise GOGC (default 100, try 300) so GC runs less frequently at the cost of higher peak memory. Always re-measure with both production-shaped data and concurrency.",
    },
  ],
  productionInsights: [
    {
      title: "Errors are values; design them",
      summary:
        "Go errors are dumb structs. Make them rich enough to carry context.",
      details:
        "Wrap errors with `fmt.Errorf(\"open file %q: %w\", name, err)` so callers can errors.Is/As. Define sentinel errors for stable categories (ErrNotFound, ErrConflict) and let middleware translate them into HTTP/gRPC codes. Consistent error taxonomy is the foundation of your service's debuggability.",
    },
  ],
};
