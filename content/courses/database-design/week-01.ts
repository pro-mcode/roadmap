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
  title: "Relational schema design",
  stage: "Foundations",
  summary:
    "Schemas where the database enforces invariants. Normalization without dogma, constraints as the line of defense, indexes as a deliberate cost.",
  objectives: [
    "Apply normalization through 3NF, then denormalize for known access patterns.",
    "Choose CHECK, UNIQUE, EXCLUDE, and FK constraints as the first line of defense.",
    "Read EXPLAIN ANALYZE output and reason about index selection.",
    "Plan online schema migrations on multi-million-row tables.",
  ],
  concepts: [
    "1NF/2NF/3NF and the cost of going further",
    "Primary keys, surrogate vs natural, ULIDs vs UUIDs",
    "B-tree, hash, GIN, and BRIN indexes",
    "Online migrations: expand → migrate → contract",
  ],
  deliverables: [
    "Ledger schema with constraints that make over-drafts impossible at the database layer.",
    "Three-step plan to add a NOT NULL column to a 100M-row table.",
  ],
  reviewGate:
    "Can you show me a query plan you've read recently and what it told you?",
  stack: ["Postgres", "pgAdmin or psql"],
  modules: [
    {
      id: "db-w01-m1",
      title: "Schemas that defend themselves",
      summary:
        "Constraints inside the database are the strongest guarantees you have.",
      progression: "core",
      lessons: [
        {
          id: "db-w01-l1",
          slug: "constraints-as-defense",
          title: "Constraints as the line of defense",
          summary:
            "Application bugs slip through review. Database constraints do not.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["postgres", "schema"],
          blocks: blocks(
            code(
              "sql",
              `CREATE TABLE ledger_entries (
  id           BIGSERIAL PRIMARY KEY,
  account_id   BIGINT      NOT NULL REFERENCES accounts(id),
  txn_id       UUID        NOT NULL,
  direction    CHAR(1)     NOT NULL CHECK (direction IN ('D','C')),
  amount_minor BIGINT      NOT NULL CHECK (amount_minor > 0),
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- One D and one C per txn, balanced at write time:
CREATE UNIQUE INDEX ON ledger_entries(txn_id, direction);`,
              "A schema where over-drafts and unbalanced txns are physically impossible.",
            ),
            callout(
              "production",
              "Every CHECK constraint is a class of bug your reviewer doesn't have to catch. Use them liberally.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-db-w01-l1-1",
              level: "senior",
              category: "Database",
              question:
                "Why prefer UUID v7 / ULID over UUID v4 as a primary key?",
              modelAnswer:
                "Random UUIDs (v4) make B-tree indexes hot in random pages, fragmenting them and inflating WAL. Time-sortable IDs (v7/ULID) cluster inserts at the tail of the index, keeping it dense and predictable. For high-write tables in Postgres, this is a measurable throughput difference.",
            },
          ],
        },
        {
          id: "db-w01-l2",
          slug: "online-migrations",
          title: "Online migrations: expand-migrate-contract",
          summary:
            "Zero-downtime schema change requires you to think in three deploys, not one.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["migrations", "postgres"],
          blocks: blocks(
            diagram(
              `expand  → add nullable column / new index CONCURRENTLY
migrate → dual-write old + new, backfill in batches
contract→ flip reads, drop the old column`,
              "Three-phase online migration",
            ),
            callout(
              "warning",
              "ALTER TABLE ... ADD COLUMN ... NOT NULL DEFAULT ... rewrites the table in older Postgres. Always test on a snapshot of production-size data.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Read the plan",
      summary:
        "EXPLAIN ANALYZE is your microscope. Run it on every slow query.",
      details:
        "If you can't read a query plan, you're tuning by superstition. Get fluent with seq scan vs index scan, nested loop vs hash join, and the difference between estimated and actual row counts.",
    },
  ],
};
