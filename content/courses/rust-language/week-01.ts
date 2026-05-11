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
  title: "Ownership, borrowing, traits",
  stage: "Foundations",
  summary:
    "The mental model that makes Rust click. Ownership, borrowing, lifetimes, traits, and the Result type that gives Rust its error-handling character.",
  objectives: [
    "Reason about move vs borrow vs clone without guessing.",
    "Read lifetime annotations and write them only when needed.",
    "Use traits to abstract; prefer composition to inheritance.",
    "Handle errors with Result<T, E>, ?, and thiserror.",
  ],
  concepts: [
    "Ownership, borrowing, lifetimes",
    "Traits and generic bounds",
    "Result, Option, ? operator",
    "Cargo workspaces and modules",
  ],
  deliverables: [
    "A tiny library with at least one trait and one lifetime annotation.",
    "An error enum using thiserror.",
  ],
  reviewGate:
    "Can you write a function that returns a reference into one of its arguments, with the lifetimes spelled correctly?",
  stack: ["Rust 1.75+"],
  modules: [
    {
      id: "rust-w01-m1",
      title: "The Rust model",
      summary: "What the compiler is teaching you.",
      progression: "foundation",
      lessons: [
        {
          id: "rust-w01-l1",
          slug: "ownership",
          title: "Ownership and borrowing",
          summary:
            "Every value has one owner. Borrows are references with a duration. The compiler enforces both.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["rust", "ownership"],
          blocks: blocks(
            code(
              "rust",
              `fn first_word(s: &str) -> &str {
    for (i, c) in s.char_indices() {
        if c == ' ' { return &s[..i]; }
    }
    s
}`,
              "A borrow returned for the lifetime of the input.",
            ),
            callout(
              "tip",
              "Most lifetime errors come from trying to return a borrow into a temporary. Move ownership out, or clone, or restructure so the borrow's source outlives the return.",
            ),
          ),
        },
        {
          id: "rust-w01-l2",
          slug: "error-handling",
          title: "Error handling: Result and ?",
          summary:
            "Rust treats errors as values. The ? operator threads them through a function with one character.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["rust", "errors"],
          blocks: blocks(
            code(
              "rust",
              `use thiserror::Error;

#[derive(Error, Debug)]
pub enum WalletError {
    #[error("insufficient balance: have {have}, need {need}")]
    Insufficient { have: u64, need: u64 },
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
}

pub fn withdraw(id: u64, amount: u64) -> Result<(), WalletError> {
    let bal = load_balance(id)?;
    if bal < amount {
        return Err(WalletError::Insufficient { have: bal, need: amount });
    }
    save_balance(id, bal - amount)?;
    Ok(())
}`,
              "thiserror gives you idiomatic error types with one annotation.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-rust-w01-l2-1",
              level: "intermediate",
              category: "Rust",
              question: "When would you reach for anyhow over thiserror?",
              modelAnswer:
                "thiserror is for library errors: you want callers to match on specific variants. anyhow is for applications: you want to bubble up errors with context. The convention is libraries expose thiserror enums; binaries use anyhow at the top-level call sites.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Fight the borrow checker once, never again",
      summary:
        "The patterns that defuse most lifetime fights.",
      details:
        "Prefer owned types in public APIs unless you really need a borrow. Use Arc<T> for shared ownership across threads, Rc<RefCell<T>> for single-threaded interior mutability. When stuck, ask: where does this value need to live? The answer usually rewrites the function signature.",
    },
  ],
};
