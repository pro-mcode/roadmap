import type { Week } from "@/types/content";
import { blocks, callout, code, h2, p, ul } from "@/content/courses/_helpers";
export const week05: Week = {
  id: "week-05",
  number: 5,
  title: "Smart contract vulnerabilities — the catalogue",
  stage: "Blockchain + Smart Contract Security",
  summary:
    "We tour the most common vulnerability classes — what they look like, how to detect them, and the post-mortem of a real exploit for each.",
  objectives: [
    "Recognize and exploit each of the canonical vulnerability classes.",
    "Read and write a vulnerability description in audit-report style.",
    "Build a personal vulnerability checklist used on every contract you review.",
    "Connect each vulnerability class to a real on-chain exploit.",
  ],
  concepts: [
    "Reentrancy (single, cross-function, cross-contract, read-only)",
    "Access control flaws and privileged role abuse",
    "Oracle manipulation and price feed staleness",
    "Signature replay and EIP-712 misuse",
    "Flash-loan attacks and price manipulation",
    "Arithmetic: overflow, division-by-zero, rounding",
    "MEV exploitation: sandwich, frontrunning, JIT liquidity",
    "Upgradeability: proxy slot collision, initializer reentrancy",
    "Governance attacks: token flash-vote, quorum manipulation",
  ],
  deliverables: [
    "Personal vulnerability checklist (markdown) used for every audit.",
    "Three Foundry repros of canonical vulnerabilities with fixes.",
    "Three short writeups of real exploits, in finding-style.",
  ],
  reviewGate:
    "Could you, given a 500-line contract, find at least three plausible attack vectors in 90 minutes?",
  stack: ["Solidity", "Foundry", "Slither"],
  modules: [
    {
      id: "w05-m1",
      title: "Vulnerability classes",
      summary:
        "The catalogue every auditor carries in their head.",
      lessons: [
        {
          id: "w05-l1",
          slug: "access-control-and-roles",
          title: "Access control and privileged roles",
          summary:
            "The simplest bug class and still the most common. We examine what 'admin can rug' actually means and the engineering disciplines that prevent it.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["access-control", "audit"],
          blocks: blocks(
            ul([
              "Missing onlyOwner / onlyRole modifiers.",
              "Initializer functions left unprotected after upgrade.",
              "Privileged operations gated by tx.origin instead of msg.sender.",
              "Multi-role systems with unclear privilege escalation paths.",
              "Single-key admins with no timelock on critical operations.",
            ]),
            code(
              "solidity",
              `// ❌ tx.origin defeats the entire point of access control:
// any contract the admin calls can become 'the admin' for one frame.
modifier onlyOwner() { require(tx.origin == owner); _; }`,
              "tx.origin is always wrong for access control.",
            ),
            callout(
              "production",
              "Admin powers should run through a timelocked multisig. The timelock is what gives users a window to exit if the admin tries something hostile.",
            ),
          ),
        },
        {
          id: "w05-l2",
          slug: "oracle-and-flash-loan",
          title: "Oracle manipulation and flash-loan attacks",
          summary:
            "The class that drained over $1B from DeFi in 2022. Spot prices and shallow liquidity are why.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["oracle", "flash-loan", "defi"],
          blocks: blocks(
            h2("Why flash loans matter to auditors"),
            p(
              "A flash loan lets an attacker borrow effectively unlimited capital for a single transaction, provided they pay it back by the end. This neutralizes the 'they don't have the capital' assumption that older protocols implicitly relied on. Any protocol with a price input that can be perturbed by capital is exploitable.",
            ),
            ul([
              "Spot AMM price as collateral oracle: vulnerable.",
              "Single-source oracle without freshness check: vulnerable.",
              "TWAP < attack window: vulnerable.",
              "Combined oracle (Chainlink + TWAP + deviation guard): generally safe.",
            ]),
            code(
              "solidity",
              `// audit pattern: protocol-side freshness + deviation check
function getPrice() internal view returns (uint256) {
    (, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();
    require(answer > 0, "bad answer");
    require(block.timestamp - updatedAt < heartbeat, "stale price");

    uint256 spot = uint256(answer);
    uint256 twap = oracleTwap();
    uint256 dev = spot > twap ? spot - twap : twap - spot;
    require(dev * 100 / twap < 5, "deviation too large");
    return spot;
}`,
              "A guarded oracle read.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w05-l2-1",
              level: "senior",
              category: "Oracle security",
              question:
                "How does Curve-style read-only reentrancy interact with oracle consumers?",
              modelAnswer:
                "During a Curve liquidity event (add/remove), the pool's virtual price is briefly stale. A malicious actor can construct a callback that reads `get_virtual_price` while the pool is mid-mutation. Any oracle consumer that reads this view as a price suffers a price manipulation without any actual price move. Mitigation: protocols must wrap their price reads in a Curve `claim_admin_fees` lock check or use price-checked snapshots.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w05-set-1",
      level: "senior",
      category: "Audit checklist",
      question:
        "Describe your personal first-pass checklist on a new contract.",
      modelAnswer:
        "Read the README and tests first to understand intent. Map every external/public function — what privilege does it require, what state does it mutate, what value does it move. Identify all external calls and DELEGATECALL sites. Search for non-trivial loops, tight gas, unchecked math, and storage writes after external calls. Map roles and check that every role transition is timelocked. Finally, run Slither and Mythril for known patterns. By the end, you should have a list of every place value can move and every place trust is granted.",
    },
  ],
  productionInsights: [
    {
      title: "Read the test suite",
      summary:
        "What the team didn't test is usually where the bug is.",
      details:
        "Coverage tools lie about depth — a function can be 100% line-covered with one happy-path test. Look for the absence of adversarial tests: did anyone test what happens when the oracle is stale? When a token reverts on transfer? When a user has zero balance? Holes in the test suite are usually holes in the developer's mental model.",
    },
  ],
};
