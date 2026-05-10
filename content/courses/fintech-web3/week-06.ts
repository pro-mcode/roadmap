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

export const week06: Week = {
  id: "week-06",
  number: 6,
  title: "Payment systems: orchestration, ledgers, and reconciliation",
  stage: "Fintech Systems",
  summary:
    "We move from generic backend systems into payment-specific architecture: how money is authorized, captured, settled, and reconciled — and what every state means.",
  objectives: [
    "Model payment lifecycles as explicit state machines.",
    "Implement double-entry ledgers with strict invariants.",
    "Build reconciliation workers that detect drift between provider and ledger.",
    "Design retry, idempotency, and saga patterns specific to money movement.",
  ],
  concepts: [
    "Authorization, capture, settlement, payout, refund, reversal",
    "Double-entry accounting, debit-credit invariants",
    "Idempotency keys, deterministic retries",
    "Reconciliation: complete, timely, auditable",
    "Saga patterns: compensations vs forward recovery",
  ],
  deliverables: [
    "Ledger schema with debit-credit posting and balance sheet view.",
    "Payment state machine with documented transitions.",
    "Daily reconciliation job comparing provider settlement file to internal ledger.",
  ],
  reviewGate:
    "Can your books close at end-of-day with zero discrepancy without manual SQL?",
  stack: ["PostgreSQL", "BullMQ", "Provider webhooks"],
  modules: [
    {
      id: "w06-m1",
      title: "Ledgers, the actual core of fintech",
      summary:
        "Everything else is a feature on top of a correctly designed ledger.",
      lessons: [
        {
          id: "w06-l1",
          slug: "double-entry-ledgers",
          title: "Double-entry ledgers from first principles",
          summary:
            "The 700-year-old accounting model your modern fintech still depends on. We'll implement it cleanly in Postgres.",
          estimatedMinutes: 40,
          difficulty: "senior",
          tags: ["ledger", "accounting", "postgres"],
          blocks: blocks(
            h2("Why double-entry"),
            p(
              "Every event in a financial system has two sides: where the money came from and where it went. Recording both halves makes the ledger self-balancing. Sum the debits, sum the credits, and they must equal — at every point in time, for every account, forever.",
            ),
            code(
              "sql",
              `CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('asset','liability','equity','revenue','expense')),
  currency TEXT NOT NULL
);

CREATE TABLE entries (
  id UUID PRIMARY KEY,
  txn_id UUID NOT NULL,
  account_id UUID NOT NULL REFERENCES accounts(id),
  direction CHAR(1) NOT NULL CHECK (direction IN ('D','C')),
  amount NUMERIC(19,4) NOT NULL CHECK (amount > 0),
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX entries_account ON entries(account_id, posted_at DESC);
CREATE INDEX entries_txn ON entries(txn_id);`,
              "Minimal but rigorous ledger schema.",
            ),
            h3("The invariant"),
            callout(
              "insight",
              "For every txn_id, sum(D) = sum(C). Enforce it with a deferrable constraint or a transactional check at COMMIT.",
            ),
            code(
              "sql",
              `CREATE OR REPLACE FUNCTION check_txn_balance(txn UUID) RETURNS BOOLEAN AS $$
  SELECT COALESCE(SUM(CASE direction WHEN 'D' THEN amount ELSE -amount END), 0) = 0
  FROM entries WHERE txn_id = txn;
$$ LANGUAGE SQL STABLE;`,
              "A function you can call in tests and at COMMIT.",
            ),
            h3("Posting a payment"),
            code(
              "typescript",
              `// User pays $100 → cash in (asset), revenue out
await db.transaction(async (t) => {
  const txn = randomUUID();
  await t.insert(entries).values([
    { txnId: txn, accountId: cashAccount, direction: "D", amount: 100 },
    { txnId: txn, accountId: revenueAccount, direction: "C", amount: 100 },
  ]);
  await t.execute(sql\`SELECT check_txn_balance(\${txn})\`);
});`,
              "A balanced posting in a single transaction.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w06-l1-1",
              level: "senior",
              category: "Ledgers",
              question:
                "Why don't fintechs just keep balances in an `accounts.balance` column?",
              modelAnswer:
                "Because storing balances loses history and makes corrections impossible. Double-entry stores immutable entries and derives balance as the sum. You can replay state at any point in time, audit any change, and never have to 'guess' what a balance should be after a bug. For performance, materialize balances per account into a `balances` table that's incrementally updated by an outbox worker — the entries table remains the source of truth.",
            },
          ],
        },
        {
          id: "w06-l2",
          slug: "payment-lifecycle",
          title: "The payment lifecycle as a state machine",
          summary:
            "Authorization → capture → settlement → payout. Each transition is a place where money briefly exists in two states; modeling them explicitly is how you prevent edge cases.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["payments", "state-machines"],
          blocks: blocks(
            diagram(
              `PENDING ─▶ AUTHORIZED ─▶ CAPTURED ─▶ SETTLED ─▶ PAID_OUT
   │            │              │             │
   ▼            ▼              ▼             ▼
 FAILED      VOIDED         REFUNDED      DISPUTED ─▶ CHARGEBACK`,
              "Payment state machine",
              "Each arrow is an explicit transition; each node has explicit guards.",
            ),
            ul([
              "Authorization places a hold on the customer's bank — money is reserved but not moved.",
              "Capture commits the hold, becoming an actual debit on their account.",
              "Settlement happens later (T+1, T+2…) when the network moves funds to the merchant.",
              "Payout is when the merchant pulls funds from the processor account into their bank.",
            ]),
            callout(
              "tradeoff",
              "Auto-capture or two-phase capture? Auto-capture simplifies your code; two-phase reduces fraud loss but doubles your edge-case surface.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w06-l2-1",
              level: "senior",
              category: "Payments",
              question:
                "How do you handle a webhook that arrives out of order — e.g. 'captured' before 'authorized'?",
              modelAnswer:
                "Persist every webhook with its provider event id and timestamp. Apply state transitions only if the source state is reachable from the current state; otherwise queue the webhook for re-evaluation. After a configurable window, alert if a 'captured' webhook is still waiting on its 'authorized' predecessor. Never silently drop. Idempotency on event id prevents duplicates.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w06-set-1",
      level: "senior",
      category: "Reconciliation",
      question:
        "Walk me through the architecture of a reconciliation job for a card processor.",
      modelAnswer:
        "Each day the processor publishes a settlement file (CSV or NDJSON) with every transaction. Your job downloads it, parses each row, and matches against your ledger entries via a stable correlation id (typically the processor's payment id). Output: a 3-bucket report — matched, missing-locally (you didn't process it), missing-remotely (you think you did, processor doesn't see it). Each bucket has a remediation playbook. Run on a schedule, alert on any bucket > 0 after grace period, and write all results to immutable object storage for audit.",
    },
  ],
  productionInsights: [
    {
      title: "Idempotency is not optional",
      summary:
        "Every external call must carry an idempotency key the provider can dedupe on.",
      details:
        "If a network blip causes a duplicate POST and the provider charges twice, you cannot make the user whole without painful manual ops. Generate a UUIDv7 idempotency key per logical operation and reuse it on every retry of the same operation. The provider returns the same result; your ledger stays clean.",
    },
  ],
};
