import type { Week } from "@/types/content";
import { blocks, callout, code, diagram, h2, h3, p } from "@/content/courses/_helpers";
export const week04: Week = {
  id: "week-04",
  number: 4,
  title: "PostgreSQL, Drizzle ORM, and transactional data design",
  stage: "Backend & Infrastructure",
  summary:
    "Postgres is the gravitational center of most fintech stacks. We build the schema discipline, transactional intuition, and migration craft that hold up under audit.",
  objectives: [
    "Design schemas where invariants are enforced by constraints, not application code.",
    "Reason about transactions, isolation levels, and the anomalies they each allow.",
    "Operate Postgres in production: migrations, indexes, vacuum, partitioning.",
    "Use Drizzle ORM as a typed query builder, not a leaky abstraction.",
  ],
  concepts: [
    "ACID, isolation levels, MVCC",
    "Indexes (b-tree, brin, gin), partial indexes, expression indexes",
    "Foreign keys, CHECK constraints, EXCLUSION constraints",
    "Migrations: expand-contract, online schema changes",
    "Drizzle: schema-first, sql tag, prepared queries",
  ],
  deliverables: [
    "Ledger schema enforcing double-entry invariants via CHECK constraints.",
    "Online migration plan converting a varchar status field to an enum without downtime.",
    "Index audit script that flags duplicate or unused indexes.",
  ],
  reviewGate:
    "Can your schema, with the application offline, prove that no account has a negative balance? If the answer is 'we trust the code' you have not finished.",
  stack: ["PostgreSQL", "Drizzle ORM", "TypeScript"],
  modules: [
    {
      id: "w04-m1",
      title: "Constraints over conventions",
      summary:
        "If a rule is invariant, the database should enforce it. Application bugs come and go; database constraints survive.",
      lessons: [
        {
          id: "w04-l1",
          slug: "transactions-and-isolation",
          title: "Transactions and isolation levels",
          summary:
            "Read Committed vs Repeatable Read vs Serializable. The vocabulary that lets you reason about the anomalies your application can suffer.",
          estimatedMinutes: 40,
          difficulty: "intermediate",
          tags: ["postgres", "transactions", "isolation"],
          blocks: blocks(
            h2("The anomalies that level names away"),
            p(
              "An isolation level is a contract: 'these anomalies cannot happen here.' Postgres' default Read Committed allows non-repeatable reads and phantom reads. Repeatable Read (called 'Snapshot Isolation' in Postgres) prevents both but allows write skew. Serializable prevents all of them via SSI, at a cost to throughput when contention is high.",
            ),
            diagram(
              `Anomaly       │ Read Committed │ Repeatable Read │ Serializable
──────────────┼───────────────┼─────────────────┼─────────────
Dirty read    │       no       │       no        │      no
Non-repeat.   │       yes      │       no        │      no
Phantom       │       yes      │       no        │      no
Write skew    │       yes      │       yes       │      no`,
              "Postgres isolation levels",
              "The honest version of what each level guarantees.",
            ),
            h3("Write skew is the one that bites fintech"),
            p(
              "Two concurrent transfers can each verify that 'my account has enough' and both commit, leaving you overdrawn. Repeatable Read won't save you. Either use SELECT ... FOR UPDATE on the row, use SERIALIZABLE, or model the constraint with a CHECK + EXCLUSION pattern.",
            ),
            code(
              "sql",
              `BEGIN ISOLATION LEVEL SERIALIZABLE;

UPDATE accounts SET balance = balance - 100
  WHERE id = 'A' AND balance >= 100
  RETURNING balance;

INSERT INTO transfers (from_id, to_id, amount) VALUES ('A', 'B', 100);
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';

COMMIT;
-- If a serialization failure occurs, application must retry.`,
              "Transferring under SERIALIZABLE — retry on serialization failure.",
            ),
            callout(
              "production",
              "Serialization failures are normal under Serializable. Wrap every txn in a retry helper that backs off on SQLSTATE 40001.",
            ),
          ),
          exercises: [
            {
              id: "w04-l1-e1",
              title: "Reproduce write skew",
              difficulty: "intermediate",
              prompt:
                "Write a small Node script that runs two concurrent transactions under Repeatable Read and demonstrates a write-skew anomaly. Then prove that switching to Serializable causes one of them to abort.",
              acceptanceCriteria: [
                "Two parallel transactions both see balance ≥ 100 and each subtract 100.",
                "Repeatable Read produces a final balance of -100.",
                "Serializable forces a 40001 retry.",
              ],
            },
          ],
          interviewQuestions: [
            {
              id: "iv-w04-l1-1",
              level: "senior",
              category: "Databases",
              question:
                "Why isn't 'Repeatable Read' enough for a transfer? Walk me through write skew with a concrete example.",
              modelAnswer:
                "Repeatable Read takes a snapshot at txn start. Two transactions can each read the same balance and each commit a debit because their snapshots don't see each other's pending writes; the DB has no rule that forbids the combined outcome. SERIALIZABLE detects this via dependency graph cycles and aborts one transaction. Alternatively, lock the row with FOR UPDATE so the second transaction blocks until the first commits.",
            },
          ],
        },
        {
          id: "w04-l2",
          slug: "drizzle-as-query-builder",
          title: "Drizzle as a typed query builder",
          summary:
            "Drizzle gives you a SQL-shaped API with full inference. Treat it as a query builder, not an ORM, and you'll keep the SQL clarity Postgres rewards.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["drizzle", "orm", "typescript"],
          blocks: blocks(
            h2("Schema as the source of truth"),
            code(
              "typescript",
              `import { pgTable, uuid, text, numeric, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull(),
  balance: numeric("balance", { precision: 19, scale: 4 })
    .notNull()
    .default("0"),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  positiveBalance: check("positive_balance", sql\`\${t.balance} >= 0\`),
}));`,
              "A schema with a CHECK constraint that survives application bugs.",
            ),
            h3("Prepared queries for hot paths"),
            p(
              "Drizzle supports prepared statements via `.prepare()`. Use them for queries on the request hot path; they avoid re-parsing on every call and integrate with Postgres' plan cache.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w04-set-1",
      level: "senior",
      category: "Postgres",
      question:
        "Describe an online migration that adds a NOT NULL column with a default to a 100M-row table.",
      modelAnswer:
        "Adding a NOT NULL column with a default rewrites the table in older Postgres versions. In Postgres 11+, a non-volatile default is metadata-only and instant. Otherwise, do it as expand-contract: (1) add the column nullable, (2) backfill in batches with throttling, (3) add a CHECK NOT VALID and VALIDATE CONSTRAINT, (4) finally swap the constraint to NOT NULL. Avoid `ALTER TABLE ... SET DEFAULT` blocking under high write load.",
    },
  ],
  productionInsights: [
    {
      title: "Indexes are not free",
      summary:
        "Each index slows writes and consumes RAM in shared buffers. Audit them quarterly.",
      details:
        "Use `pg_stat_user_indexes` to find indexes with idx_scan = 0. Drop them. Composite indexes are right-leaning — the order of columns matters. A query plan will tell you whether your index is actually being used or whether the planner chose a sequential scan.",
    },
  ],
};
