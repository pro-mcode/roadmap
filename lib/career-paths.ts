import type { CareerPath } from "@/types/content";

/**
 * Career paths chain courses into goal-oriented sequences.
 * The total weeks of any path equals the sum of its courses.
 */
export const careerPaths: CareerPath[] = [
  {
    id: "fintech-backend",
    slug: "fintech-backend-engineer",
    title: "Fintech Backend Engineer",
    subtitle:
      "Backend engineering on the runtime, data, and architecture surfaces that fintech demands.",
    durationWeeks: 11,
    courseSlugs: [
      "typescript",
      "nodejs-express",
      "database-design",
      "system-design",
    ],
    description:
      "The shortest credible path from working backend engineer to fintech-backend ready. Builds the runtime habits, transactional database discipline, and system-level thinking that ledger and payment teams hire for.",
    outcomes: [
      "Ship typed Node services with bulletproof error contracts.",
      "Design schemas, transactions, and indexes that hold up under audit.",
      "Defend a system design at the senior interview bar.",
    ],
    audience:
      "Engineers with 1-3 years of backend experience targeting fintech roles.",
    accent: "indigo",
  },
  {
    id: "distributed-systems",
    slug: "distributed-systems-engineer",
    title: "Distributed Systems Engineer",
    subtitle:
      "Build the throughput and reliability layer behind any production platform.",
    durationWeeks: 11,
    courseSlugs: [
      "golang",
      "database-design",
      "system-design",
      "algorithms",
    ],
    description:
      "A path centered on the languages, data systems, and architectural patterns that distributed engineering rewards. Strong Go fundamentals, deep database craft, and a rigorous treatment of system design.",
    outcomes: [
      "Operate Go services with predictable latency and graceful failure modes.",
      "Reason about consistency, partitioning, and consensus from first principles.",
      "Pass senior distributed systems interviews with structured answers.",
    ],
    audience:
      "Engineers heading toward staff-level platform, infrastructure, or SRE roles.",
    accent: "teal",
  },
  {
    id: "smart-contract-engineer",
    slug: "smart-contract-engineer",
    title: "Smart Contract Engineer",
    subtitle:
      "Ship Solidity at production quality with the security mindset of an auditor.",
    durationWeeks: 8,
    courseSlugs: [
      "typescript",
      "blockchain-fundamentals",
      "solidity",
      "smart-contract-security",
    ],
    description:
      "From TypeScript fluency, into the EVM mental model, into Solidity at audit depth, then through the canonical security playbook. The path teams use to convert backend engineers into protocol engineers.",
    outcomes: [
      "Read and write Solidity at production quality.",
      "Run a meaningful internal security review on your own code.",
      "Defend protocol decisions in technical interviews.",
    ],
    audience:
      "Engineers transitioning from web2 to protocol or crypto-native roles.",
    accent: "violet",
  },
  {
    id: "smart-contract-auditor",
    slug: "smart-contract-auditor",
    title: "Smart Contract Auditor",
    subtitle:
      "Become a Rust-fluent auditor across EVM and Rust-based ecosystems.",
    durationWeeks: 8,
    courseSlugs: [
      "rust-language",
      "blockchain-fundamentals",
      "solidity",
      "smart-contract-security",
    ],
    description:
      "The dedicated path for auditors. Rust deep enough to read tooling and runtimes, EVM at audit depth, the vulnerability catalogue, methodology, and the security interview drill.",
    outcomes: [
      "Audit Solidity and Rust contracts with a structured methodology.",
      "Compete in Code4rena/Sherlock with a real shot at top finishes.",
      "Pass the audit firm interview loop.",
    ],
    audience:
      "Engineers with 2+ years of experience moving into security audits.",
    accent: "rose",
  },
  {
    id: "fullstack-crypto",
    slug: "fullstack-crypto-engineer",
    title: "Full-stack Crypto Engineer",
    subtitle:
      "From frontend integration to smart contracts to the backend that orchestrates them.",
    durationWeeks: 9,
    courseSlugs: [
      "typescript",
      "nodejs-express",
      "blockchain-fundamentals",
      "solidity",
    ],
    description:
      "Crypto-native product engineering: the language layer, the runtime, the chain, and the contract surface. The path that produces engineers who can ship a full crypto product.",
    outcomes: [
      "Build production wallet, DEX, or protocol UIs and APIs.",
      "Author and integrate Solidity contracts with your backend.",
      "Operate the full stack with confidence.",
    ],
    audience: "Generalist engineers shipping crypto products end-to-end.",
    accent: "amber",
  },
  {
    id: "master-roadmap",
    slug: "master-roadmap",
    title: "Master 24-week Roadmap",
    subtitle:
      "Every course in optimal sequence — language, runtime, data, systems, blockchain, security.",
    durationWeeks: 24,
    courseSlugs: [
      "typescript",
      "nodejs-express",
      "database-design",
      "algorithms",
      "system-design",
      "golang",
      "blockchain-fundamentals",
      "solidity",
      "rust-language",
      "smart-contract-security",
    ],
    description:
      "The complete curriculum. Two cumulative quarters that produce a senior engineer fluent across backend, distributed systems, and smart contracts.",
    outcomes: [
      "End-to-end fluency across runtime, data, distributed systems, and smart contracts.",
      "A portfolio of projects across the entire stack.",
      "Interview-ready for senior roles at fintech, distributed-systems, and crypto-native firms.",
    ],
    audience:
      "Engineers committing to a full 6-month curriculum to reach senior across multiple disciplines.",
    accent: "emerald",
  },
];

export function getAllCareerPaths(): CareerPath[] {
  return careerPaths;
}

export function getCareerPathBySlug(slug: string): CareerPath | undefined {
  return careerPaths.find((p) => p.slug === slug);
}
