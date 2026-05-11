import type { Course } from "@/types/content";
import { week01 } from "./week-01";
import { week02 } from "./week-02";

export const blockchainFundamentalsCourse: Course = {
  id: "blockchain-fundamentals",
  slug: "blockchain-fundamentals",
  title: "Blockchain Fundamentals",
  subtitle:
    "Cryptography, consensus, and the EVM mental model — the substrate every smart contract sits on.",
  description:
    "Two focused weeks on the cryptography and execution model that underlie every blockchain. Hashes, signatures, Merkle trees, consensus, the EVM. By the end you can read EVM bytecode at a high level and reason about gas costs from first principles.",
  durationWeeks: 2,
  level: "intermediate",
  progressionLevel: "intermediate",
  discipline: "blockchain",
  audience:
    "Engineers moving from web2 to protocol work who want the substrate, not just the syntax.",
  outcomes: [
    "Explain ECDSA signing, hash functions, and Merkle proofs from first principles.",
    "Read the EVM execution model: stack, memory, storage, calldata.",
    "Estimate gas costs from opcode-level reasoning.",
    "Understand consensus families and their security assumptions.",
  ],
  prerequisites: [
    "Comfortable with one programming language.",
    "Basic math comfort with mod arithmetic.",
  ],
  prerequisiteCourses: [],
  accent: "indigo",
  authoredBy: "Adedamola Maxwell",
  lastUpdated: "2026-05-10",
  weeks: [week01, week02],
  projects: [
    {
      id: "bc-p1",
      title: "Verify a Merkle proof in TypeScript",
      summary:
        "Implement a Merkle tree and proof verifier, then use it to verify an actual Ethereum transaction proof.",
      difficulty: "intermediate",
      deliverables: [
        "Merkle tree implementation",
        "Proof generation + verification",
        "Real-world verification against an Ethereum block",
      ],
      estimatedHours: 5,
      unlocksAfter: "week-01",
    },
  ],
  capstone: {
    title: "Read the EVM",
    summary:
      "Take three real Solidity contracts and produce a written gas-cost analysis from the bytecode and execution model.",
    deliverables: [
      "Gas analysis of three contracts",
      "Annotated bytecode walkthrough",
      "Optimization recommendations",
    ],
  },
};
