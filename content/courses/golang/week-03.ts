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
  title: "Production Go: pprof, gRPC, and operability",
  stage: "Production",
  summary:
    "Tooling and operational habits that make Go services pleasant to run. Profiling, gRPC contracts, and the observability defaults you should ship from day one.",
  objectives: [
    "Use pprof to investigate CPU, allocation, and goroutine pressure.",
    "Author gRPC services with proto-defined contracts.",
    "Tune GC for predictable latency under load.",
    "Ship structured logs and metrics from a Go service by default.",
  ],
  concepts: [
    "pprof: CPU, alloc_objects, goroutine, heap profiles",
    "GOGC, GOMEMLIMIT, GC pacing",
    "gRPC + protobuf workflow",
    "Logger choices: slog, zap, zerolog",
  ],
  deliverables: [
    "pprof investigation report on a deliberately-broken service.",
    "gRPC service with health checks and graceful shutdown.",
    "Service template with slog + Prometheus metrics.",
  ],
  reviewGate:
    "If your Go service shows 80% CPU in GC, what's your investigation path?",
  stack: ["Go", "pprof", "gRPC", "Prometheus"],
  modules: [
    {
      id: "go-w03-m1",
      title: "Profiling and contracts",
      summary: "The two skills that separate an everyday Go programmer from a production one.",
      progression: "advanced",
      lessons: [
        {
          id: "go-w03-l1",
          slug: "pprof-in-anger",
          title: "pprof in anger",
          summary:
            "Capture profiles, read flame graphs, and act on what you see.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["pprof", "performance"],
          blocks: blocks(
            code(
              "go",
              `import _ "net/http/pprof"

go func() { http.ListenAndServe("localhost:6060", nil) }()`,
              "Drop-in pprof endpoint. (Bind to localhost only — never public.)",
            ),
            code(
              "bash",
              `# 30s CPU profile
go tool pprof -seconds=30 http://localhost:6060/debug/pprof/profile

# allocations
go tool pprof http://localhost:6060/debug/pprof/allocs

# live goroutines (great for leaks)
curl http://localhost:6060/debug/pprof/goroutine?debug=2`,
              "Three commands you'll use every incident.",
            ),
            callout(
              "production",
              "Capture an alloc profile and a CPU profile under representative load. The top 5 allocators usually point straight at the bottleneck — pool buffers, switch from interface to concrete types, avoid string conversions in hot paths.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-go-w03-l1-1",
              level: "senior",
              category: "Go performance",
              question:
                "Your Go service spends 80% CPU in GC under load. Walk me through diagnosis.",
              modelAnswer:
                "Capture an alloc profile to identify top allocators. Decide if they're avoidable: pool short-lived buffers, switch from interface to concrete types in hot paths, prefer pre-allocated slices, avoid unnecessary string conversions. If allocations are inherent to the workload, raise GOGC (default 100, try 300) so GC runs less frequently at the cost of higher peak memory. Always re-measure with both production-shaped data and concurrency.",
            },
          ],
        },
        {
          id: "go-w03-l2",
          slug: "grpc-contracts",
          title: "gRPC services with proto-first contracts",
          summary:
            "Why gRPC is worth the toolchain. The proto file becomes the source of truth for both server and client.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["grpc", "protobuf"],
          blocks: blocks(
            code(
              "text",
              `syntax = "proto3";
package ledger.v1;

service Ledger {
  rpc Post(PostRequest) returns (PostResponse);
}

message PostRequest {
  string idempotency_key = 1;
  repeated Entry entries = 2;
}
message Entry {
  string account_id = 1;
  enum Direction { D = 0; C = 1; }
  Direction direction = 2;
  int64 amount_minor = 3;
}
message PostResponse {
  string txn_id = 1;
  google.protobuf.Timestamp posted_at = 2;
}`,
              "A small ledger contract, version-pinned in the package name.",
            ),
            ul([
              "Proto files are the source of truth. Both server stubs and client stubs derive from them.",
              "Use field-level versioning (v1, v2) at the package level, not at field names.",
              "Reserved field numbers prevent accidental wire-format collisions on rename.",
              "Default values are wire-format invisible — design APIs that treat zero values intentionally.",
            ]),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Errors are values; design them",
      summary:
        "Go errors are dumb structs. Make them rich enough to carry context.",
      details:
        "Wrap errors with fmt.Errorf(\"open file %q: %w\", name, err) so callers can errors.Is/As. Define sentinel errors for stable categories and let middleware translate them into HTTP/gRPC codes. Consistent error taxonomy is the foundation of your service's debuggability.",
    },
  ],
};
