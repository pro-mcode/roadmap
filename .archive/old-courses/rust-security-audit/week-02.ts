import type { Week } from "@/types/content";
import { blocks, callout, code, h3, p } from "@/content/courses/_helpers";
export const week02: Week = {
  id: "week-02",
  number: 2,
  title: "Traits, generics, and idiomatic Rust",
  stage: "Rust Engineering",
  summary:
    "Traits are Rust's interface system. Generics + traits unlock the abstraction power Rust is known for — without sacrificing zero-cost abstraction.",
  objectives: [
    "Define and implement traits idiomatically.",
    "Use generics with trait bounds to write flexible, monomorphized code.",
    "Distinguish static dispatch (impl Trait, generics) from dynamic dispatch (dyn Trait).",
    "Read complex bounds like `where T: Send + Sync + 'static` fluently.",
  ],
  concepts: [
    "Traits, trait objects, supertraits",
    "Generics, monomorphization, code bloat",
    "Associated types vs generic parameters",
    "From / Into / TryFrom conversion traits",
    "Marker traits: Send, Sync, Sized, Copy",
  ],
  deliverables: [
    "A trait + generic library that implements a small parser combinator.",
    "Notes comparing the same algorithm written with generics vs trait objects.",
    "Refactor of a Rust crate's API using From/Into ergonomics.",
  ],
  reviewGate:
    "Can you justify a choice of generics vs `dyn Trait` for a function from first principles?",
  stack: ["Rust", "Cargo", "Crates.io"],
  modules: [
    {
      id: "w02-m1",
      title: "Traits and generics",
      summary: "Where Rust starts feeling powerful instead of just safe.",
      lessons: [
        {
          id: "w02-l1",
          slug: "traits-and-impls",
          title: "Traits, impls, and idiomatic patterns",
          summary:
            "Define behavior, then implement it for any type — including types you don't own (with a few rules).",
          estimatedMinutes: 35,
          difficulty: "intermediate",
          tags: ["rust", "traits"],
          blocks: blocks(
            code(
              "rust",
              `pub trait Encoder {
    type Error;
    fn encode(&self, bytes: &[u8]) -> Result<Vec<u8>, Self::Error>;
}

pub struct Hex;
impl Encoder for Hex {
    type Error = std::convert::Infallible;
    fn encode(&self, bytes: &[u8]) -> Result<Vec<u8>, Self::Error> {
        Ok(bytes.iter().flat_map(|b| format!("{:02x}", b).into_bytes()).collect())
    }
}`,
              "Trait with an associated type, implemented for a unit struct.",
            ),
            h3("Orphan rule"),
            p(
              "You can implement Trait for Type only if at least one of them is local to your crate. This prevents two crates from conflicting on a foreign impl. Workarounds include the newtype pattern: wrap the foreign type in a local tuple struct.",
            ),
            callout(
              "insight",
              "Associated types vs generic parameters: pick associated types when there's exactly one sensible value per impl (Iterator::Item), and generic parameters when callers should choose (From<T>).",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w02-l1-1",
              level: "senior",
              category: "Rust",
              question:
                "When would you reach for `dyn Trait` instead of generics?",
              modelAnswer:
                "Generics monomorphize: each call site gets its own specialized copy. That's fast but bloats the binary and can slow compile times. `dyn Trait` uses a vtable, which adds an indirection but keeps the binary small and lets you store heterogeneous types in a Vec<Box<dyn Trait>>. Reach for `dyn` when you need runtime polymorphism (e.g. plugin systems, command dispatchers) and stick with generics for hot inner loops.",
            },
          ],
        },
        {
          id: "w02-l2",
          slug: "from-into-tryfrom",
          title: "From / Into / TryFrom — the ergonomics of conversions",
          summary:
            "The conversion traits that make idiomatic Rust feel light. Implement From, get Into for free.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["rust", "ergonomics"],
          blocks: blocks(
            code(
              "rust",
              `struct UserId(u64);

impl From<u64> for UserId {
    fn from(value: u64) -> Self { Self(value) }
}

fn lookup(id: impl Into<UserId>) {
    let id: UserId = id.into();
    /* ... */
}

lookup(42u64);                   // ✅ via From<u64>
lookup(UserId(42));              // ✅ identity`,
              "From/Into makes call sites read like English.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w02-set-1",
      level: "senior",
      category: "Rust",
      question:
        "Explain Send and Sync and how they interact with concurrency.",
      modelAnswer:
        "Send means a type can be transferred to another thread (its bytes are safe to move). Sync means &T can be shared across threads. They're auto-traits: the compiler infers them from struct fields. A Vec<T> is Send + Sync iff T is. The famous offenders are Rc (not Send because of non-atomic refcount) and RefCell (not Sync because of single-threaded interior mutability). Their thread-safe equivalents are Arc and Mutex/RwLock.",
    },
  ],
  productionInsights: [
    {
      title: "Don't over-trait",
      summary:
        "Every trait is a contract. Adding bounds compounds the maintenance surface.",
      details:
        "A library that requires `T: Send + Sync + Clone + Default + 'static` excludes a huge fraction of legitimate users. Start with the minimum bounds the implementation actually needs and add only what's required. Over-bounded APIs are the smell of premature abstraction.",
    },
  ],
};
