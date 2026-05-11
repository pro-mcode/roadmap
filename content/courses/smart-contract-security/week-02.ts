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
  title: "Methodology and interview drill",
  stage: "Methodology",
  summary:
    "A repeatable 5-step audit methodology, a finding-writeup style, and the senior security interview drill.",
  objectives: [
    "Run a 5-step audit on a target codebase: scope, threat model, line-by-line, invariant testing, report.",
    "Write findings that survive triage.",
    "Pass a senior security interview with structured answers.",
    "Use Slither, Aderyn, and Foundry invariants in combination.",
  ],
  concepts: [
    "Audit methodology: 5 steps",
    "Severity rubrics (Code4rena, OWASP-style)",
    "Finding writeup style: impact, POC, recommendation",
    "Tooling: Slither, Aderyn, Foundry invariants",
  ],
  deliverables: [
    "Methodology checklist applied to a small target.",
    "Three findings written in firm-grade style.",
  ],
  reviewGate:
    "Walk me through how you'd approach an audit on a 2k LOC protocol you've never seen.",
  stack: ["Foundry", "Slither", "Aderyn"],
  modules: [
    {
      id: "sec-w02-m1",
      title: "Audit methodology",
      summary: "The structured pass that separates auditors from hobbyists.",
      progression: "advanced",
      lessons: [
        {
          id: "sec-w02-l1",
          slug: "the-five-step-audit",
          title: "The five-step audit",
          summary:
            "Scope. Threat model. Line-by-line. Invariant testing. Report. Repeat until you're fast.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["audit", "methodology"],
          blocks: blocks(
            ul([
              "Scope: lock the commit, list files, agree on out-of-scope.",
              "Threat model: actors, assets, trust assumptions. Write them down.",
              "Line-by-line: read every line at least twice. Note questions, don't chase rabbits yet.",
              "Invariants: write Foundry invariants for every protocol-level rule (sum-of-balances, monotonic timestamps, role transitions). Let the fuzzer find the gaps.",
              "Report: findings with impact, POC, recommendation, and severity per rubric.",
            ]),
            callout(
              "tip",
              "Time-box the line-by-line. Two passes is the rule: first for understanding, second for adversarial reading. After the second pass, your invariants will be sharp.",
            ),
          ),
        },
        {
          id: "sec-w02-l2",
          slug: "writing-findings",
          title: "Writing findings",
          summary:
            "Impact, POC, recommendation. Severity per a published rubric. Short and unambiguous.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["reporting"],
          blocks: blocks(
            p(
              "A finding is a small piece of evidence-based writing. Title states the bug. Impact explains who loses what. POC is a foundry test that demonstrates it. Recommendation is concrete code, not a paragraph of advice. Severity follows the rubric you agreed in scope.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-sec-w02-l2-1",
              level: "senior",
              category: "Audit interview",
              question:
                "An audit firm gives you a 2k LOC protocol you've never seen. How do you start?",
              modelAnswer:
                "Read the README and the docs first. Then sketch the threat model — who can call what, what asset moves where, what trust assumptions exist. Then a first pass for understanding, with a running notes file. Then invariants — list every protocol-level rule and codify each as a Foundry invariant. Then line-by-line adversarial reading. Findings go to a tracker as they're found, not at the end. Last day is for severity calibration and report polish.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Tooling is necessary but not sufficient",
      summary:
        "Slither and Aderyn catch the easy cases. Your brain catches the hard ones.",
      details:
        "Run the static analysers first; they free your attention for the bugs they can't find. Logic bugs, oracle assumptions, access-control mistakes — those still come from a careful human read, paired with strong invariant tests.",
    },
  ],
};
