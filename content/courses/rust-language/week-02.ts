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
  title: "Async Rust and concurrency",
  stage: "Applied",
  summary:
    "Tokio, Send/Sync, channels, structured concurrency. The patterns behind every production Rust service.",
  objectives: [
    "Use tokio to write async servers and clients.",
    "Reason about Send and Sync bounds in generic code.",
    "Pick the right channel: mpsc, oneshot, broadcast, watch.",
    "Shut tasks down cleanly with cancellation tokens.",
  ],
  concepts: [
    "Async/await, Future, Pin",
    "tokio runtime, tasks",
    "Send/Sync, Arc<Mutex<T>>",
    "Channels and cancellation",
  ],
  deliverables: [
    "TCP echo server in tokio with bounded concurrency.",
    "Graceful shutdown via CancellationToken.",
  ],
  reviewGate:
    "Why does spawning an async block sometimes require Send and sometimes not?",
  stack: ["tokio", "tracing"],
  modules: [
    {
      id: "rust-w02-m1",
      title: "Async patterns",
      summary: "What you'll meet in any tokio codebase.",
      progression: "core",
      lessons: [
        {
          id: "rust-w02-l1",
          slug: "tokio-basics",
          title: "Tokio basics: tasks, channels, select!",
          summary:
            "Tasks are cheap. select! waits on multiple futures. Channels coordinate them.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["tokio", "async"],
          blocks: blocks(
            code(
              "rust",
              `use tokio::sync::mpsc;
use tokio_util::sync::CancellationToken;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel::<u64>(64);
    let cancel = CancellationToken::new();

    let producer = {
        let tx = tx.clone();
        let cancel = cancel.clone();
        tokio::spawn(async move {
            for i in 0..1000 {
                tokio::select! {
                    _ = cancel.cancelled() => return,
                    _ = tx.send(i) => {},
                }
            }
        })
    };

    while let Some(v) = rx.recv().await {
        if v == 500 { cancel.cancel(); }
    }
    let _ = producer.await;
}`,
              "Channel + cancellation token = clean shutdown.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-rust-w02-set-1",
      level: "senior",
      category: "Rust async",
      question:
        "An async function holds a MutexGuard across an .await. Why is that a bug?",
      modelAnswer:
        "MutexGuard from std::sync isn't Send, so holding it across an .await prevents the task from being moved across threads. Worse: if the executor pauses the task while the guard is held, no one else can take the lock until that task resumes, which can deadlock. Use tokio::sync::Mutex when you need to hold the guard across await points, or restructure to drop the std::sync::Mutex guard before awaiting.",
    },
  ],
  productionInsights: [
    {
      title: "Cancellation is a first-class API",
      summary:
        "Tasks that can't be cancelled accumulate forever.",
      details:
        "Pass a CancellationToken or AbortHandle to every spawned task. On SIGTERM, cancel the root token; child tokens propagate the signal. This is the difference between a binary that exits in 200ms and one that hangs for 30 seconds during deploys.",
    },
  ],
};
