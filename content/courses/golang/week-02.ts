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
  title: "Concurrency, contexts, and cancellation",
  stage: "Concurrency",
  summary:
    "Goroutines are cheap. Channels are powerful. Context is the discipline that makes them safe.",
  objectives: [
    "Use goroutines, channels, and select idiomatically.",
    "Pass context.Context as the first arg of any I/O-bound function.",
    "Apply standard concurrency patterns: worker pools, fan-in/fan-out, errgroup.",
    "Detect goroutine leaks before they cause production incidents.",
  ],
  concepts: [
    "Goroutines, channels, select",
    "Context cancellation and deadlines",
    "errgroup, semaphores, sync primitives",
    "Goroutine leaks and how to detect them",
  ],
  deliverables: [
    "Reusable bounded fan-out helper using errgroup + semaphore.",
    "Test suite using goleak to verify no leaks.",
    "Benchmark comparing goroutines-per-task vs worker pool.",
  ],
  reviewGate:
    "Show me a goroutine you created. Where does it stop?",
  stack: ["Go", "errgroup", "goleak"],
  modules: [
    {
      id: "go-w02-m1",
      title: "Concurrency in practice",
      summary: "The patterns that production Go services rely on.",
      progression: "core",
      lessons: [
        {
          id: "go-w02-l1",
          slug: "context-and-errgroup",
          title: "Context, errgroup, and bounded fan-out",
          summary:
            "Pass a context, propagate cancellation, bound concurrency. Three habits that prevent most production Go bugs.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["go", "concurrency", "context"],
          blocks: blocks(
            code(
              "go",
              `func FetchAll(ctx context.Context, ids []string) ([]Account, error) {
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
              "errgroup + bounded semaphore is the standard fan-out shape.",
            ),
            callout(
              "production",
              "If you create a goroutine without a path for cancellation, you've created a leak. Always pass a context, always check Done().",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-go-w02-l1-1",
              level: "senior",
              category: "Go",
              question: "How do you detect goroutine leaks in production?",
              modelAnswer:
                "Expose /debug/pprof/goroutine and capture profiles before/after a load test or canary deploy. Diff the goroutine counts grouped by stack. Leaks present as ever-growing counts of identical stacks. In tests, use goleak.VerifyNone(t) after each test to catch leaks at the source. Alert when goroutine count grows monotonically over a window.",
            },
          ],
        },
        {
          id: "go-w02-l2",
          slug: "channels-as-signals",
          title: "Channels as signals",
          summary:
            "Channels are best as signaling primitives: 'I'm done', 'cancel', 'here's a result'. Don't use them as queues unless you really mean it.",
          estimatedMinutes: 20,
          difficulty: "intermediate",
          tags: ["channels", "go"],
          blocks: blocks(
            ul([
              "Closed channels broadcast — every receiver wakes up.",
              "Buffered channels are queues; small buffers signal pressure cleanly.",
              "Use select to wait on multiple channels with cancellation.",
              "Never block on a channel without an escape via context.Done() or a timeout.",
            ]),
            code(
              "go",
              `select {
case res := <-ch:
    return res, nil
case <-ctx.Done():
    return nil, ctx.Err()
case <-time.After(5*time.Second):
    return nil, errors.New("timeout")
}`,
              "Three escape hatches in a single select.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Context is a contract",
      summary:
        "Every I/O-bound function must accept a context as its first parameter.",
      details:
        "When a request is cancelled, that signal must propagate to every downstream call. The convention only works if every function honors it. Adding context to an existing API later is painful — start with it everywhere from day one.",
    },
  ],
};
