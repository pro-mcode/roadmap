import type { Week } from "@/types/content";
import { blocks, callout, h2, p, ul } from "@/content/courses/_helpers";

export const week12: Week = {
  id: "week-12",
  number: 12,
  title: "Capstone audit and security interview prep",
  stage: "Final Layer",
  summary:
    "Run a complete audit of a real protocol, write the report, and prepare for security-focused interviews and contest debuts.",
  objectives: [
    "Execute a full audit on a chosen target with a written report.",
    "Defend findings under technical Q&A.",
    "Prepare for senior security interviews at audit firms and protocol teams.",
    "Plan your first 90 days as a working auditor.",
  ],
  concepts: [
    "Capstone audit lifecycle",
    "Audit firm interview formats",
    "Building a public reputation",
    "Specialization paths: solidity vs Rust vs zk vs MEV",
  ],
  deliverables: [
    "Complete audit report on a real or simulated protocol.",
    "Mock interview transcripts covering coding, design, security review.",
    "90-day plan: contests, writeups, network, target firms.",
  ],
  reviewGate:
    "Does your audit report defend itself under technical scrutiny without you in the room?",
  stack: ["Audit", "Career"],
  modules: [
    {
      id: "w12-m1",
      title: "Capstone and career",
      summary:
        "Where you stop practicing audits and start doing them.",
      lessons: [
        {
          id: "w12-l1",
          slug: "capstone-audit",
          title: "The capstone audit",
          summary:
            "Pick a target — a real open-source protocol or a simulated codebase you build — and run a full audit through to a published report.",
          estimatedMinutes: 60,
          difficulty: "senior",
          tags: ["capstone", "audit"],
          blocks: blocks(
            h2("Pick the target"),
            ul([
              "Open-source protocol with a recent audit you can compare against.",
              "Or build a small flawed protocol, plant intentional bugs, and audit it cold.",
              "Or join a Code4rena/Sherlock contest as your capstone.",
            ]),
            h2("Run the audit"),
            ul([
              "Two-week timebox.",
              "Day 1: scope, threat model, plan.",
              "Days 2-10: review, POCs, draft findings.",
              "Days 11-12: writeup, severity discussion, fix recommendations.",
              "Day 13: peer review by a Discord/X audit community.",
              "Day 14: publish. The artifact is now part of your portfolio.",
            ]),
            callout(
              "production",
              "Public audit reports build reputation. Audit firms hire from people they've already seen ship quality work in public.",
            ),
          ),
        },
        {
          id: "w12-l2",
          slug: "interview-loop-security",
          title: "Security interview loop",
          summary:
            "Audit firms and protocol teams interview differently. We sketch both formats and the prep that gets you through them.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["interviews", "career"],
          blocks: blocks(
            h2("What firms test"),
            ul([
              "Vulnerability discovery: given a contract with planted bugs, how many do you find in 60 minutes?",
              "Severity reasoning: given a finding, can you defend its severity rubric?",
              "Codebase walkthrough: walk us through a protocol you've audited and your top finding.",
              "Communication: write a finding live, defend it under questions.",
              "Behavioral: how do you handle disagreement with a protocol team that won't fix?",
            ]),
            h2("What protocol teams test"),
            p(
              "Protocol teams that hire security engineers want a builder mindset: can you ship safe code, not just find unsafe code? Expect take-homes that ask you to write a feature with security review baked in. The interview is for a long-term partner, not a one-shot reviewer.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w12-l2-1",
              level: "senior",
              category: "Security interview",
              question:
                "A protocol team disagrees with your severity. They argue it should be Medium, you argue High. What now?",
              modelAnswer:
                "Anchor the conversation in the rubric. Walk through the rubric criteria one by one and show which the bug satisfies. If the team still disagrees, document both positions in the report — your finding stays at your severity, with their disagreement noted. The audit report is your professional artifact; bending to pressure damages future credibility. The relationship survives technical disagreement when both sides are rigorous; it doesn't survive cave-ins.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w12-set-1",
      level: "staff",
      category: "Career",
      question:
        "How do you choose between joining an audit firm and joining a protocol's security team?",
      modelAnswer:
        "Audit firms expose you to many codebases; you see the full distribution of patterns and grow fast. Protocol teams give you depth — you live with one system over years and see the consequences of every decision. Early career, the firm is usually the better learning environment. Later, joining a protocol you respect lets you shape security at design time rather than after-the-fact. Both are legitimate; the worst path is doing one when you actually want the other.",
    },
  ],
  productionInsights: [
    {
      title: "Build the public artifact",
      summary:
        "A polished public audit report opens more doors than any resume.",
      details:
        "Audit firms hire from a small pool of provably-skilled candidates. The fastest way to be that candidate is to ship public work: contest writeups, audit reports, GitHub repos demonstrating bugs and fixes. Reputation compounds; start the artifact early.",
    },
  ],
};
