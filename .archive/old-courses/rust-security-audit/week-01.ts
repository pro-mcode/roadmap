import type { Week } from "@/types/content";
import { blocks, callout, code, h2, h3, p } from "@/content/courses/_helpers";
export const week01: Week = {
  id: "week-01",
  number: 1,
  title: "Rust foundations: ownership, borrowing, and lifetimes",
  stage: "Rust Engineering",
  summary:
    "The mental model that makes Rust click. Ownership, borrowing, and lifetimes are the safety theorem the rest of the language proves on top of.",
  objectives: [
    "Explain ownership, moves, and copies — and why they exist.",
    "Read borrow-checker errors and translate them into structural insight.",
    "Reason about lifetimes without resorting to fighting the compiler.",
    "Build small, idiomatic programs that compile clean and own their memory clearly.",
  ],
  concepts: [
    "Stack vs heap, RAII, drop semantics",
    "Move semantics, Copy types, Clone trait",
    "Shared (&T) vs mutable (&mut T) borrows",
    "Lifetimes: 'a, 'static, lifetime elision",
    "Slices, references, and the language of ownership",
  ],
  deliverables: [
    "A small CLI tool that round-trips data through structs without unnecessary clones.",
    "Ownership annotation diagrams for three real Rust crates you read.",
    "Notes on the five borrow-checker errors that confused you most.",
  ],
  reviewGate:
    "Can you explain to a teammate why a function returning a reference to a local variable can't compile, and what the correct fix is?",
  stack: ["Rust", "Cargo", "rust-analyzer"],
  modules: [
    {
      id: "w01-m1",
      title: "Ownership in detail",
      summary:
        "The single most distinctive feature of Rust. Don't move past it until it's intuitive.",
      lessons: [
        {
          id: "w01-l1",
          slug: "ownership-and-moves",
          title: "Ownership, moves, and the compiler's contract",
          summary:
            "Every value has exactly one owner. When ownership transfers, the source is no longer usable. This single rule prevents a category of bugs you'll never have to debug.",
          estimatedMinutes: 35,
          difficulty: "beginner",
          tags: ["rust", "ownership"],
          blocks: blocks(
            h2("The contract"),
            p(
              "Each value in Rust has exactly one owner. When the owner goes out of scope, the value is dropped. Assigning or passing a non-Copy value transfers ownership; the source variable becomes unusable. This is what `cannot use after move` is telling you.",
            ),
            code(
              "rust",
              `fn main() {
    let s = String::from("hello"); // s owns the heap allocation
    let t = s;                     // ownership moves to t; s is gone
    // println!("{}", s);          // ❌ compile error: borrow of moved value
    println!("{}", t);             // ✅
} // t goes out of scope; allocation freed`,
              "Move semantics, the simplest example.",
            ),
            h3("Copy vs Move"),
            p(
              "Primitives like i32 are Copy — assignment duplicates the bits and both variables remain valid. Heap-owning types like String, Vec, and Box are Move-only — duplication would risk a double-free, so the compiler refuses.",
            ),
            callout(
              "insight",
              "When you call .clone(), you are paying for a copy. Often it's right; often it's a smell that the function should have taken a borrow instead.",
            ),
            h3("Borrows"),
            code(
              "rust",
              `fn print_len(s: &String) {            // borrow, doesn't take ownership
    println!("{} chars", s.len());
}

fn main() {
    let s = String::from("hello");
    print_len(&s);                         // s still owns after the call
    println!("{}", s);                     // ✅
}`,
              "Borrows are the Rust equivalent of 'pass by reference, no transfer'.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w01-l1-1",
              level: "intermediate",
              category: "Rust",
              question:
                "Explain why this signature is suspect: `fn process(data: String) -> String`",
              modelAnswer:
                "Taking ownership of a String forces the caller to give it up; if process doesn't actually need ownership, this is a wasted move. Returning a String forces a heap allocation. Better signatures depending on intent: `fn process(data: &str) -> String` if you produce a new value, or `fn process(data: &mut String)` if you mutate in place. Choosing the right reference type is one of the biggest readability/perf wins in Rust.",
            },
          ],
        },
        {
          id: "w01-l2",
          slug: "lifetimes",
          title: "Lifetimes without fear",
          summary:
            "A lifetime is a label that tells the compiler 'this reference is valid while X is alive'. Most code never names them; when you do, it's because you're describing a relationship that elision can't infer.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["rust", "lifetimes"],
          blocks: blocks(
            code(
              "rust",
              `// "the returned reference lives at least as long as both inputs"
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}`,
              "The first lifetime annotation most Rust programmers write.",
            ),
            p(
              "Lifetime elision rules cover the common cases: a single input reference's lifetime flows to the output; methods inherit the receiver's lifetime. When the compiler can't infer, you annotate. The compiler's job is to ensure no reference outlives its referent.",
            ),
            callout(
              "tip",
              "If you find yourself adding `'static` everywhere, stop. 'static usually means you're making a structural error — perhaps holding a reference where you should hold an owned value, or vice versa.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w01-l2-1",
              level: "senior",
              category: "Rust",
              question:
                "When does the borrow checker reject code that is actually correct?",
              modelAnswer:
                "Two famous patterns: (1) self-referential structs, where a field references another field of the same struct; (2) interior mutation across borrows, e.g. iterating over a Vec and pushing into it during iteration. The compiler cannot prove safety in either case. Solutions: rearchitect (separate the data and the references), use crates like `ouroboros` or `pin-project` carefully, or accept a `RefCell` / `Rc<RefCell<…>>` runtime check. Senior Rust programmers know when to reach for these and when to reshape the data instead.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w01-set-1",
      level: "senior",
      category: "Rust mindset",
      question:
        "Why do auditors and security researchers favor Rust for tooling?",
      modelAnswer:
        "Rust's type system catches a category of memory-safety bugs that C and C++ shipped for decades, without imposing GC pauses or runtime overhead. For tools that parse adversarial input (decompilers, fuzzers, audit infrastructure), this is the difference between a tool that hardens you and a tool that becomes the next attack vector. Rust also has excellent FFI for integrating with existing C tooling and a healthy crate ecosystem for the kinds of work auditors care about (parsing, analysis, cryptography).",
    },
  ],
  productionInsights: [
    {
      title: "Read errors as proofs, not as obstacles",
      summary:
        "The borrow checker is a theorem prover. When it rejects your code, it has discovered a property your design violates.",
      details:
        "Beginners read 'cannot borrow as mutable' and curse. Senior engineers read it and see the design flaw: 'I'm trying to read and write the same thing simultaneously, which is exactly the bug I want to prevent.' Treat each error as a structural insight; over a few months, your designs converge to ones the compiler simply accepts.",
    },
  ],
};
