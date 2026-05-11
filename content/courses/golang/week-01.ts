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
  title: "Idiomatic Go: types, errors, interfaces",
  stage: "Foundations",
  summary:
    "The compact mental model behind idiomatic Go. Interfaces as small contracts, errors as values, the standard library as the default toolbox.",
  objectives: [
    "Use interfaces idiomatically — small, accept-interfaces-return-structs.",
    "Treat errors as values; wrap with %w; use errors.Is/As at call sites.",
    "Apply Go's standard library before reaching for third-party packages.",
    "Read and write Go that other Go programmers nod at.",
  ],
  concepts: [
    "Structs, methods, value vs pointer receivers",
    "Interfaces, satisfaction, the empty interface",
    "Errors as values, sentinel errors, wrapped errors",
    "Standard library tour: io, net/http, encoding/json, context",
  ],
  deliverables: [
    "A small CLI tool that exercises std lib effectively.",
    "An error taxonomy for a small package, with errors.Is/As examples.",
    "A reusable HTTP client wrapper with timeouts and retry.",
  ],
  reviewGate:
    "Can you explain why `accept interfaces, return structs` is idiomatic and what breaks when you do the opposite?",
  stack: ["Go", "stdlib"],
  modules: [
    {
      id: "go-w01-m1",
      title: "Idiomatic Go",
      summary: "What 'go programmer' means in practice.",
      progression: "foundation",
      lessons: [
        {
          id: "go-w01-l1",
          slug: "errors-as-values",
          title: "Errors as values",
          summary:
            "Go errors are dumb structs. Make them rich enough to carry context, but no richer.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["go", "errors"],
          blocks: blocks(
            code(
              "go",
              `package wallet

import "errors"

var (
    ErrInsufficient = errors.New("insufficient balance")
    ErrFrozen       = errors.New("account frozen")
)

func Withdraw(id string, amt int64) error {
    a, err := load(id)
    if err != nil {
        return fmt.Errorf("withdraw load %q: %w", id, err)
    }
    if a.Frozen { return ErrFrozen }
    if a.Balance < amt { return ErrInsufficient }
    return save(a.Sub(amt))
}`,
              "Sentinel errors + wrapped errors with context.",
            ),
            code(
              "go",
              `// at the boundary, classify
if err := wallet.Withdraw(id, amt); err != nil {
    switch {
    case errors.Is(err, wallet.ErrInsufficient): http.Error(w, "insufficient", 422)
    case errors.Is(err, wallet.ErrFrozen):       http.Error(w, "frozen", 423)
    default:                                      http.Error(w, "internal", 500)
    }
}`,
              "Use errors.Is at the boundary, not deep inside.",
            ),
            callout(
              "tip",
              "Don't ship `if err != nil { return err }` everywhere — wrap with context: `fmt.Errorf(\"open file %q: %w\", name, err)`. Future you will thank present you.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-go-w01-l1-1",
              level: "intermediate",
              category: "Go",
              question:
                "Why prefer sentinel errors over typed errors with extra fields?",
              modelAnswer:
                "Sentinel errors are simple identity values; callers use errors.Is to match. Typed errors with fields use errors.As when you actually need the data. Default to sentinels — they compose cleanly across packages and don't lock you into struct shapes. Reach for typed errors when callers genuinely need extra context (HTTP status, retry hint, validation details).",
            },
          ],
        },
        {
          id: "go-w01-l2",
          slug: "interfaces-small-and-accepted",
          title: "Interfaces: small, accepted, returned rarely",
          summary:
            "Go interfaces work best when they're tiny. The package boundary defines them; the consumer accepts them.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["interfaces", "go"],
          blocks: blocks(
            code(
              "go",
              `// in package store
type Reader interface { Get(ctx context.Context, id string) ([]byte, error) }

// in package consumer
func Process(ctx context.Context, r store.Reader, ids []string) error {
    for _, id := range ids {
        b, err := r.Get(ctx, id)
        if err != nil { return fmt.Errorf("process %q: %w", id, err) }
        // ... use b
    }
    return nil
}`,
              "Process accepts the smallest interface it needs.",
            ),
            callout(
              "insight",
              "If your interface has 5+ methods, it's not an interface — it's a description of a class. Split it into the small interfaces consumers actually need.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "stdlib first, third-party second",
      summary:
        "The Go stdlib is much richer than most engineers initially assume.",
      details:
        "net/http, encoding/json, time, context, io — these are well-engineered and stable. Reach for third-party only when you need something specific the stdlib doesn't cover. This keeps your dependency tree small and stable.",
    },
  ],
};
