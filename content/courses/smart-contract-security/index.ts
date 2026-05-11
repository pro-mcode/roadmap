import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";

export const smartContractSecurityCourse: Course = {
  id: "smart-contract-security",
  slug: "smart-contract-security",
  title: "Smart Contract Security",
  subtitle:
    "The vulnerability taxonomy, the audit methodology, and the interview drill — for engineers shipping and reviewing protocol code.",
  description:
    "Two weeks compressing the smart-contract security curriculum: the vulnerability catalogue (reentrancy, oracle manipulation, signature malleability, MEV, access control), a structured audit methodology, and a senior-level interview drill.",
  durationWeeks: 2,
  level: "senior",
  progressionLevel: "advanced",
  discipline: "security",
  audience:
    "Engineers writing or reviewing protocol code, contest-driven auditors, audit-firm hopefuls.",
  outcomes: [
    "Catalogue the top vulnerability classes and recognize them in code.",
    "Run a structured 5-step audit on a target codebase.",
    "Write findings that audit firms accept.",
    "Pass a senior security interview.",
  ],
  prerequisites: [
    "Solid Solidity (see the Solidity course).",
    "EVM mental model (see Blockchain Fundamentals).",
  ],
  prerequisiteCourses: ["solidity", "blockchain-fundamentals"],
  accent: "violet",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02],
  projects: [
    {
      id: "sec-p1",
      title: "Audit a Code4rena past contest",
      summary:
        "Pick a finished contest, run a full audit, then compare your findings to the public report.",
      difficulty: "senior",
      deliverables: [
        "Written findings with severity",
        "Comparison vs the public report",
        "Methodology retrospective",
      ],
      estimatedHours: 12,
      unlocksAfter: "week-02",
    },
  ],
  capstone: {
    title: "Audit report on a protocol of your choice",
    summary:
      "A complete audit report on a real protocol's open-source code. Severity, impact, recommendations, and a methodology section.",
    deliverables: [
      "Findings document",
      "Threat model section",
      "Methodology section",
      "Executive summary",
    ],
  },
};
