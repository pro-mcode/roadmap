import type { Week } from "@/types/content";
import { blocks, callout, code, h3, p } from "@/content/courses/_helpers";
export const week03: Week = {
  id: "week-03",
  number: 3,
  title: "Async Rust, error handling, and concurrency",
  stage: "Rust Engineering",
  summary:
    "Tokio, futures, and the patterns that distinguish a safe concurrent Rust program from a tangled one. Add the error-handling discipline that auditors and library authors share.",
  objectives: [
    "Use async/.await with confidence and a model of how futures actually run.",
    "Choose between Tokio, async-std, and threads for a given workload.",
    "Adopt the `thiserror` + `anyhow` pattern at the library/application boundary.",
    "Reason about cancellation, timeouts, and structured concurrency in async Rust.",
  ],
  concepts: [
    "Futures, executors, polling",
    "Tokio runtime, tasks, JoinHandles",
    "Send + 'static bounds for spawned tasks",
    "Result, ?, thiserror, anyhow",
    "select!, timeouts, cancellation",
  ],
  deliverables: [
    "Async TCP echo server with structured cancellation.",
    "Library + binary repo using thiserror in the lib and anyhow in main.",
    "Notes on the three async pitfalls that bit you.",
  ],
  reviewGate:
    "Can you explain why an .await on a non-Send future inside tokio::spawn fails to compile?",
  stack: ["Rust", "Tokio", "Futures"],
  modules: [
    {
      id: "w03-m1",
      title: "Async Rust, mentally modeled",
      summary:
        "Async in Rust is a state machine compiled at the call site. Once you see that, the borrow rules around futures stop feeling arbitrary.",
      lessons: [
        {
          id: "w03-l1",
          slug: "futures-and-executors",
          title: "Futures and executors",
          summary:
            "A Future is a value that, when polled, returns Pending or Ready. The executor decides when to poll. async/.await is just sugar for building these state machines.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["rust", "async", "tokio"],
          blocks: blocks(
            code(
              "rust",
              `use tokio::time::{sleep, Duration};

async fn fetch(id: u64) -> Result<String, std::io::Error> {
    sleep(Duration::from_millis(50)).await;
    Ok(format!("user-{}", id))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let (a, b) = tokio::join!(fetch(1), fetch(2));
    println!("{:?} {:?}", a?, b?);
    Ok(())
}`,
              "tokio::join polls both futures concurrently on the same task.",
            ),
            h3("Cancellation"),
            p(
              "In async Rust, dropping a future cancels it. tokio::select! is the idiomatic way to express 'first to finish wins, the others get cancelled.' This is much lighter-weight than threads.",
            ),
            callout(
              "warning",
              "Async cancellation is structural: the future's progress is just discarded. If your future was holding a database connection in a partially-applied state, that state is now wrong. Use Drop guards or explicit cleanup.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w03-l1-1",
              level: "senior",
              category: "Async",
              question:
                "Explain the trade-offs between threads and tokio tasks for a CPU-bound workload.",
              modelAnswer:
                "Tokio tasks share the runtime; a CPU-bound task starves the others until it yields. Use `tokio::task::spawn_blocking` to hand CPU work to a separate threadpool, or use rayon for data-parallel work. The async runtime is for I/O concurrency, not parallelism. Mixing them naively is the most common Rust performance bug we see at audit time.",
            },
          ],
        },
        {
          id: "w03-l2",
          slug: "errors-thiserror-anyhow",
          title: "Errors: thiserror in libs, anyhow at the edge",
          summary:
            "The two crates that shape modern Rust error handling. Each has a job; using the wrong one makes downstream code awkward.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["rust", "errors"],
          blocks: blocks(
            code(
              "rust",
              `use thiserror::Error;

#[derive(Debug, Error)]
pub enum WalletError {
    #[error("insufficient balance")] InsufficientBalance,
    #[error(transparent)] Db(#[from] sqlx::Error),
    #[error("rpc failure: {0}")] Rpc(String),
}`,
              "thiserror in a library crate.",
            ),
            p(
              "thiserror gives library authors a typed error enum that integrates with `?`. anyhow gives application code a single dynamic error type that captures backtraces and chains causes. Libraries should never use anyhow in public APIs — it forces consumers to lose type information.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w03-set-1",
      level: "senior",
      category: "Async Rust",
      question:
        "What is a 'cancellation safety' bug in async Rust?",
      modelAnswer:
        "A function is cancellation-safe if dropping the future at any await point leaves the world in a consistent state. Many functions aren't: e.g. taking a lock, mutating, then writing to disk — if cancelled between mutate and write, the disk is stale. Document cancellation safety in your async APIs and structure them so each .await is a 'safe checkpoint' or wrap state changes in transactional patterns.",
    },
  ],
  productionInsights: [
    {
      title: "Bound everything",
      summary:
        "Every async I/O call should have an explicit timeout. Defaults are not safe.",
      details:
        "Use `tokio::time::timeout` aggressively. An infinite-blocking call holds resources forever. In production audit work, missing timeouts are the most common way Rust services degrade silently.",
    },
  ],
};
