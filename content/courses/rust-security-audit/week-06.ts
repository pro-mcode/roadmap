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

export const week06: Week = {
  id: "week-06",
  number: 6,
  title: "Audit methodology and threat modeling",
  stage: "Security Research Workflow",
  summary:
    "How a senior auditor structures a review. The methodology that turns instinct into a repeatable, defendable process.",
  objectives: [
    "Apply a repeatable methodology to any new contract.",
    "Build threat models that are concrete enough to drive testing.",
    "Document findings in audit-report style with severity and impact.",
    "Run an effective audit kickoff with the protocol team.",
  ],
  concepts: [
    "Threat modeling: actors, assets, attack surface",
    "Severity rubrics: critical, high, medium, low, informational",
    "Finding lifecycle: discovery, validation, fix, retest",
    "Time budgeting and triage",
    "Communicating with engineering teams during an audit",
  ],
  deliverables: [
    "A reusable threat-modeling template adapted for DeFi protocols.",
    "A sample audit report on a small contract you reviewed.",
    "An audit-kickoff checklist for the first call with a protocol team.",
  ],
  reviewGate:
    "Given a brand-new contract, can you produce a coherent threat model within 2 hours?",
  stack: ["Audit methodology", "Solidity", "Documentation"],
  modules: [
    {
      id: "w06-m1",
      title: "From contract to threat model",
      summary:
        "A great audit starts with a clear picture of who attacks and what they want.",
      lessons: [
        {
          id: "w06-l1",
          slug: "threat-modeling-defi",
          title: "Threat modeling DeFi protocols",
          summary:
            "Identify actors, assets, and attack surfaces. Most audit findings come from systematic enumeration, not flashes of insight.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["threat-modeling", "audit"],
          blocks: blocks(
            h2("STRIDE for smart contracts"),
            ul([
              "Spoofing: can someone impersonate another address through tx.origin, signature replay, or relayed calls?",
              "Tampering: can on-chain or off-chain inputs be manipulated mid-transaction?",
              "Repudiation: can an actor deny actions they've committed?",
              "Information disclosure: are there leaks via events, public state, or inferred history?",
              "Denial of service: can attacker block honest users via gas griefing, blocked withdrawals, or stuck state?",
              "Elevation of privilege: can a non-admin gain admin rights, or one role escalate to another?",
            ]),
            h3("Actors and assets"),
            p(
              "List every actor (user, LP, admin, oracle, governance, attacker) and the assets they hold or can move. For each (actor, action) pair, ask: what's the worst they can do, and what stops them?",
            ),
            callout(
              "insight",
              "An audit is really a structured check that the contract enforces every assumption it documents — and that every assumption it doesn't document is irrelevant to safety.",
            ),
          ),
        },
        {
          id: "w06-l2",
          slug: "audit-report-writing",
          title: "Writing audit findings that get fixed",
          summary:
            "A good finding is reproducible, prioritized, and accompanied by a fix. We'll look at the structure that audit firms have converged on.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["reporting", "audit"],
          blocks: blocks(
            h2("Finding template"),
            ul([
              "Title: the symptom in one line.",
              "Severity: with a severity rubric the team has agreed on.",
              "Description: the technical problem with code references.",
              "Proof of concept: a Foundry test that demonstrates the bug.",
              "Impact: who loses what, and how much.",
              "Recommendation: a concrete fix the team can ship.",
              "Status: open / acknowledged / fixed / wont-fix.",
            ]),
            code(
              "text",
              `[H-1] Read-only reentrancy via virtualPrice during liquidity removal

Severity: HIGH
Files: src/Vault.sol:42, src/Oracle.sol:18

Description:
  removeLiquidity() invokes Curve's pool.remove_liquidity(), which calls back
  into the user's contract via the ETH transfer. While the callback is on the
  stack, pool.virtualPrice() returns a stale value. Vault.totalAssets() reads
  this value and uses it to mint shares.

Proof of concept: see test/H1_ReadOnlyReentrancy.t.sol

Impact:
  Attacker drains $X by minting shares at a stale price during their own
  withdrawal callback.

Recommendation:
  Either (a) wrap totalAssets() with a Curve admin-fee lock check, or
  (b) use the time-locked snapshot price feed instead of spot virtualPrice.`,
              "An audit finding written for action.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w06-l2-1",
              level: "senior",
              category: "Audit reporting",
              question:
                "How do you decide between High and Medium severity?",
              modelAnswer:
                "Use a two-axis rubric: impact (how much value at risk, how many users affected) × likelihood (how easy is it to exploit, what conditions are required). High = realistic exploit + significant value. Medium = either restrictive preconditions, limited value, or both. Be explicit about the rubric in the report so the team can apply it themselves on future findings. The worst audit reports treat severity as opinion; the best treat it as a function of the rubric and the facts.",
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
      category: "Audit process",
      question:
        "How do you triage a 5,000-line audit with two weeks of budget?",
      modelAnswer:
        "Day 1: read README, tests, threat model, stakeholder priorities. Day 2: map every external function and assign attack-surface scores. Days 3-7: deep review of highest-surface functions, taking notes on every assumption. Days 8-10: write Foundry tests for suspected vulns, validate or rule out. Days 11-12: secondary sweep using Slither/Mythril for known patterns. Days 13-14: report writing, severity discussion, fix recommendations. Always reserve at least 20% of budget for the unexpected — the deepest findings come from the second read.",
    },
  ],
  productionInsights: [
    {
      title: "Write down assumptions as you read",
      summary:
        "Half of bugs hide in unstated assumptions.",
      details:
        "While reading, every time you mentally say 'this works because X is true', write X down. By the end of the audit, you have a list of dozens of assumptions. Test each one. Several will be invariants you can encode as Foundry invariant tests; many will be conditions the protocol forgot to enforce on-chain.",
    },
  ],
};
