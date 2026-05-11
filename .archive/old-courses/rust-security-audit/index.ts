import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";
import { week03 } from "./week-03";
import { week04 } from "./week-04";
import { week05 } from "./week-05";
import { week06 } from "./week-06";
import { week07 } from "./week-07";
import { week08 } from "./week-08";
import { week09 } from "./week-09";
import { week10 } from "./week-10";
import { week11 } from "./week-11";
import { week12 } from "./week-12";

export const rustSecurityCourse: Course = {
  id: "rust-security-audit",
  slug: "rust-security-audit",
  title: "Rust + Smart Contract Security Auditor",
  subtitle:
    "A 12-week specialized path for engineers becoming Rust-fluent smart contract security auditors across EVM, Solana, CosmWasm, and NEAR.",
  description:
    "This roadmap is built for engineers who want to do security work — not just learn about it. We start with Rust fundamentals deep enough to read tooling and async runtimes, climb into EVM internals and Solidity audit-depth, work through every canonical vulnerability class, then expand into Rust contract ecosystems (Solana/Anchor, CosmWasm, NEAR, Substrate). The final third is methodology: threat modeling, fuzzing, competitive auditing, post-mortem analysis, and the security interview loop.",
  durationWeeks: 12,
  level: "senior",
  audience:
    "Engineers with 2+ years of experience moving into smart contract security audits, security research, or protocol-side security engineering.",
  outcomes: [
    "Read Rust at the depth needed to audit production codebases.",
    "Audit EVM and Rust-based smart contracts with a structured methodology.",
    "Identify, reproduce, and report vulnerabilities at the level expected by top audit firms.",
    "Compete in Code4rena/Sherlock contests with a real shot at top finishes.",
    "Pass senior-level security interviews at audit firms and protocol teams.",
  ],
  prerequisites: [
    "Comfortable in at least one systems-level language (C, C++, Go, or Rust).",
    "Familiarity with HTTP, hashing, and basic cryptography.",
    "Some prior exposure to Solidity or smart contracts is helpful but not required.",
  ],
  accent: "rose",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [
    week01,
    week02,
    week03,
    week04,
    week05,
    week06,
    week07,
    week08,
    week09,
    week10,
    week11,
    week12,
  ],
  capstone: {
    title: "Full audit of a real or simulated DeFi protocol",
    summary:
      "End-to-end audit of a real protocol (or one you build with planted bugs), including report, severity discussion, fix recommendations, and a public writeup.",
    deliverables: [
      "Threat model document",
      "Foundry POC suite reproducing each finding",
      "Audit report formatted for publication",
      "Public writeup published to your portfolio",
      "Mock interview defending the report",
    ],
  },
};
