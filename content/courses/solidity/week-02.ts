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
  title: "Access control, upgradeability, and testing",
  stage: "Production patterns",
  summary:
    "The patterns that distinguish hobby contracts from production protocol code: access control, upgradeability, comprehensive testing.",
  objectives: [
    "Design a role taxonomy with explicit risk tiers.",
    "Implement transparent or UUPS proxies with safe storage layouts.",
    "Write Foundry test suites that cover invariants, not just happy paths.",
    "Configure a fuzz / invariant suite that catches the classes of bugs unit tests miss.",
  ],
  concepts: [
    "OZ AccessControl, role hierarchies",
    "Transparent proxies, UUPS, storage gaps",
    "Foundry: forge test, fuzz, invariant",
    "Echidna basics",
  ],
  deliverables: [
    "AccessControlled vault with documented role taxonomy.",
    "UUPS-upgradeable contract with reserved storage gap.",
    "Foundry invariant test that asserts sum-of-balances = totalSupply.",
  ],
  reviewGate:
    "Walk me through your upgrade path and the storage layout you've protected.",
  stack: ["Foundry", "OpenZeppelin", "Solady"],
  modules: [
    {
      id: "sol-w02-m1",
      title: "Production patterns",
      summary: "Patterns that show up in every audit.",
      progression: "advanced",
      lessons: [
        {
          id: "sol-w02-l1",
          slug: "upgradeability",
          title: "Upgradeability, the careful version",
          summary:
            "Upgrades are storage-layout decisions. Get them wrong once and you brick the protocol.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["upgrade", "proxy"],
          blocks: blocks(
            ul([
              "Append-only state variables. Never reorder, never delete.",
              "Use storage gaps in base contracts: uint256[50] __gap;",
              "Verify with OZ upgrades plugin or hardhat-storage-layout.",
              "Test upgrades on a fork before mainnet.",
            ]),
            callout(
              "warning",
              "Every storage-layout bug in upgrades is silent until a user reads the wrong slot. Automated layout checks in CI are non-negotiable.",
            ),
          ),
        },
        {
          id: "sol-w02-l2",
          slug: "invariant-testing",
          title: "Invariant testing with Foundry",
          summary:
            "Unit tests prove what should happen. Invariants prove what must never happen.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["foundry", "invariants"],
          blocks: blocks(
            code(
              "solidity",
              `function invariant_supplyEqualsSumOfBalances() public {
    uint256 sum;
    for (uint i = 0; i < holders.length; i++) {
        sum += token.balanceOf(holders[i]);
    }
    assertEq(sum, token.totalSupply());
}`,
              "An invariant Foundry will hammer with thousands of randomized call sequences.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Roles document risk",
      summary:
        "Map roles to actions explicitly so the threat model is legible.",
      details:
        "When the audit firm reads your code, they should see — not infer — which roles can do which actions. A README table that maps role → action → risk tier saves auditor time and your money.",
    },
  ],
};
