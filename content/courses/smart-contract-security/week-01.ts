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
  title: "Vulnerability catalogue",
  stage: "Catalogue",
  summary:
    "The vulnerability classes that show up in every audit. Reentrancy, oracle manipulation, signature malleability, access-control errors, MEV.",
  objectives: [
    "Recognize the canonical vulnerability classes in code.",
    "Apply checks-effects-interactions and reentrancy guards correctly.",
    "Reason about oracle manipulation and design around it.",
    "Spot access-control bugs that bypass intended invariants.",
  ],
  concepts: [
    "Reentrancy (single, cross-function, read-only)",
    "Oracle manipulation, TWAPs, single-source risk",
    "Access control mis-design",
    "Signature replay, EIP-712",
    "MEV: front-run, sandwich, JIT liquidity",
  ],
  deliverables: [
    "Annotated copy of a vulnerable contract with each class flagged.",
    "Reentrancy proof-of-exploit in Foundry.",
  ],
  reviewGate:
    "Show me a code snippet with three vulnerabilities. Find all three in 5 minutes.",
  stack: ["Foundry", "Slither"],
  modules: [
    {
      id: "sec-w01-m1",
      title: "The classics",
      summary: "The bugs that have collectively cost the industry billions.",
      progression: "core",
      lessons: [
        {
          id: "sec-w01-l1",
          slug: "reentrancy",
          title: "Reentrancy: single, cross-function, read-only",
          summary:
            "The bug that started security as a discipline. The fixes are well-known; the surface is wider than people remember.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["reentrancy"],
          blocks: blocks(
            code(
              "solidity",
              `function withdraw() external {
    uint256 bal = balances[msg.sender];
    (bool ok, ) = msg.sender.call{value: bal}("");  // ← attacker re-enters here
    require(ok, "send failed");
    balances[msg.sender] = 0;  // too late
}`,
              "Classic single-function reentrancy.",
            ),
            ul([
              "Single-function: as above. Fix: checks-effects-interactions.",
              "Cross-function: re-enter into a DIFFERENT function on the same contract that reads stale state. Fix: per-contract reentrancy guard.",
              "Read-only: a view function returns stale state during reentrancy, mis-pricing collateral elsewhere. Fix: cache + invalidate, or read-only reentrancy guard.",
            ]),
          ),
        },
        {
          id: "sec-w01-l2",
          slug: "oracle-manipulation",
          title: "Oracle manipulation",
          summary:
            "Spot-price oracles can be moved within a single block. TWAPs and circuit breakers are the standard defenses.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["oracle"],
          blocks: blocks(
            ul([
              "Never use a single AMM's spot price for valuation. Flash loans manipulate it for free.",
              "Use Chainlink (or similar) for blue-chip assets; layer in TWAPs for thin markets.",
              "Add circuit breakers: pause when oracle deviation exceeds a threshold.",
            ]),
          ),
          interviewQuestions: [
            {
              id: "iv-sec-w01-l2-1",
              level: "senior",
              category: "Security",
              question:
                "A lending protocol values collateral with a Uniswap V2 spot price. Walk me through the exploit.",
              modelAnswer:
                "Take a flash loan, dump or accumulate against the V2 pool to move the spot price by 30%+, open a position at the manipulated price, restore the pool with the reverse trade, repay the flash loan, walk away with the protocol's funds. Defense: never use spot. Use a Chainlink feed for the underlying asset and add a TWAP fallback. Add hard caps on per-block borrow growth.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Defense in depth",
      summary:
        "No single control is enough.",
      details:
        "Reentrancy guards + CEI + Slither + invariant tests + an audit. Each catches a different class of mistake. The cost of stacking them is small; the cost of relying on any one of them is the next exploit headline.",
    },
  ],
};
