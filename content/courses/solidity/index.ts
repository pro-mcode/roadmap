import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";

export const solidityCourse: Course = {
  id: "solidity",
  slug: "solidity",
  title: "Solidity",
  subtitle:
    "Author Solidity at production quality — the patterns auditors expect, the anti-patterns they flag.",
  description:
    "Two weeks of Solidity at the depth a senior protocol engineer needs. Language features, ERC standards, upgradeability, access control, and the patterns that hold up under audit.",
  durationWeeks: 2,
  level: "intermediate",
  progressionLevel: "intermediate",
  discipline: "blockchain",
  audience:
    "Engineers writing or reviewing Solidity professionally.",
  outcomes: [
    "Author ERC-20/721/4626 contracts at audit quality.",
    "Apply checks-effects-interactions consistently.",
    "Implement upgradeable contracts with safe storage layouts.",
    "Design access control with explicit role taxonomy.",
  ],
  prerequisites: [
    "Comfortable with one statically typed language.",
    "Familiar with EVM basics (or take Blockchain Fundamentals first).",
  ],
  prerequisiteCourses: ["blockchain-fundamentals"],
  accent: "amber",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02],
  projects: [
    {
      id: "sol-p1",
      title: "ERC-20 + ERC-4626 vault",
      summary:
        "Author a yield-bearing vault with deposit, withdraw, and exchange-rate accounting that survives a fuzz suite.",
      difficulty: "senior",
      deliverables: [
        "ERC-4626 implementation",
        "Foundry test suite incl. fuzz",
        "Documented invariants",
      ],
      estimatedHours: 10,
      unlocksAfter: "week-02",
    },
  ],
  capstone: {
    title: "Upgradeable AccessControlled vault",
    summary:
      "An upgradeable vault with a role taxonomy, reentrancy guards, and a full Foundry/Echidna invariant suite.",
    deliverables: [
      "Transparent or UUPS proxy with storage gaps",
      "Role-based access control",
      "Invariant test suite",
    ],
  },
};
