import type { Week } from "@/types/content";
import { blocks, callout, code, ul } from "@/content/courses/_helpers";
export const week10: Week = {
  id: "week-10",
  number: 10,
  title: "Competitive auditing: Code4rena, Sherlock, and live contests",
  stage: "Security Research Workflow",
  summary:
    "Competitive audits compress the audit lifecycle into a few days. We learn how to triage, prioritize, and write findings that win.",
  objectives: [
    "Plan a contest in 4-day, 7-day, and 30-day formats.",
    "Read a competition brief and identify high-leverage areas in the first 2 hours.",
    "Submit findings that survive judging — clear, severe, and unambiguous.",
    "Build a personal toolkit of utilities, snippets, and templates.",
  ],
  concepts: [
    "Severity rubrics in competitions",
    "Judging criteria and dispute resolution",
    "Finding deduplication",
    "Cohort dynamics — when to share, when not to",
  ],
  deliverables: [
    "Personal contest toolkit (snippets, scripts, templates).",
    "Plan + retrospective for one Code4rena or Sherlock contest you submit to.",
    "Three findings written to competition standards.",
  ],
  reviewGate:
    "Could you submit a credible H/M finding within the first 24 hours of a new contest?",
  stack: ["Audit", "Foundry", "Slither"],
  modules: [
    {
      id: "w10-m1",
      title: "Contest mechanics",
      summary:
        "The economics of competitive audits reward focus, speed, and writing.",
      lessons: [
        {
          id: "w10-l1",
          slug: "contest-strategy",
          title: "Contest strategy: the first 48 hours",
          summary:
            "Most submissions are written in the first 48 hours. Triage well and you punch above your hours.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["competitive-audit", "strategy"],
          blocks: blocks(
            ul([
              "Hour 0-2: read the brief, scope, README, threat model. Note assumptions.",
              "Hour 2-6: map the contracts. Annotate every external/public function with privileges and value flow.",
              "Hour 6-24: deep review of the highest-surface contracts — one per session, with 30-minute breaks.",
              "Hour 24-48: validate suspected findings with Foundry POCs. Reject anything you can't reproduce.",
              "Hour 48+: secondary sweep with Slither and a fresh look at any contracts you skipped.",
            ]),
            callout(
              "tip",
              "The hardest part of competitive audit is resisting the temptation to submit speculative findings. A finding with a flaky POC will be downgraded; better to spend the time hardening it.",
            ),
          ),
        },
        {
          id: "w10-l2",
          slug: "writing-winning-findings",
          title: "Writing findings that win",
          summary:
            "Judges read hundreds of findings. Yours has 30 seconds to convince them.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["reporting", "competitive-audit"],
          blocks: blocks(
            ul([
              "Lead with the impact: $X drained, Y users affected, when it happens.",
              "Then the path: numbered steps, with code references and line numbers.",
              "Then the POC: a Foundry test the judge can run in under 30 seconds.",
              "Then the fix: the smallest change that closes the bug.",
            ]),
            callout(
              "production",
              "If the judge can't run your POC, your finding is at risk. Always commit the POC as a Foundry test in your submission, never as a screenshot.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w10-l2-1",
              level: "senior",
              category: "Competitive audit",
              question:
                "Two auditors submit the same bug. How is duplication resolved?",
              modelAnswer:
                "Most platforms (Code4rena, Sherlock) split severity-weighted reward among duplicates by quality. The first quality submission earns more; later submissions earn less. Submission quality matters: a clear writeup with a working POC outranks a flaky description even if filed first. Always file early, even if rough — but then go back and improve before close.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w10-set-1",
      level: "senior",
      category: "Competitive auditing",
      question:
        "What's the highest-leverage habit you'd recommend to a new contest auditor?",
      modelAnswer:
        "Maintain a personal cheatsheet of every bug you've ever found, organized by class. When you start a new audit, walk the cheatsheet against the contract — many bugs repeat across protocols with cosmetic differences. Pair this with a personal Foundry helper library so you can write POCs in 5 minutes instead of 30. Both compound dramatically over a year.",
    },
  ],
  productionInsights: [
    {
      title: "The cheatsheet beats memory",
      summary:
        "After 10 audits, you've seen patterns. Write them down.",
      details:
        "A personal vulnerability cheatsheet, kept in a private repo and updated after every audit, is the cheapest leverage in competitive auditing. Each row: pattern, code shape, real-world example, mitigation. Walking it against a new contract surfaces 60% of findings before you've started thinking creatively.",
    },
  ],
};
