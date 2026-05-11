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
  title: "Solidity language and ERC standards",
  stage: "Language",
  summary:
    "Solidity's quirks, the ERC standards, and the idioms that distinguish junior from production code.",
  objectives: [
    "Write Solidity that's idiomatic, not just compilable.",
    "Implement ERC-20, ERC-721, and ERC-4626 from scratch with awareness of the spec.",
    "Use custom errors and reverts cleanly.",
    "Pass a senior-level code review on a small contract.",
  ],
  concepts: [
    "Solidity types, visibility, storage layout",
    "Custom errors vs strings",
    "ERC-20/721/4626 spec edges",
    "Events for off-chain indexing",
  ],
  deliverables: [
    "ERC-20 with custom errors and Solady-style storage packing.",
    "ERC-4626 stub with the four required hooks.",
  ],
  reviewGate:
    "Show me a Solidity function and I'll find three improvements. Can you anticipate them?",
  stack: ["Solidity ^0.8", "Foundry"],
  modules: [
    {
      id: "sol-w01-m1",
      title: "Solidity, the way auditors read it",
      summary: "Compact, intent-revealing, free of hidden assumptions.",
      progression: "core",
      lessons: [
        {
          id: "sol-w01-l1",
          slug: "custom-errors",
          title: "Custom errors and explicit reverts",
          summary:
            "String errors burn gas and obscure intent. Custom errors are typed, cheap, and easy to test against.",
          estimatedMinutes: 20,
          difficulty: "intermediate",
          tags: ["solidity"],
          blocks: blocks(
            code(
              "solidity",
              `error InsufficientBalance(uint256 have, uint256 need);
error Frozen(address account);

function withdraw(uint256 amount) external {
    uint256 bal = balanceOf[msg.sender];
    if (bal < amount) revert InsufficientBalance(bal, amount);
    if (frozen[msg.sender]) revert Frozen(msg.sender);
    // ...
}`,
              "Custom errors with structured arguments.",
            ),
            callout(
              "tip",
              "In Foundry, vm.expectRevert(InsufficientBalance.selector) or with abi.encodeWithSelector for tests against specific argument values.",
            ),
          ),
        },
        {
          id: "sol-w01-l2",
          slug: "erc-4626",
          title: "ERC-4626: tokenized vault standard",
          summary:
            "Four hooks and a careful exchange-rate accounting trick. Get this right and every yield aggregator will integrate with you.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["erc-4626"],
          blocks: blocks(
            ul([
              "convertToShares / convertToAssets must be view and free of state changes.",
              "deposit/mint mint shares to receiver; withdraw/redeem burn shares from owner.",
              "Inflation/donation attacks are a known footgun — read the OZ implementation comments before rolling your own.",
            ]),
            callout(
              "warning",
              "Inflation attack: an attacker donates assets to the vault before a victim's first deposit, manipulating the share price so the victim's deposit rounds down to zero shares. Use a virtual-shares offset (OZ's approach) or require a minimum first deposit.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-sol-w01-l2-1",
              level: "senior",
              category: "Solidity",
              question:
                "Explain the ERC-4626 inflation attack and the mitigation.",
              modelAnswer:
                "Before the first depositor, an attacker mints 1 wei of shares (by being first), then donates a large amount of the underlying asset directly to the vault. The price per share becomes huge. When the victim deposits, shares = assets * totalSupply / totalAssets rounds down, often to zero. The victim's funds remain in the vault, accessible by the attacker via their 1-wei share. Mitigation: virtual offset (treat totalSupply and totalAssets as having a hidden +1 each, OZ-style) or require a meaningful minimum first deposit that's permanently locked.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Events are the contract's API to the off-chain world",
      summary:
        "Indexed parameters give indexers cheap filters.",
      details:
        "Every state change worth knowing about should emit an event with the right indexed parameters. Indexers will love you; downstream integrations will be trivial.",
    },
  ],
};
