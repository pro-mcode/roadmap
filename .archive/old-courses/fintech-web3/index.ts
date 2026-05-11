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

export const fintechWeb3Course: Course = {
  id: "fintech-web3",
  slug: "fintech-web3",
  title: "Fintech & Web3 Engineering",
  subtitle:
    "A 12-week structured roadmap for engineers moving into fintech infrastructure, ledgers, smart contracts, and production-grade distributed systems.",
  description:
    "This roadmap is designed for engineers who already write code professionally and want to graduate into building money-moving systems. We start at the network layer, climb through TypeScript and Postgres mastery, work into queues and event-driven systems, then specialize into payments, treasury, web3, and production architecture. Every week is grounded in real-world systems thinking, with interview questions and production insights woven through.",
  durationWeeks: 12,
  level: "intermediate",
  audience:
    "Software engineers with 1-3 years of experience preparing for senior roles at fintech, crypto-native, and distributed systems companies.",
  outcomes: [
    "Build, operate, and review production payment systems with confidence.",
    "Design ledgers, settlement, and treasury workflows that survive audit.",
    "Read Solidity fluently and reason about EVM-level economics and security.",
    "Pass senior-level system design and engineering interviews at top fintech and crypto firms.",
  ],
  prerequisites: [
    "Comfortable with at least one backend language (Node, Python, Go).",
    "Working familiarity with Git and the command line.",
    "Basic understanding of HTTP and relational databases.",
  ],
  accent: "indigo",
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
    title: "Bridge — fiat-to-stablecoin wallet system",
    summary:
      "A production-grade wallet that ingests card payments, custodies stablecoins on-chain, and settles back to fiat via bank rails.",
    deliverables: [
      "TypeScript API + Postgres ledger + BullMQ workers",
      "Go-based webhook ingester",
      "Solidity custody contract with role-based access",
      "Next.js operator dashboard",
      "Architecture, capacity, threat model, and runbook documents",
    ],
  },
};
